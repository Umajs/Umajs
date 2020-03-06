import { TControllerInfo } from '@ursajs/core';

import { ClazzMap, RegexpRouterMap } from './router';

/**
 * 正则类型的url匹配
 * @param reqPath 请求地址
 */
export function MatchRegexp(reqPath: string) {
    for (const [reg, { name: clazzName, methodName, keys }] of RegexpRouterMap) {
        const result = reg.exec(reqPath);

        if (result) {
            // mixin keys and params
            const params = {};
            const paramArr = result.slice(1);

            keys.forEach((k, i) => {
                params[k.name] = paramArr[i];
            });

            return { clazzName, methodName, params };
        }
    }

    return false;
}

/**
 * 判断 methodType和routerMap中的methodType 是否一致并返回 classInfo
 * @param routerMap 查找的路由表
 * @param clazz class
 * @param methodName method
 * @param methodType type
 */
export function getClazzInfo(clazzName: string, methodName: string, methodType: string): TControllerInfo {
    const clazzInfo = ClazzMap.get(clazzName);

    if (!clazzInfo) return null;

    const { methodMap = '' } = clazzInfo;

    // 如果该controller不存在methodMap，返回
    if (!methodMap) return clazzInfo;

    // 如果该methodMap不存在指定方法，返回
    const methodInfo = methodMap.get(methodName);

    if (!methodInfo) return clazzInfo;

    const { methodTypes } = methodInfo;

    if (!methodTypes || methodTypes.length === 0) return clazzInfo;

    return methodTypes.indexOf(methodType) > -1 ? clazzInfo : null;
}
