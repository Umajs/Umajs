
import { BaseController, Path, Around ,Middleware} from '@umajs/core';
import { method } from '../aspect/method.aspect';
import { mw ,middleware } from '../aspect/mw.aspect';


/**
 * 一个method只能被一个Around或者Middleware修饰作用，
 * 当多个Around或者Middleware修饰时,距离method最近的一个切面起作用
 */
@Around(mw) // 切面逻辑将被下面一个Around(method)覆盖
@Around(method) // 生效
@Path('/aroundTest')
export default class AroundController extends BaseController {
    // @Middleware(middleware) 生效
    @Path()
   async index() {
        const name = await this.getTitle();
        const description = this.getDiscription();
        return this.view('index.html', {
            frameName: name,
            description,
        });
    }
    getDiscription(){
        return '一个简单易用、扩展灵活，基于TypeScript的Node.js Web框架'
    }
    async getTitle(){
        return await Promise.resolve('UMajs')
    }
}
