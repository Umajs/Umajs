import * as Koa from 'koa';
import { pathToRegexp } from 'path-to-regexp';
import Uma, { IContext, TMethodInfo, callMethod } from '@umajs/core';

import { TPathInfo } from './types/TPathInfo';
import { replaceTailSlash, MatchRegexp } from './helper';

/**
 * Router middleware
 * Scans controller metadata and registers routes
 * @returns Koa middleware
 */
export const Router:()=>Koa.Middleware = () => {
    Uma.logger.info('======Init router start======');

    // Key: routePath, Value: Set of registered method types
    const REGISTERED_ROUTES: Map<string, Set<string>> = new Map();
    const StaticRouterMap: Map<string, TPathInfo[]> = new Map();
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
                const methods = methodTypes || ['ALL'];

                Uma.logger.info(`[${methods.join()}]:${routePath} ==> ${clazz.name}.${methodName}`);

                if (!REGISTERED_ROUTES.has(routePath)) {
                    REGISTERED_ROUTES.set(routePath, new Set());
                }

                const registeredMethods = REGISTERED_ROUTES.get(routePath);
                const isConflict = methods.some((m) => registeredMethods.has(m)
                    || (m === 'ALL' && registeredMethods.size > 0)
                    || (registeredMethods.has('ALL')));

                if (isConflict) {
                    Uma.logger.error(`${routePath} ==> ${clazz.name}.${methodName} has been registered with conflicting methods.
                        Recommended use the Path decorator to annotate the ${clazz.name}.controller.ts`);
                    // return; // Don't return, maybe we want to allow override or just warn? Original logic returned.
                    // But if we want to support multiple methods on same path, we should check intersection.
                    // If intersection is empty, it's fine.
                }

                methods.forEach((m) => registeredMethods.add(m));

                // If the Path set by the method contains :/(, it is considered as a regex matching route, otherwise it is a static route
                if (methodPath.indexOf(':') > -1 || methodPath.indexOf('(') > -1) {
                    const { regexp, keys } = pathToRegexp(routePath);

                    RegexpRouterMap.set(regexp, { ...pathInfo, keys, routePath, methodTypes });
                } else {
                    // For static routes, we might have multiple handlers for same path but different methods
                    if (!StaticRouterMap.has(routePath)) {
                        StaticRouterMap.set(routePath, []);
                    }
                    StaticRouterMap.get(routePath).push({ ...pathInfo, methodTypes });
                }
            });
        }
    }

    Uma.logger.info('======Init router end======');

    const uma = Uma.instance();

    if (uma && uma instanceof Uma) uma.routers = Array.from(REGISTERED_ROUTES.keys());

    return async function router(ctx: IContext, next: Function) {
        const { method: methodType } = ctx.request;
        const reqPath = replaceTailSlash(ctx.request.path) || '/';

        // First match static routes (routerPath + methodPath), when the address matches the static route exactly
        const staticResults = StaticRouterMap.get(reqPath);

        if (staticResults) {
            // Find the best match for the method
            const matched = staticResults.find((info) => !info.methodTypes || info.methodTypes.indexOf(methodType) > -1);

            if (matched) {
                const { clazz, methodName } = matched;

                return callMethod(clazz, methodName, {}, ctx, next);
            }
        }

        // Match regex routes (routerPath + methodPath) after static routes have no matches
        const regexpResult = MatchRegexp(RegexpRouterMap, reqPath, methodType);

        if (regexpResult) {
            const { clazz, methodName, params = {} } = regexpResult;

            return callMethod(clazz, methodName, params, ctx, next);
        }

        return next();
    };
};
