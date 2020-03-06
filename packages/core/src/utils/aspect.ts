import * as Koa from 'koa';

import AspectLoader from '../loader/AspectLoader';

import { ENotice } from '../types/ENotice';
import { TMethodDecorator } from '../types/TDecorator';
import { IJoinPoint } from '../types/IJoinPoint';
import { IProceedJoinPoint } from '../types/IProceedJoinPoint';
import Result from '../core/Result';
import { IContext } from '../types/IContext';

/**
 * 将中间件转成切面 around 方法
 *
 * const middlewareFn = middleware(options)  // middleware
 * eg1: around = middlewareToAround(middlewareFn);
 * eg2: around({ target, proceed, args }) {
 *          await middlewareToAround(middlewareFn)({ target, proceed, args })
 *      }
 * @param mw 中间件
 */
export function middlewareToAround(mw: (Koa.Middleware<any, IContext>)) {
    return ({ target, proceed, args }: IProceedJoinPoint): Promise<Result> => new Promise((resolve, reject) => {
        mw(target.ctx, async () => {
            try {
                const result = await proceed(...args);

                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    });
}

/**
 * @Aspect('aspectName')
 * @param aspectName 作用的切面文件名
 * @param notices 指定通知
 */
export function aspect(aspectName: string, notices: ENotice[]): TMethodDecorator {
    const aspectClazz = AspectLoader.getAspect(aspectName);

    if (!aspectClazz) {
        throw new Error(`Aspect ${aspectName} not found.`);
    }

    return function aspectDecorator(target: Function, methodName: string, desc: PropertyDescriptor): PropertyDescriptor {
        if (!methodName) {
            Reflect.ownKeys(target.prototype).forEach((method: string) => {
                if (method === 'constructor') return;

                const aopMethod = aspectDecorator(target, method, Reflect.getOwnPropertyDescriptor(target.prototype, method));

                Reflect.defineProperty(target.prototype, method, aopMethod);
            });

            return;
        }

        const { value: method, configurable, enumerable } = desc;

        return {
            configurable,
            enumerable,
            writable: true,
            value: async function aop(...args: any[]) {
                const aspectInstance = Reflect.construct(aspectClazz, [this]);
                const { before, after, afterReturning, afterThrowing, around } = aspectInstance;
                const point: IJoinPoint = { args, target: this };

                let methodResult: any;
                let resultType: string = '';

                const proceed = async (...proceedArgs: any[]) => {
                    resultType = ENotice.afterReturning;

                    if (notices.includes(ENotice.before) && before) {
                        await Promise.resolve(Reflect.apply(before, aspectInstance, [point]));
                    }

                    return Reflect.apply(method, this, proceedArgs.length ? proceedArgs : args);
                };

                try {
                    if (notices.includes(ENotice.around) && around) {
                        const proceedPoint: IProceedJoinPoint = { proceed, ...point };

                        methodResult = await Promise.resolve(Reflect.apply(around, aspectInstance, [proceedPoint]));
                    } else {
                        methodResult = await proceed(...args);
                    }

                    if (!(methodResult instanceof Result)) throw new Error('Aspect.around must be "return Result[view|json]" or "return proceed(...args)"');
                } catch (err) {
                    methodResult = err;
                    resultType = ENotice.afterThrowing;
                }

                if (!resultType) return;

                if (notices.includes(ENotice.after) && after) {
                    await Promise.resolve(Reflect.apply(after, aspectInstance, [point]));
                }

                // 出错调用出错
                if (resultType === ENotice.afterThrowing) {
                    if (notices.includes(ENotice.afterThrowing) && afterThrowing) {
                        await Promise.resolve(Reflect.apply(afterThrowing, aspectInstance, [methodResult]));
                    } else if (methodResult instanceof Error) {
                        throw methodResult;
                    }
                }

                if (resultType === ENotice.afterReturning && notices.includes(ENotice.afterReturning) && afterReturning) {
                    await Promise.resolve(Reflect.apply(afterReturning, aspectInstance, [point, methodResult]));
                }

                return methodResult;
            },
        };
    };
}
