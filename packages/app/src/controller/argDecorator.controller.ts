import { BaseController, Inject, Result, Path, RequestMethod } from '@umajs/core';
import { Require, ToNumber, Body ,Equals} from "@umajs/arg-decorator";
let { isRequire } = Body;
type user = {
    userId:string,
    age:number
}


@Path('/argDecorator')
export default class Modify extends BaseController {
    @Inject('user')
    user: user;

    @Path('/query')
    index(@Require('userid') userId :string, @ToNumber('age') age:number) {
        // 测试路由@Path修饰冲突覆盖case
        return Result.send(`This router queryParms is ${userId} ${age}`);
    }
    @Path('/query/Equals')
    queryEquals(@Equals('userid',0) userId :string, @ToNumber('age') age:number) {
        // 测试路由@Path修饰冲突覆盖case
        return Result.send(`This router queryParms is ${userId} ${age}`);
    }
    @Path('/get')  // 待解决bugs：接口同时提供get 和post时 get请求404 
    @Path({value:'/post',method:RequestMethod.POST})
    test2(@Body.isRequire('age','年龄为空') userInfo: user){
        return Result.send(`This Post body info is ${JSON.stringify(userInfo)}`);
    }
    @Path({value:'/bodyCheck',method:RequestMethod.POST})
    testValidated(@isRequire('用户id必填') userInfo: user){
        return Result.send(`This Post body info is ${JSON.stringify(userInfo)}`);
    }
    @Path({value:'/equals',method:RequestMethod.POST})
    equals(@Body.equals('age',18,'不是18岁！') @Body.isRequire('age') userInfo: user){
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
