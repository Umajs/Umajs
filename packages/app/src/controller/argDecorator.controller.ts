import { BaseController, Result, Path, RequestMethod } from '@umajs/core';
import { Require, ToNumber, Body, Equals, Headers, Cookies, RequestFile, RequestParam } from "@umajs/arg-decorator";
import UserModel from './../model/user.model';
let { isRequire } = Body;
type user = {
    userId: string,
    age: number
}

@Path('/argDecorator')
export default class Modify extends BaseController {
    @Path('/query')
    index(@Require('userid') userId: string, @ToNumber('age') age: number) {
        // 测试路由@Path修饰冲突覆盖case
        return Result.send(`This router queryParms is ${userId} ${age}`);
    }

    @Path('/query/Equals')
    queryEquals(@Equals('userid', 0) userId: string, @ToNumber('age') age: number) {
        // 测试路由@Path修饰冲突覆盖case
        return Result.send(`This router queryParms is ${userId} ${age}`);
    }

    @Path('/model')
    @Path({ value: '/post', method: RequestMethod.POST })
    model(@Body(UserModel) userInfo: user) {
        return Result.send(`This Post body info is ${JSON.stringify(userInfo)}`);
    }

    @Path('/get')
    @Path({ value: '/post', method: RequestMethod.POST })
    test2(@Body.isRequire('age', '年龄为空') userInfo: user) {
        return Result.send(`This Post body info is ${JSON.stringify(userInfo)}`);
    }

    @Path({ value: '/bodyCheck', method: RequestMethod.POST })
    testValidated(@isRequire('用户id必填') userInfo: user) {
       
        return Result.send(`This Post body info is ${JSON.stringify(userInfo)}`);
    }
    @Path({ value: '/equals', method: RequestMethod.POST })
    equals(@Body.Equals('age', 18, '不是18岁！') @Body.isRequire('age') userInfo: user) {
        return Result.send(`This Post body info is ${JSON.stringify(userInfo)}`);
    }

    @Path({ value: '/post_argStr', method: RequestMethod.POST })
    test4(@Body('userid') userId: string) {
        return Result.send(`This Post body parms userid is ${userId}`);
    }

    @Path({ value: '/post_argArr', method: RequestMethod.POST })
    test5(@Body(['userid', 'age']) userInfo: user, @Body.Size('name', 1, 20) name: string) {
        return Result.send(`This Post body info is ${JSON.stringify(userInfo)}`);
    }

    @Path({ value: '/AssertFalse', method: RequestMethod.POST })
    AssertFalse(@Body.AssertFalse('fls') fls: Boolean) {
        return Result.send(`This Post body info is ${fls}`);
    }

    @Path({ value: '/AssertTrue', method: RequestMethod.POST })
    AssertTrue(@Body.AssertTrue('tru', '参数必须为true') tru: Boolean) {
        return Result.send(`This Post body info is ${tru}`);
    }

    @Path({ value: '/DecimalMax', method: RequestMethod.POST })
    DecimalMax(@Body.DecimalMax('DecimalMax', 10, '入参值不能超过10') DecimalMax: number) {
        return Result.send(`This Post body info is ${DecimalMax}`);
    }

    @Path({ value: '/DecimalMin', method: RequestMethod.POST })
    DecimalMin(@Body.DecimalMin('DecimalMin', 10) DecimalMin: number) {
        return Result.send(`This Post body info is ${DecimalMin}`);
    }

    @Path({ value: '/Max', method: RequestMethod.POST })
    Max(@Body.Max('Max', 10) Max: number) {
        return Result.send(`This Post body info is ${Max}`);
    }

    @Path({ value: '/Min', method: RequestMethod.POST })
    Min(@Body.Min('Min', 10) Min: number) {
        return Result.send(`This Post body info is ${Min}`);
    }

    @Path({ value: '/Future', method: RequestMethod.POST })
    Future(@Body.Future('Future') Future: Date) {
        return Result.send(`This Post body info is ${Future}`);
    }
    @Path({ value: '/Past', method: RequestMethod.POST })
    Past(@Body.Past('Past') Past: Date) {
        return Result.send(`This Post body info is ${Past}`);
    }

    @Path({ value: '/Pattern', method: RequestMethod.POST })
    Pattern(@Body.Pattern('Pattern', /^111/, 'Pattern必须为111开头') Pattern: any) {
        return Result.send(`This Post body info is ${Pattern}`);
    }

    @Path({ value: '/Size', method: RequestMethod.POST })
    Size(@Body.Size('Size', 10, 20) Size: number) {
        return Result.send(`This Post body info is ${Size}`);
    }

    @Path({ value: '/NotEmpty', method: RequestMethod.POST })
    NotEmpty(@Body.NotEmpty('id') id: number) {
        return Result.send(`This Post body info is ${id}`);
    }

    @Path({ value: '/NotBlank', method: RequestMethod.POST })
    NotBlank(@Body.NotBlank('id') id: number) {
        return Result.send(`This Post body info is ${id}`);
    }

    @Path({ value: '/Email', method: RequestMethod.POST })
    Email(@Body.Email('Email') Email: string) {
        return Result.send(`This Post body info is ${Email}`);
    }
    @Path({ value: '/Phone', method: RequestMethod.POST })
    Phone(@Body.Phone('Phone') Phone: number) {
        return Result.send(`This Post body info is ${Phone}`);
    }

    @Path({ value: '/ToDate', method: RequestMethod.POST })
    ToDate(@Body.ToDate('date') date: Date) {
        return Result.send(`This Post body info is ${date}`);
    }

    @Path({ value: '/ToBoolean', method: RequestMethod.POST })
    ToBoolean(@Body.ToBoolean('is') is: Boolean) {
        return Result.send(`This Post body info is ${is}`);
    }

    @Path({ value: '/ToNumber', method: RequestMethod.POST })
    ToNumber(@Body.ToNumber('number') number: number) {
        return Result.send(`This Post body info is ${number}`);
    }

    @Path({ value: '/ToArray', method: RequestMethod.POST })
    ToArray(@Body.ToArray('arr', '|') arr: Array<any>) {
        return Result.send(`This Post body info is ${arr.join(',')}`);
    }

    @Path('/cookies')
    cookies(@Cookies('name') name:string) {
        return this.send(`This request get cookies name is ${name}`);
    }

    @Path('/headers')
    headers(@Headers('Connection') Connection:string) {
        return this.send(`This request get Headers Connection is ${Connection}`);
    }

    @Path('/RequestParam')
    RequestParam(@RequestParam('param') param:string) {
        return this.send(`This request get param is ${param}`);
    }

    @Path('/RequestFile')
    RequestFile(@RequestFile('file') file:File) {
        return this.send(`This request get RequestFile file is ${file['path']}`);
    }
    
}
