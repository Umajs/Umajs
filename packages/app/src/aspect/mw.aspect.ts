import { middlewareToAround } from '@umajs/core';

export const mw = middlewareToAround(async (ctx, next) => {
    console.log("****** mw before ******");
    await next();
    console.log("****** mw after *******");
});

export const middleware = async (ctx,next)=>{
    console.log("****** middleware before ******");
    await next();
    console.log("****** middleware after *******");
}