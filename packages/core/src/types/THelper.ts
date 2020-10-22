import { TArg } from './TArg';

export type THelper = TArg & {
    clazzName?: string
    methodType?: string
    rootPath?: string
    mpath?: string
    inside?: boolean,
    // argDecorator?: (ctx: IContext, ...props: any[]) => any,
    // argProps?: any[],
    // argIndex?: number,
}
