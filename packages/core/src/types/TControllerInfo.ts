import { IContext } from './IContext';

export type TArg = {
    argDecorator?: (ctx: IContext, ...props: any[]) => any,
    argProps?: any[],
    argIndex?: number,
}

export type TPath = {
    path?: string; // path
    methodTypes?: string[]; // method
}

export type TMethodInfo = {
    name?: string; // method name
    paths?: Array<TPath>;
    args?: TArg[];
    inside?: boolean; // is private
}

export type TControllerInfo = {
    path?: string // path
    clazz?: Function // class object
    methodMap?: Map<string, TMethodInfo> // method map
}

export type THelper = TArg & {
    rootPath?: string
    path?: string
    methodTypes?: string[]
}
