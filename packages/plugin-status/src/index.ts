import * as Koa from 'koa';

export default (uma: any, options: any = { }): Koa.Middleware => async (ctx: Koa.Context, next: Function) => {
    const { prefix = '_' } = options;

    try {
        await next();
    } catch (err) {
        /* eslint-disable no-underscore-dangle */
        if (typeof options[`${prefix}error`] === 'function') {
            return options[`${prefix}error`](err, ctx, next);
        }

        throw err;
    }

    const statusFunction = options[`${prefix}${ctx.response.status}`];

    if (typeof statusFunction === 'function') {
        return statusFunction(ctx, next);
    }
};
