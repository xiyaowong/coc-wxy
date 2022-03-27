import { commands, Disposable, MsgTypes, NotificationConfig, window } from 'coc.nvim';
import { getRandomCommandID, luacall } from './utils';

enum MessageLevel {
  More,
  Warning,
  Error,
}

class Window {
  public showMessage(msg: string, messageType: MsgTypes = 'more'): void {
    const that = window as any;
    const messageLevel = that.messageLevel as MessageLevel;
    let level = MessageLevel.Error;
    switch (messageType) {
      case 'more':
        level = MessageLevel.More;
        break;
      case 'warning':
        level = MessageLevel.Warning;
        break;
    }
    if (level >= messageLevel) {
      luacall('vim.notify', [msg, level + 2, { title: 'coc.nvim', timeout: 1000 }], true);
    }
  }

  public async showErrorMessage(message: string, ...items: string[]): Promise<string | undefined> {
    if (items.length == 0) {
      this.showMessage(message, 'error');
      return;
    }
    const that = window as any;
    if (!that.enableMessageDialog) return (await that.showConfirm(message, items, 'Error')) as any;
    const texts = typeof items[0] === 'string' ? items : (items as any[]).map((s) => s.title);
    const idx = await that.createNotification('CocErrorFloat', message, texts);
    return idx == -1 ? undefined : items[idx];
  }

  public async showWarningMessage(message: string, ...items: string[]): Promise<string | undefined> {
    if (items.length == 0) {
      this.showMessage(message, 'warning');
      return;
    }
    const that = window as any;
    if (!that.enableMessageDialog) return (await that.showConfirm(message, items, 'Warning')) as any;
    const texts = typeof items[0] === 'string' ? items : (items as any[]).map((s) => s.title);
    const idx = await that.createNotification('CocWarningFloat', message, texts);
    return idx == -1 ? undefined : items[idx];
  }

  public async showQuickpick(items: string[], placeholder = 'Choose one'): Promise<number> {
    const that = window as any;
    const release = await that.mutex.acquire();
    try {
      const title = placeholder + ':';
      items = items.map((s, idx) => `${idx + 1}. ${s}`);

      const command_id = getRandomCommandID('quickpick');
      await luacall("require('coc-wxy').quickpick", [title, items.map((s) => s.trim()), command_id]);

      let command: Disposable;
      const promise = new Promise<number>((resolve) => {
        command = commands.registerCommand(
          command_id,
          (res) => {
            command.dispose();
            resolve(res);
          },
          null,
          true
        );
      });

      const res = await promise;
      release();
      return res;
    } catch (e) {
      release();
      return -1;
    }
  }

  public async showNotification(config: NotificationConfig): Promise<boolean> {
    // NOTE: this will ignore callbacks, close button
    luacall('vim.notify', [config.content, 'info', config]);
    return true;
  }

  public async requestInput(title: string, defaultValue?: string): Promise<string> {
    const that = window as any;
    const release = await that.mutex.acquire();
    try {
      const command_id = getRandomCommandID('input');
      await luacall("require('coc-wxy').input", [title, defaultValue, command_id]);
      let command: Disposable;
      const promise = new Promise<string>((resolve) => {
        command = commands.registerCommand(
          command_id,
          (res) => {
            command.dispose();
            resolve(res);
          },
          null,
          true
        );
      });

      const res = await promise;
      release();
      return res;
    } catch (e) {
      release();
    }

    return '';
  }
}

export const myWindow = new Window();
