import { IContext } from './IContext';

export type IHelper = {
    clazzName?: string
    methodType?: string
    rootPath?: string
    mpath?: string
    inside?: boolean,
    argKey?: string,
    argIndex?: number,
    argDecorator?: (data: string, ctx: IContext) => any,
}
