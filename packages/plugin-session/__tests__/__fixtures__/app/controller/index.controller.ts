import { BaseController, Result, Path } from '@umajs/core';

export default class Index extends BaseController {
    @Path('/')
    index() {
        this.ctx.cookies.set('c', 'cc');

        return Result.send('check cookie');
    }

    @Path('/ss')
    setsess() {
        this.ctx.session.set('s', 'ss');

        return Result.send('check-session');
    }
}
