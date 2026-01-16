import { IContext, TPlugin, RequestMethod, Result as R } from '@umajs/core';

export class Result<T> extends R<T> {
    static redirect2(url: string, status: number) {
        return new Result({
            type: 'redirect',
            data: {
                url,
                status,
            },
        });
    }
}

export default (): TPlugin => ({
    context: {
        test: 123,
    },
    results: {
        redirect(ctx: IContext, data: any) {
            const { url, status } = data;

            ctx.status = status;

            return ctx.redirect(url);
        },
    },
    use: {
        async handler(ctx: IContext, next: Function) {
            console.log('use before');
            await next();
            console.log('use after');
        },
    },
    method: {
        type: RequestMethod.GET,
        async handler(ctx: IContext, next: Function) {
            console.log('method get before');
            await next();
            console.log('method get after');
        },
    },
});
