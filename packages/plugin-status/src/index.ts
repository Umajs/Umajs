import * as Koa from 'koa';

export type statusOptions = {
    /**
     * 前缀
     * 默认：_
     */
    prefix?: string,

    /**
     * 状态或者错误调用方法
     * 错误方法参数 (err, ctx, next)
     * 状态方法参数 (ctx, next)
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
