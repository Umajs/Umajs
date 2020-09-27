import { BaseController, Result, Path, RequestMethod } from '@umajs/core';
import { Require, ToNumber, Body} from "@umajs/arg-decorator"
import { pathToFileURL } from 'url';
type user = {
    userId:string,
    age:number
}


@Path('/argDecorator')
export default class Modify extends BaseController {
    @Path('/query')
    index(@Require('userid') userId :string, @ToNumber('age') age:number) {
        // 测试路由@Path修饰冲突覆盖case
        return Result.send(`This router queryParms is ${userId} ${age}`);
    }
    @Path('/get')  // 待解决bugs：接口同时提供get 和post时 get请求404 
    @Path({value:'/post',method:RequestMethod.POST})
    test2(@Body() userInfo: user){
        return Result.send(`This Post body info is ${JSON.stringify(userInfo)}`);
    }
    @Path({value:'/post_argStr',method:RequestMethod.POST})
    test4(@Body('userid') userId: string){
        return Result.send(`This Post body parms userid is ${userId}`);
    }
    @Path({value:'/post_argArr',method:RequestMethod.POST})
    test5(@Body(['userid','age']) userInfo: user){
        return Result.send(`This Post body info is ${JSON.stringify(userInfo)}`);
    }
}
