import { TPathInfo } from './types/TPathInfo';

/**
 * replace tail '//' to '/'
 * replace tail '/home/' to '/home'
 * replace tail '//home' to /home'
 * replace tail '//home//index/' to '/home/index'
 * @param url string
 */
export function replaceTailSlash(url: string) {
    url = url.replace(/\/{2,}/g, '/');

    return url.endsWith('/') ? url.slice(0, -1) : url;
}

/**
 * 正则类型的url匹配
 * @param reqPath 请求地址
 */
export function MatchRegexp(regexpRouterMap: Map<RegExp, TPathInfo>, reqPath: string) {
    for (const [reg, { clazz, methodName, keys, methodTypes }] of regexpRouterMap) {
        const result = reg.exec(reqPath);

        if (result) {
            // mixin keys and params
            const params = {};
            const paramArr = result.slice(1);

            keys.forEach((k, i) => {
                params[k.name] = paramArr[i];
            });

            return { clazz, methodName, params, methodTypes };
        }
    }

    return false;
}
