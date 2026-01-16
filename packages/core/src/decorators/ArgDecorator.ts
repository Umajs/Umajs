import controllerInfo from '../info/controllerInfo';
import { IContext } from '../types/IContext';

/**
 * create argument decorator
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
 * param decorator
 */
export const Param = createArgDecorator((ctx: IContext, argKey) => ctx.param[argKey]);

/**
 * query decorator
 */
export const Query = createArgDecorator((ctx: IContext, argKey) => ctx.query[argKey]);

/**
 * context decorator
 */
export const Context = createArgDecorator((ctx: IContext) => ctx);
