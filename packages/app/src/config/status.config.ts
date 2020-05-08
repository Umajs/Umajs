import { IContext } from '@umajs/core';

export default {
    _404(ctx: IContext) {
        ctx.status = 404;

        return ctx.view('404.html');
    }
}