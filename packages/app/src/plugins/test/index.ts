import { Uma, IContext, TPlugin, RequestMethod } from "@umajs/core";

export default (uma: Uma, options: any = {}): TPlugin => {
    console.log(options);

    return {
        context: {
            test: 123,
        },
        use: {
            async handler(ctx: IContext, next: Function) {
                console.log('use before');
                await next();
                console.log('use after');

                if (ctx.status === 404) {
                    await ctx.view('404.html');
                }
            }
        },
        method: {
            type: RequestMethod.GET,
            async handler(ctx: IContext, next: Function) {
                console.log('method get before');
                await next();
                console.log('method get after');
            }
        }
    };
};
