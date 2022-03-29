import { ExtensionContext, window, workspace } from 'coc.nvim';
import { myWindow } from './window';

export async function activate(context: ExtensionContext): Promise<void> {
  const { nvim } = workspace;

  if (!(await nvim.call('exists', ['*luaeval']))) {
    window.showWarningMessage('coc-ui only works on neovim that supports lua');
    return;
  }

  // register runtimepath
  const runtimepath = (await nvim.getOption('runtimepath')) as string;
  if (!runtimepath.split(',').includes(context.extensionPath)) {
    await nvim.command(`execute 'noa set rtp+='.fnameescape('${context.extensionPath.replace(/'/g, "''")}')`);
  }
  await nvim.command(`doautocmd User CocUiInit`);

  window.showMessage = myWindow.showMessage;
  window.showQuickpick = myWindow.showQuickpick;
  window.showErrorMessage = myWindow.showErrorMessage;
  window.showWarningMessage = myWindow.showWarningMessage;
  window.showNotification = myWindow.showNotification;
  window.requestInput = myWindow.requestInput;
}
