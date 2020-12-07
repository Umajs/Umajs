import * as pathToRegexp from 'path-to-regexp';
import Uma, { IContext, TControllerInfo, TMethodInfo, callMethod } from '@umajs/core';

import { TPathInfo } from './types/TPathInfo';
import { replaceTailSlash } from './helper';

export const Router = () => {
    console.log('======Init router start======');

    const ALLROUTE: string[] = [];
    const StaticRouterMap: Map<String, TPathInfo> = new Map();
    const RegexpRouterMap: Map<RegExp, TPathInfo> = new Map();
    const ClazzMap: Map<String, TControllerInfo> = new Map();

    // go through contollerInfo，and init each router map
    for (const controllerInfo of Uma.controllersInfo) {
        const { name: clazzName, path: rootPath = '', clazz } = controllerInfo;
        const methodMap: Map<string, TMethodInfo> = controllerInfo.methodMap || new Map();

        const decoratorMethodNameArr: string[] = [...methodMap.values()].map((m) => m.name);
        const methodNameArr: (string | number | symbol)[] = Reflect.ownKeys(clazz.prototype)
            .filter((name) => name !== 'constructor'
                && !decoratorMethodNameArr.includes(String(name))
                && typeof clazz.prototype[`${String(name)}`] === 'function');

        // 记录没有被修饰过的路由 默认路由 controller/method
        methodNameArr.forEach((methodName) => {
            ALLROUTE.push(`/${clazzName}/${String(methodName)}`);
        });

        // 主要是对被@Path修饰过的路由进行处理
        for (const [methodName, methodInfo] of methodMap) {
            const { paths } = methodInfo;
            const pathInfo: TPathInfo = { methodName, ...controllerInfo };

            paths.forEach(({ path: p, methodTypes }) => {
                if (!p) return;

                // 路由访问地址为class中的Path修饰地址 + method的Path修饰地址
                const routePath = replaceTailSlash(rootPath + p) || '/';

                if (!ALLROUTE.includes(String(routePath))) {
                    console.log(`[${methodTypes ? methodTypes.join() : 'ALL'}]:${routePath} ==> ${clazzName}.${methodName}`);
                    ALLROUTE.push(routePath);
                } else {
                    // 注册路由重复
                    console.error(`${routePath} ==> ${clazzName}.${methodName} has been registered.
                    Recommended use the Path decorator to annotate the ${clazzName}.controller.ts`);

                    return;
                }

                // 如果method设置的Path中有:/(被认定为正则匹配路由，否则为静态路由
                if (p.indexOf(':') > -1 || p.indexOf('(') > -1) {
                    const keys: pathToRegexp.Key[] = [];
                    const pathReg = pathToRegexp(routePath, keys);

                    RegexpRouterMap.set(pathReg, { ...pathInfo, keys, routePath, methodTypes });
                } else {
                    StaticRouterMap.set(routePath, { ...pathInfo, methodTypes });
                }
            });
        }

        // 保存所有的clazz信息到ClazzMap中
        ClazzMap.set(clazzName, controllerInfo);
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

        // 上面都没有走默认路由(controllerName + methodName)
        const url = reqPath.slice(1);
        const pathArr: string[] = url ? url.split('/') : [];

        // 默认 url 必须为/xx/xx的格式，或者/，不满足返回
        if (!(pathArr.length === 2 || url === '')) return next();

        const [clazzName = 'index', methodName = 'index'] = pathArr;

        // 根据clazzName获取到当前controller信息
        const controllerInfo: TControllerInfo = ClazzMap.get(clazzName);

        // 未获取到，返回
        if (!controllerInfo) return next();

        const { clazz, methodMap } = controllerInfo;

        // controller must be have method and not configuration path
        const methodInfo = methodMap.get(methodName);

        // if is not clazz method, return
        if (!~Reflect.ownKeys(clazz.prototype).indexOf(methodName)) return next();

        // if is inside or has path decorator, return
        if (methodInfo && (methodInfo.inside || (methodInfo.paths && methodInfo.paths.length))) return next();

        return callMethod(clazz, methodName, {}, ctx, next);
    };
};
