import { IContext } from './IContext';

export type TArg = {
    argDecorator?: (ctx: IContext, ...props: any[]) => any,
    argProps?: any[],
    argIndex?: number,
}

export type TPath = {
    path?: string; // 路径
    methodTypes?: string[]; // 方法
}

export type TMethodInfo = {
    name?: string; // 方法名
    paths?: Array<TPath>;
    args?: TArg[];
    inside?: boolean; // 是否私有
}

export type TControllerInfo = {
    path?: string // 路径
    clazz?: Function // class 对象
    methodMap?: Map<string, TMethodInfo> // 方法map
}

export type THelper = TArg & {
    rootPath?: string
    path?: string
    methodTypes?: string[]
}
