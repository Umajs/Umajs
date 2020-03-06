import { IContext, TPlugin } from "@ursajs/core";

export default <TPlugin>{
    context: {
        test: 123,
    },
    use: {
        async handler(ctx: IContext, next: Function) {
            console.log('use before');
            await next();
            console.log('use after');
        }
    },
    method: {
        type: 'GET',
        async handler(ctx: IContext, next: Function) {
            console.log('method get before');
            await next();
            console.log('method get after');
        }
    }
};