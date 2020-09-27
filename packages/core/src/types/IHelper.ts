import { IContext } from './IContext';

export type IHelper = {
    clazzName?: string
    methodType?: string
    rootPath?: string
    mpath?: string
    inside?: boolean,
    argProps?: any[],
    argIndex?: number,
    argDecorator?: (ctx: IContext, ...props: any[]) => any,
}
