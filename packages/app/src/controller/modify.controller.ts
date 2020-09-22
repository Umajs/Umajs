import { BaseController, Result, Path } from '@umajs/core';

export default class Modify extends BaseController {
    @Path('/test')
    index() {
        // 测试路由@Path修饰冲突覆盖case
        return Result.send('This router is "/test/index"');
    }
    @Path('/test2')
    test2(){
        return Result.send('This router is "/test2"');
    }
    test3(){
        return Result.send('This router is "/modify/test3"');
    }
}
