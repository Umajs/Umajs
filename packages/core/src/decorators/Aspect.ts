import * as Koa from 'koa';

import { BaseController } from '../core/BaseController';
import Result from '../core/Result';
import { IContext } from '../types/IContext';
import typeHelper from '../utils/typeHelper';

export interface IProceedJoinPoint<T = any> {
    target: T;
    args: Array<any>;
    proceed(...props: any[]): Promise<Result<any>>;
}

/**
 * 将中间件转成切面 Around 装饰器
 * @param middleware 中间件
 * eg:
    const around = middlewareToAround((ctx, next) => {
        console.log('》》', ctx.request.path);
        return next();
    });
    @Around(around)
 */
export function middlewareToAround(middleware: (Koa.Middleware<any, IContext>)) {
    return ({ target, proceed, args }: IProceedJoinPoint): Promise<Result<any>> => new Promise((resolve, reject) => {
        if (!(target instanceof BaseController)) throw new Error('@Around [middleware] only use on class extends BaseController.');

        middleware(target.ctx, async () => {
            try {
                const result = await proceed(...args);

                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    });
}

/**
 * 中间件
 * @param middleware 中间件
 * @returns Around 装饰器
 */
export function Middleware(middleware: (Koa.Middleware<any, IContext>)):Function {
    if (!typeHelper.isFunction(middleware)) throw new Error('@Middleware param must be Function.');

    return Around(middlewareToAround(middleware));
}

/**
 * @Around(around: Funtion)
 * @param aspect 指定的切面或切面名称 或者 切面类
 */
export function Around(around: (point: IProceedJoinPoint) => Promise<Result<any>>): Function {
    if (!typeHelper.isFunction(around)) throw new Error('@Around param must be Function.');

    return function aroundDecorator(target: Function, methodName: string, desc: PropertyDescriptor): PropertyDescriptor {
        if (!methodName) {
            Reflect.ownKeys(target.prototype).forEach((method: string) => {
                if (method === 'constructor' || !typeHelper.isFunction(Reflect.get(target.prototype, method))) return;

                const aroundMethod = aroundDecorator(target.prototype, method, Reflect.getOwnPropertyDescriptor(target.prototype, method));

                Reflect.defineProperty(target.prototype, method, aroundMethod);
            });

            return;
        }

        const { value: method, configurable, enumerable } = desc;

        return {
            configurable,
            enumerable,
            writable: true,
            value: async function aspect(...args: any[]) {
                const proceed = (...proceedArgs: any[]) => Reflect.apply(method, this, proceedArgs.length ? proceedArgs : args);

                return await Promise.resolve(Reflect.apply(around, this, [{ target: this, args, proceed }]));
            },
        };
    };
}
