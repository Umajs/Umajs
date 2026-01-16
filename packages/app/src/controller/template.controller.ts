import { BaseController, Path, Post, Query, Param, RequestMethod } from '@umajs/core';
import { AgeCheck } from '../decorator/AgeCheck';
import { Result } from '../plugins/test/index';

@Path('/tpl')
export default class Template extends BaseController {
    @Path({ method: RequestMethod.GET })
    home() {
        return Result.send('this is home router in template1');
    }

    @Path()
    home_a() {
        return Result.send('this is home router in template2');
    }

    @Post('/p')
    @Path('/index')
    index() {
        return Result.send('this is index router in template');
    }

    @Path('/reg/:name*')
    reg(@AgeCheck('age') age: number, @Param('name') name: string) {
        return Result.send(`this is reg router. ${name} ${age}`);
    }

    @Path('/test')
    test(@Query('name') name: string) {
        console.log('hi tpl test', name);

        return Result.send('this is static router in template');
    }

    @Path('/jsonp')
    jsonpDemo() {
        return this.jsonp({ data: 123 });
    }

    @Path('/r')
    extendResult() {
        return Result.redirect2('/', 301);
    }
}
