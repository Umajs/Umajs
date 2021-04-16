import { middlewareToAround } from '@umajs/core';

export const mw = middlewareToAround(async (ctx, next) => {
    console.log("****** mw before ******");
    await next();
    console.log("****** mw after *******");
});
