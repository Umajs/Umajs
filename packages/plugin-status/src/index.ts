import * as Koa from 'koa';

export type statusOptions = {
    /**
     * Prefix
     * Default: _
     */
    prefix?: string,

    /**
     * Status or error call method
     * Error method parameters (err, ctx, next)
     * Status method parameters (ctx, next)
     */
    [key: string]: string | Function,
}

export default (uma: any, options: statusOptions = {}): Koa.Middleware => async (ctx: Koa.Context, next: Function) => {
    const { prefix = '_' } = options;

    try {
        await next();
    } catch (error) {
        const errorFunction = options[`${prefix}error`];

        if (typeof errorFunction === 'function') {
            return errorFunction(error, ctx, next);
        }

        throw error;
    }

    const statusFunction = options[`${prefix}${ctx.response.status}`];

    if (typeof statusFunction === 'function') {
        return statusFunction(ctx, next);
    }
};
