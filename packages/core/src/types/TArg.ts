import { IContext } from './IContext';

export type TArg = {
    argDecorator?: (ctx: IContext, ...props: any[]) => any,
    argProps?: any[],
    argIndex?: number,
}
