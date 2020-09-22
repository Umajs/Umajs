import Uma, { createArgDecorator, IContext, mixin } from '@umajs/core';

import Tips from './Tips';

const uma = Uma.instance();

// 可以通过 argDecorator.config.ts 配置提示
mixin(true, Tips, uma.config.argDecorator || {});

/**
 * 参数必传
 */
export const Require = createArgDecorator((key: string, ctx: IContext) => {
    const val = ctx.query[key];

    if (!val) Tips.Require.err(key, ctx);

    return val;
});
