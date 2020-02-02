import { IContext } from './IContext';

export type TArg = {
    argKey: string,
    argIndex: number,
    argDecorator?: (data: string, ctx: IContext) => any,
}
