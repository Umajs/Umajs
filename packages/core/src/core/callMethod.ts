import Result from '../core/Result';
import { IContext } from '../types/IContext';
import ControllerInfo from '../info/controllerInfo';
import { TMethodInfo } from '../types/TMethodInfo';
import { TControllerInfo } from '../types/TControllerInfo';

/**
 * 判断 methodType和routerMap中的methodType 是否一致并返回 classInfo
 * @param routerMap 查找的路由表
 * @param clazz class
 * @param methodName method
 * @param methodType type
 */
function getClazzInfo(clazz: Function, methodName: string, methodType: string): TControllerInfo {
    const clazzInfo = ControllerInfo.get(clazz);

    if (!clazzInfo) return null;

    const { methodMap = '' } = clazzInfo;

    // 如果该controller不存在methodMap，返回
    if (!methodMap) return clazzInfo;

    // 如果该methodMap不存在指定方法，返回
    const methodInfo = methodMap.get(methodName);

    if (!methodInfo) return clazzInfo;

    // 调用默认路由判断 method
    if (methodType) {
        const { paths = [] } = methodInfo;

        for (const { path, methodTypes = [] } of paths) {
            if (path === '/' && (methodTypes.length === 0 || methodTypes.includes(methodType))) return clazzInfo;
        }

        return null;
    }

    return clazzInfo;
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
export async function callMethod(clazz: Function, methodName: string, param: object, ctx: IContext, next: Function, methodType?: string) {
    const clazzInfo = getClazzInfo(clazz, methodName, methodType);

    if (!clazzInfo) return next();

    const { name: clazzName, methodMap = new Map() } = clazzInfo;
    const { args: argArr = [] } = <TMethodInfo>methodMap.get(methodName) || {};
    const instance = Reflect.construct(clazz, [ctx]);
    const method = Reflect.get(instance, methodName);

    if (typeof method !== 'function') return next(); // When Controller has been decorator by Service, Default route will be throw Error

    const args = [];

    ctx.param = param;
    for (const { argDecorator, argProps, argIndex } of argArr) {
        // v1.0.* TArg = { argDecorator, argKey, argIndex }
        const argVal = await Promise.resolve(argDecorator(ctx, ...argProps));

        if (argVal instanceof Result) return Result.finish(ctx, argVal);

        args[argIndex] = argVal;
    }

    const methodResult = await Promise.resolve(Reflect.apply(method, instance, args));

    if (methodResult instanceof Result) return Result.finish(ctx, methodResult);

    throw new Error(`[NOT_RETURN_RESULT] ${clazzName}.${methodName} does not return result, e.g "Result.[view|json]()"`);
}
