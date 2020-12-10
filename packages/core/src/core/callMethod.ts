import Result from '../core/Result';
import { IContext } from '../types/IContext';
import ControllerInfo from '../info/controllerInfo';
import { TMethodInfo } from '../types/TControllerInfo';

/**
 * 调用方法
 * @param clazzName class
 * @param methodName 调用的方法名
 * @param param 参数
 * @param ctx 上下文
 * @param next
 * @param methodType 调用方式
 */
export async function callMethod(clazz: Function, methodName: string, param: object, ctx: IContext, next: Function) {
    const clazzInfo = ControllerInfo.get(clazz);

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
