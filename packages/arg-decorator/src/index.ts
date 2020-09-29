import { createArgDecorator, IContext } from '@umajs/core';

import Check from './check';

export * from './body';

/**
 * param 装饰器
 */
export const Param: (key: string) => ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string):ParameterDecorator => ctx.param[argKey]);

/**
 * query 装饰器
 */
export const Query: (key: string) => ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string) => ctx.query[argKey]);

/**
 * 参数必传
 */
export const Require: (key: string, tip?: string) => ParameterDecorator = createArgDecorator((ctx: IContext, key: string, tip: string) => {
    const val = ctx.query[key];
    const ck = new Check(ctx, key, val);

    return ck.isRequire(tip);
});

/**
 * 数字
 * toNumber? ParseInt?
 */
export const ToNumber: (key: string, tip?: string) => ParameterDecorator = createArgDecorator((ctx: IContext, key: string, tip: string) => {
    const val = ctx.query[key];
    const ck = new Check(ctx, key, val);

    return ck.toNumber(tip);
});

/**
 * 布尔类型转换校验
 */
export const ToBoolean: (key: string, tip?: string) => ParameterDecorator = createArgDecorator((ctx: IContext, key: string, tip: string) => {
    const val = ctx.query[key];
    const ck = new Check(ctx, key, val);

    return ck.toBoolean(tip);
});

export const NotEmpty: (key: string, tip?: string) => ParameterDecorator = createArgDecorator((ctx: IContext, key: string, tip: string) => {
    const val = ctx.query[key];
    const ck = new Check(ctx, key, val);

    return ck.NotEmpty(tip);
});

export const Equals: (key: string, comparison:string|number|any, tip?: string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, key: string, comparison:string, tip: string) => {
        const val = ctx.query[key];
        const ck = new Check(ctx, key, val);

        return ck.Equals({ tip, comparison });
    });
