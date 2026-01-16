import Result from '../core/Result';
import type { IContext } from '../types/IContext';
import ControllerInfo from '../info/controllerInfo';
import type { TMethodInfo } from '../types/TControllerInfo';

/**
 * @param clazz class
 * @param methodName call class's method name
 * @param param method's param
 * @param ctx context
 * @param next Koa.next
 * @returns Promise<any>
 */
export async function callMethod(clazz: Function, methodName: string, param: object, ctx: IContext, next: Function) {
    const clazzInfo = ControllerInfo.get(clazz);

    if (!clazzInfo) return next();

    const { methodMap = new Map() } = clazzInfo;
    const methodInfo = methodMap.get(methodName) as TMethodInfo;

    if (!methodInfo) return next();

    const { args: argArr = [] } = methodInfo;
    // eslint-disable-next-line new-cap
    const instance = Reflect.construct(clazz, [ctx]);
    const method = Reflect.get(instance, methodName);

    if (typeof method !== 'function') return next();

    const args: any[] = [];

    ctx.param = param;

    for (const { argDecorator, argProps, argIndex } of argArr) {
        const argVal = await Promise.resolve(argDecorator(ctx, ...argProps));

        if (argVal instanceof Result) return Result.finish(ctx, argVal);

        args[argIndex] = argVal;
    }

    const methodResult = await Promise.resolve(Reflect.apply(method, instance, args));

    if (methodResult instanceof Result) return Result.finish(ctx, methodResult);

    throw new Error(`[NOT_RETURN_RESULT] ${clazz.name}.${methodName} does not return result, e.g "Result.[view|json]()"`);
}
