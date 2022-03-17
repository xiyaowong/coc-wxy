import { commands, Disposable, MsgTypes, window } from 'coc.nvim';
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
}

export const myWindow = new Window();