import { VimValue, workspace } from 'coc.nvim';
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
