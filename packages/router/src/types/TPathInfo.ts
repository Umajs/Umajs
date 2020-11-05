import * as pathToRegexp from 'path-to-regexp';

export type TPathInfo = {
    // 文件名
    name?: string,

    // 方法名
    methodName?: string,

    // class 对象
    clazz?: Function,

    // methodPath匹配的param
    keys?: pathToRegexp.Key[];

    routePath?: string;

    methodTypes?: string[];
};
