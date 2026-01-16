import * as Koa from 'koa';
import { pathToRegexp } from 'path-to-regexp';
import Uma, { IContext, TMethodInfo, callMethod } from '@umajs/core';

import { TPathInfo } from './types/TPathInfo';
import { replaceTailSlash, MatchRegexp } from './helper';

export const Router:()=>Koa.Middleware = () => {
    console.log('======Init router start======');

    const ALLROUTE: string[] = [];
    const StaticRouterMap: Map<String, TPathInfo> = new Map();
    const RegexpRouterMap: Map<RegExp, TPathInfo> = new Map();

    // go through controllerInfo, and init each router map
    for (const controllerInfo of Uma.controllersInfo) {
        const { path: rootPath = '', clazz } = controllerInfo;
        const methodMap: Map<string, TMethodInfo> = controllerInfo.methodMap || new Map();

        // @Path routing processing
        for (const [methodName, methodInfo] of methodMap) {
            const { paths } = methodInfo;
            const pathInfo: TPathInfo = { methodName, ...controllerInfo };

            paths.forEach(({ path: methodPath, methodTypes }) => {
                if (!methodPath) return;

                // The route access address is the Path decorated address in the class + the Path decorated address of the method
                const routePath = replaceTailSlash(rootPath + methodPath) || '/';

                console.log(`[${methodTypes ? methodTypes.join() : 'ALL'}]:${routePath} ==> ${clazz.name}.${methodName}`);

                if (ALLROUTE.indexOf(routePath) > -1) {
                    console.error(`${routePath} ==> ${clazz.name}.${methodName} has been registered.
                        Recommended use the Path decorator to annotate the ${clazz.name}.controller.ts`);

                    return;
                }

                ALLROUTE.push(routePath);

                // If the Path set by the method contains :/(, it is considered as a regex matching route, otherwise it is a static route
                if (methodPath.indexOf(':') > -1 || methodPath.indexOf('(') > -1) {
                    const { regexp, keys } = pathToRegexp(routePath);

                    RegexpRouterMap.set(regexp, { ...pathInfo, keys, routePath, methodTypes });
                } else {
                    StaticRouterMap.set(routePath, { ...pathInfo, methodTypes });
                }
            });
        }
    }

    console.log('======Init router end======');

    const uma = Uma.instance();

    if (uma && uma instanceof Uma) uma.routers = ALLROUTE;

    return function router(ctx: IContext, next: Function) {
        const { method: methodType } = ctx.request;
        const reqPath = replaceTailSlash(ctx.request.path) || '/';

        // First match static routes (routerPath + methodPath), when the address matches the static route exactly
        const staticResult = StaticRouterMap.get(reqPath);

        if (staticResult && (!staticResult.methodTypes || staticResult.methodTypes.indexOf(methodType) > -1)) {
            const { clazz, methodName } = staticResult;

            return callMethod(clazz, methodName, {}, ctx, next);
        }

        // Match regex routes (routerPath + methodPath) after static routes have no matches
        const regexpResult = MatchRegexp(RegexpRouterMap, reqPath);

        if (regexpResult && (!regexpResult.methodTypes || regexpResult.methodTypes.indexOf(methodType) > -1)) {
            const { clazz, methodName, params = {} } = regexpResult;

            return callMethod(clazz, methodName, params, ctx, next);
        }

        return next();
    };
};
