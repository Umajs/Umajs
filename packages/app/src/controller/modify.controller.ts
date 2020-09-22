import { BaseController, Result , Require , Path ,Private} from '@umajs/core';

export default class Modify extends BaseController {
    @Path('/test')
    index(@Require('query') query:string) {
        // 测试路由@Path修饰冲突覆盖case
        return Result.send('This router is "/test/index"'+query);
    }
    @Path('/test2')
    test2(){
        return Result.send('This router is "/test2"');
    }
    test3(){
        return Result.send('This router is "/modify/test3"');
    }
}
