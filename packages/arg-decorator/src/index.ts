import Uma, { createArgDecorator, IContext, mixin, Result } from '@umajs/core';

import Tips from './Tips';

// 可以通过 argDecorator.config.ts 配置提示
mixin(true, Tips, Uma.config.argDecorator || {});

/**
 * 参数必传
 */
export const Require: (key: string, tip: string) => Result | any = createArgDecorator((ctx: IContext, key: string, tip: string) => {
    const val = ctx.query[key] || ctx.body[key];

    if (!val) Tips.Require.err(key, ctx, tip);

    return val;
});

/**
 * 数字
 */
export const Number: (key: string) => Result | any = createArgDecorator((ctx: IContext, key: string, tip: string) => {
    const val = ctx.query[key] || ctx.body[key];
    const intVal = parseInt(val);

    if (intVal !== val) Tips.Number.err(key, ctx, tip);

    return intVal;
});
