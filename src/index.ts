import { commands, Disposable, ExtensionContext, MsgTypes, VimValue, window, workspace } from 'coc.nvim';
import { v1 as uuidv1 } from 'uuid';

enum MessageLevel {
  More,
  Warning,
  Error,
}

export function luacall(func: string, args: VimValue[] = []): any[] {
  const items = args.map((_, index) => `_A[${index + 1}]`);
  return ['luaeval', [`${func}(${items.join()})`, args]];
}

export async function activate(context: ExtensionContext): Promise<void> {
  const that = window as any;
  const { nvim } = workspace;

  // register runtimepath
  const runtimepath = (await nvim.getOption('runtimepath')) as string;
  if (!runtimepath.split(',').includes(context.extensionPath)) {
    await nvim.command(`execute 'noa set rtp+='.fnameescape('${context.extensionPath.replace(/'/g, "''")}')`);
  }

  window.showMessage = (msg: string, messageType: MsgTypes = 'more'): void => {
    // @ts-ignore
    const messageLevel = window.messageLevel as MessageLevel;
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
      const [fname, args] = luacall('vim.notify', [msg, level + 2, { title: 'coc.nvim', timeout: 1000 }]);
      nvim.call(fname, args);
    }
  };

  window.showQuickpick = async (items: string[], placeholder = 'Choose one'): Promise<number> => {
    const release = await that.mutex.acquire();
    try {
      const title = placeholder + ':';
      items = items.map((s, idx) => `${idx + 1}. ${s}`);

      const command_id = `wxy.quickpick.${uuidv1()}`;
      const [fname, args] = luacall("require('coc-wxy').quickpick", [title, items.map((s) => s.trim()), command_id]);
      await nvim.call(fname, args);

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
  };

  // context.subscriptions.push(
  //   commands.registerCommand('wxy.test', async () => {
  //     window.showMessage('more', 'more');
  //     window.showMessage('warn', 'warning');
  //     window.showMessage('error', 'error');
  //
  //     const items = ['nvim', 'vim'];
  //     const res = await window.showQuickpick(items, 'nvim or vim ?');
  //     if (res != -1) {
  //       window.showMessage(items[res]);
  //     } else {
  //       window.showMessage('cancel');
  //     }
  //   })
  // );
}
