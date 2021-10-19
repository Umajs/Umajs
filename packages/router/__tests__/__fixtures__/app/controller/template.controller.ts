import { BaseController, Path, Result } from '@umajs/core';

@Path('/tpl')
export default class Template extends BaseController {
    @Path()
    home() {
        return Result.send('this is home router in template');
    }

    @Path('/reg/:name')
    reg() {
        return Result.send('this is reg router in template');
    }

    @Path('/static/test')
    test() {
        return Result.send('this is static router in template');
    }
}
