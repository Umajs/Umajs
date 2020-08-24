import { BaseController, Path, Private, Result } from '@umajs/core';

@Path('/tpl')
export default class Template extends BaseController {
    index() {
        return Result.send('this is index router in template');
    }

    @Path('/reg/:name')
    reg() {
        return Result.send('this is reg router in template');
    }

    @Path('/static/test')
    test() {
        return Result.send('this is static router in template');
    }

    @Private
    inline() {
        return Result.send('this is private router in template');
    }
}
