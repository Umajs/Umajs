import * as pathToRegexp from 'path-to-regexp';
import Uma, { IContext, TMethodInfo, callMethod } from '@umajs/core';

import { TPathInfo } from './types/TPathInfo';
import { replaceTailSlash } from './helper';

export const Router = () => {
    console.log('======Init router start======');

    const ALLROUTE: string[] = [];
    const StaticRouterMap: Map<String, TPathInfo> = new Map();
    const RegexpRouterMap: Map<RegExp, TPathInfo> = new Map();

    // go through contollerInfo，and init each router map
    for (const controllerInfo of Uma.controllersInfo) {
        const { path: rootPath = '', clazz } = controllerInfo;
        const methodMap: Map<string, TMethodInfo> = controllerInfo.methodMap || new Map();

        // @Path 路由处理
        for (const [methodName, methodInfo] of methodMap) {
            const { paths } = methodInfo;
            const pathInfo: TPathInfo = { methodName, ...controllerInfo };

            paths.forEach(({ path: methodPath, methodTypes }) => {
                if (!methodPath) return;

                // 路由访问地址为class中的Path修饰地址 + method的Path修饰地址
                const routePath = replaceTailSlash(rootPath + methodPath) || '/';

                console.log(`[${methodTypes ? methodTypes.join() : 'ALL'}]:${routePath} ==> ${clazz.name}.${methodName}`);

                if (ALLROUTE.indexOf(routePath) > -1) {
                    console.error(`${routePath} ==> ${clazz.name}.${methodName} has been registered.
                        Recommended use the Path decorator to annotate the ${clazz.name}.controller.ts`);
                }

                ALLROUTE.push(routePath);

                // 如果method设置的Path中有:/(被认定为正则匹配路由，否则为静态路由
                if (methodPath.indexOf(':') > -1 || methodPath.indexOf('(') > -1) {
                    const keys: pathToRegexp.Key[] = [];
                    const pathReg = pathToRegexp(routePath, keys);

                    RegexpRouterMap.set(pathReg, { ...pathInfo, keys, routePath, methodTypes });
                } else {
                    StaticRouterMap.set(routePath, { ...pathInfo, methodTypes });
                }
            });
        }
    }

    console.log('======Init router end======');

    const uma = Uma.instance();

    if (uma && uma instanceof Uma) {
        uma.routers = ALLROUTE;
    }

    /**
     * 正则类型的url匹配
     * @param reqPath 请求地址
     */
    function MatchRegexp(reqPath: string) {
        for (const [reg, { clazz, methodName, keys, methodTypes }] of RegexpRouterMap) {
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

    return function router(ctx: IContext, next: Function) {
        const { method: methodType } = ctx.request;
        const reqPath = replaceTailSlash(ctx.request.path) || '/';

        // 先匹配静态路由(routerPath + methodPath)，地址和静态路由完全匹配时
        const staticResult = StaticRouterMap.get(reqPath);

        if (staticResult && (!staticResult.methodTypes || staticResult.methodTypes.indexOf(methodType) > -1)) {
            const { clazz, methodName } = staticResult;

            return callMethod(clazz, methodName, {}, ctx, next);
        }

        // 静态路由没有匹配项后匹配正则路由(routerPath + methodPath)
        const regexpResult = MatchRegexp(reqPath);

        if (regexpResult && (!regexpResult.methodTypes || regexpResult.methodTypes.indexOf(methodType) > -1)) {
            const { clazz, methodName, params = {} } = regexpResult;

            return callMethod(clazz, methodName, params, ctx, next);
        }

        return next();
    };
};
