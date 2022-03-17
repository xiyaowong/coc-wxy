import { ExtensionContext, window, workspace } from 'coc.nvim';
import { myWindow } from './window';

export async function activate(context: ExtensionContext): Promise<void> {
  const { nvim } = workspace;

  // register runtimepath
  const runtimepath = (await nvim.getOption('runtimepath')) as string;
  if (!runtimepath.split(',').includes(context.extensionPath)) {
    await nvim.command(`execute 'noa set rtp+='.fnameescape('${context.extensionPath.replace(/'/g, "''")}')`);
  }

  window.showMessage = myWindow.showMessage;
  window.showQuickpick = myWindow.showQuickpick;
  window.showErrorMessage = myWindow.showErrorMessage;
  window.showWarningMessage = myWindow.showWarningMessage;
}
