import { BaseController, Path, Aspect, Query, Result, Param } from '@ursajs/core';
import { AgeCheck } from '../decorator/AgeCheck';

@Path('/tpl')
export default class Template extends BaseController {
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

    @Path('/ns')
    notSend() {
        console.log('.....This will not send any msg...');
    }
}
