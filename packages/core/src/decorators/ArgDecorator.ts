import controllerInfo from '../info/controllerInfo';
import { IContext } from '../types/IContext';

/**
 * 自定义参数装饰器
 * @param fn (ctx: IContext, ...argProps: any[]) => (...argProps: any[]) => TParameterDecorator
 */
export function createArgDecorator(fn: (ctx: IContext, ...argProps: any[]) => any) {
    return (...argProps: any[]): ParameterDecorator => (target: any, propertyKey: string, argIndex: number) => {
        controllerInfo.setControllersInfo(target.constructor, propertyKey, {
            argDecorator: fn,
            argProps,
            argIndex,
        });
    };
}

/**
 * param 装饰器
 */
export const Param = createArgDecorator((ctx: IContext, argKey) => ctx.param[argKey]);

/**
 * query 装饰器
 */
export const Query = createArgDecorator((ctx: IContext, argKey) => ctx.query[argKey]);

/**
 * context 装饰器
 */
export const Context = createArgDecorator((ctx: IContext) => ctx);
