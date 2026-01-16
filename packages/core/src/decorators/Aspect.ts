import * as Koa from 'koa';

import { BaseController } from '../core/BaseController';
import Result from '../core/Result';
import controllerInfo from '../info/controllerInfo';
import { IContext } from '../types/IContext';
import typeHelper from '../utils/typeHelper';

export interface IProceedJoinPoint<T = any, P = any> {
    target: T;
    args: Array<any>;
    proceed(...props: any[]): P;
}

/**
 * Convert middleware to Around aspect decorator
 * @param middleware middleware
 * @deprecated - Use `Middleware` instead
 */
export function middlewareToAround(middleware: (Koa.Middleware<any, IContext>)) {
    console.warn('[Warning] @middlewareToAround is deprecated! Use @Middleware instead');

    return middlewareToAspect(middleware);
}

/**
 * Convert middleware to Around aspect decorator
 * @param middleware koa middleware
 * @returns Around aspect function
 */
function middlewareToAspect(middleware: (Koa.Middleware<any, IContext>)) {
    return ({ target, proceed, args }: IProceedJoinPoint): Promise<Result<any>> => new Promise((resolve, reject) => {
        if (!(target instanceof BaseController)) {
            reject(new Error('@Around [middleware] only use on class extends BaseController.'));

            return;
        }

        try {
            // eslint-disable-next-line no-void
            void middleware(target.ctx, async () => {
                try {
                    const result = await proceed(...args);

                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Middleware
 * @param middleware middleware
 * @returns Around decorator
 */
export function Middleware(middleware: (Koa.Middleware<any, IContext>)): Function {
    if (!typeHelper.isFunction(middleware)) throw new Error('@Middleware param must be Function.');

    return Around(middlewareToAspect(middleware));
}

/**
 * @Around(around: Funtion)
 * @param aspect specified aspect or aspect name or aspect class
 */
export function Around<P = any>(around: (point: IProceedJoinPoint<any, P>) => P): Function {
    if (!typeHelper.isFunction(around)) throw new Error('@Around param must be Function.');

    return function aroundDecorator(target: Function, methodName: string, desc: PropertyDescriptor): PropertyDescriptor | void {
        if (!methodName) {
            Reflect.ownKeys(target.prototype).forEach((method: string | symbol) => {
                if (method === 'constructor' || typeof method !== 'string') return;

                if (!controllerInfo.isAspectMethod(target, method)
                    || !typeHelper.isFunction(Reflect.get(target.prototype, method))) return;

                const aroundMethod = aroundDecorator(
                    target.prototype,
                    method,
                    Reflect.getOwnPropertyDescriptor(target.prototype, method) as PropertyDescriptor,
                );

                if (aroundMethod) {
                    Reflect.defineProperty(target.prototype, method, aroundMethod);
                }
            });

            return;
        }

        const { value: method, configurable, enumerable } = desc;

        if (!typeHelper.isFunction(method)) return;

        return {
            configurable,
            enumerable,
            writable: true,
            value: function aspect(...args: any[]) {
                const proceed = (...proceedArgs: any[]) => Reflect.apply(method, this, proceedArgs.length ? proceedArgs : args);

                return Reflect.apply(around, this, [{ target: this, args, proceed }]);
            },
        };
    };
}
