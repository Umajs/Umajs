import 'reflect-metadata';
import { IContext } from '../types/IContext';

export class Container {
    static get<T>(target: any, ctx: IContext): T {
        // If target is not a class, return it directly
        if (!target || typeof target !== 'function') {
            return target;
        }

        const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];

        // If no constructor params, instantiate directly
        if (paramTypes.length === 0) {
            // For backward compatibility and to support classes without decorators (like standard Controllers extending BaseController),
            // we pass ctx by default.
            // If the class doesn't accept arguments, JS simply ignores it.
            // If it expects ctx (like BaseController), it works.
            // eslint-disable-next-line new-cap
            return new target(ctx);
        }

        const args = paramTypes.map((param: any) => {
            // Since interfaces don't exist at runtime, 'IContext' becomes 'Object'.
            if (param === Object || param.name === 'Object') {
                // Likely the 'ctx' param in BaseController/BaseService
                return ctx;
            }

            // Recursive resolution
            return Container.get(param, ctx);
        });

        // Ensure we pass at least ctx if we failed to resolve any arguments but the target expects one
        // This is a safety net for when metadata is missing or partial
        if (args.length === 0 && target.length > 0) {
            // eslint-disable-next-line new-cap
            return new target(ctx);
        }

        // eslint-disable-next-line new-cap
        return new target(...args);
    }
}
