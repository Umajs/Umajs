import { Result, TControllerInfo, IContext } from '@umajs/core';

import { TPathInfo } from './types/TPathInfo';
import { MatchRegexp, getClazzInfo } from './helper';

export const StaticRouterMap: Map<String, TPathInfo> = new Map();
export const RegexpRouterMap: Map<RegExp, TPathInfo> = new Map();
export const ClazzMap: Map<String, TControllerInfo> = new Map();

/**
 * 路由方法
 * @param ctx 上下文
 * @param next
 */
export default async function Router(ctx: IContext, next: Function) {
    const { path: reqPath, method: methodType } = ctx.request;

    // 先匹配静态路由(routerPath + methodPath)，地址和静态路由完全匹配时
    const staticResult = StaticRouterMap.get(reqPath);

    if (staticResult) {
        const { name: clazzName, methodName } = staticResult;

        return await callMethod(clazzName, methodName, {}, ctx, next, methodType);
    }

    // 静态路由没有匹配项后匹配正则路由(routerPath + methodPath)
    const regexpResult = MatchRegexp(reqPath);

    if (regexpResult) {
        const { clazzName, methodName, params = {} } = regexpResult;

        return await callMethod(clazzName, methodName, params, ctx, next, methodType);
    }

    // 上面都没有走默认路由(controllerName + methodName)
    const url = reqPath.slice(1);
    const pathArr: string[] = url ? url.split('/') : [];

    // 访问url必须为/xx/xx的格式，或者/，不满足返回
    if (!(pathArr.length === 2 || url === '')) return next();

    const [clazzName = 'index', methodName = 'index'] = pathArr;

    // 根据clazzName获取到当前controller信息
    const routeInfo: TControllerInfo = ClazzMap.get(clazzName);

    // 未获取到，返回
    if (!routeInfo) return next();

    const { clazz, methodMap = new Map() } = routeInfo;

    // controller must be have method and not configuration path
    const methodInfo = methodMap.get(methodName);

    // if is not clazz method, return
    if (!~Reflect.ownKeys(clazz.prototype).indexOf(methodName)) return next();

    // if is inside or has path decorator, return
    if (methodInfo && (methodInfo.inside || (methodInfo.path && methodInfo.path.length))) return next();

    return await callMethod(clazzName, methodName, {}, ctx, next, methodType);
}

/**
 * 调用方法
 * @param clazzName class
 * @param methodName 调用的方法名
 * @param param 参数
 * @param ctx 上下文
 * @param next
 * @param methodType 调用方式
 */
async function callMethod(clazzName: string, methodName: string, param: object, ctx: IContext, next: Function, methodType: string) {
    const clazzInfo = getClazzInfo(clazzName, methodName, methodType);

    if (!clazzInfo) return next();

    const { clazz, methodMap = new Map() } = clazzInfo;
    const { args: argArr = [] } = methodMap.get(methodName) || {};
    const instance = Reflect.construct(clazz, [ctx]);
    const method = Reflect.get(instance, methodName);
    const args = [];

    ctx.param = param;
    for (const { argKey, argIndex, argDecorator } of argArr) {
        const argVal = await Promise.resolve(argDecorator(argKey, ctx));

        if (argVal instanceof Result) return Result.finish(ctx, argVal);

        args[argIndex] = argVal;
    }

    const methodResult = await Promise.resolve(Reflect.apply(method, instance, args));

    if (methodResult instanceof Result) return Result.finish(ctx, methodResult);

    throw new Error(`[NOT_RETURN_RESULT] ${clazzName}.${methodName} does not return result, e.g "Result.[view|json]()"`);
}
