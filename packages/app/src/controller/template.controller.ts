import { BaseController, Path, Aspect, Query, Result, Param } from '@umajs/core';
import { AgeCheck } from '../decorator/AgeCheck';

@Path('/tpl')
export default class Template extends BaseController {
    @Path('/index')
    index() {
        return Result.send('this is index router in template');
    }

    @Path('/reg/:name*')
    @Aspect.around('test')
    reg(@AgeCheck('age') age: number, @Param('name') name: string) {
        return Result.send(`this is reg router. ${name} ${age}`);
    }

    @Aspect.around('mw')
    @Path('/test')
    test(@Query('name') name: string) {
        console.log('hi tpl test', name);
        return Result.send('this is static router in template');
    }

    @Path('/jsonp')
    jsonpDemo() {
        return this.jsonp({ data: 123 });
    }
}
