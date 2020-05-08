import { BaseController, Result, Path } from '@umajs/core';

export default class Index extends BaseController {
    index() {
        this.ctx.cookies.set('haha', 'set cookie done');

        return Result.send(this.ctx.cookies.get('haha'));
    }

    @Path('/ss')
    setsess() {
        this.ctx.session.set('test', 'set session done');

        return Result.send(this.ctx.session.get('test'));
    }
}
