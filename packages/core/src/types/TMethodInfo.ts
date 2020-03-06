import { TArg } from './TArg';

export type TMethodInfo = {
    name?: string; // 方法名
    path?: string[]; // 路径
    methodTypes: string[]; // 方法
    args?: TArg[];
    inside?: boolean; // 是否私有
}
