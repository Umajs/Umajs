import { TMethodInfo } from './TMethodInfo';

export type TControllerInfo = {
    name?: string // 文件名
    path?: string // 路径
    clazz?: Function // class 对象
    methodMap?: Map<string, TMethodInfo> // 方法map
}
