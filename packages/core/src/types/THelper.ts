import { TArg } from './TControllerInfo';

export type THelper = TArg & {
    clazzName?: string
    rootPath?: string
    path?: string
    methodTypes?: string[]
    inside?: boolean,
    // argDecorator?: (ctx: IContext, ...props: any[]) => any,
    // argProps?: any[],
    // argIndex?: number,
}
