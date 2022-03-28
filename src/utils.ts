import { VimValue, workspace, commands, Disposable } from 'coc.nvim';
import { v1 as uuidv1 } from 'uuid';

const COMMAND_PREFIX = 'wxy';

export function luacall(fname: string, args?: VimValue | VimValue[]): Promise<any>;
export function luacall(fname: string, args: VimValue | VimValue[], isNotify: true): null;
export function luacall(
  fname: string,
  args: VimValue | VimValue[] = [],
  isNotify?: boolean
): Promise<any | null> | null {
  const { nvim } = workspace;
  // @ts-ignore
  const _args = nvim.getArgs(args) as VimValue[];
  const items = _args.map((_, index) => `_A[${index + 1}]`);
  // @ts-ignore
  return nvim.call('luaeval', [`${fname}(${items.join()})`, _args], isNotify);
}

export function getRandomCommandID(scope?: string): string {
  return scope && scope.length > 0 ? `${COMMAND_PREFIX}.${scope}.${uuidv1()}` : `${COMMAND_PREFIX}.${uuidv1()}`;
}

export async function getCommandResult<T>(commandID: string): Promise<T> {
  let command: Disposable;
  return new Promise<T>((resolve) => {
    command = commands.registerCommand(
      commandID,
      (res) => {
        command.dispose();
        resolve(res);
      },
      null,
      true
    );
  });
}

export const ui = {
  quickpick: "require('coc-wxy').quickpick",
  input: "require('coc-wxy').input",
};
