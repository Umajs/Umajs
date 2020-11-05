import { TArg } from './TArg';

export type TPath = {
    path?: string; // 路径
    methodTypes?: string[]; // 方法
}

export type TMethodInfo = {
    name?: string; // 方法名
    paths?: Array<TPath>;
    args?: TArg[];
    inside?: boolean; // 是否私有
    methodTypes?: string[]; // 默认路由 method
}
