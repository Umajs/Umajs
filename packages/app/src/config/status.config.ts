import { IContext } from '@umajs/core';

export default {
    // eslint-disable-next-line no-underscore-dangle
    _404(ctx: IContext) {
        ctx.status = 404;

        return ctx.view('404.html');
    },
};
