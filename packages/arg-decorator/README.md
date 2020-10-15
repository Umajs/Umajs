# @umajs/arg-decorator
```Umajs``` 提供了 ```createArgDecorator``` 可以很方便的创建参数装饰器，并且框架还提供了如下装饰器直接使用。


## 使用
```ts
// url参数类型修饰校验
@Path('/saveUser')
saveUser(@Require('age') age :number) {
    return Result.send(`This router queryParms is ${userId} ${age}`);
}

// POST参数类型修饰校验
@Path({value:'/post',method:RequestMethod.POST})
saveUser(@Body.Require('age') age: number){
    return Result.send(`This Post body info is ${JSON.stringify(userInfo)}`);
}
```
当接口访问`localhost:port//saveUser`时，controller方法将终止执行，并默认返回客户端提示信息
```js
{
    "code": 0,
    "msg": "age 参数必须为数据类型。入参值undefined"
}
```

## API

|修饰器| 使用说明 | 
---|---
@Query(id:string) | url参数修饰器
@Body(id:string | Function | string[]) | POST请求参数修饰器
@Require(id: string,message?:string) | url参数修饰并做必填校验
@ToNumber(id: string,message?: string) | 参数修饰并类型转换为number类型  类型转换失败则会终止函数执行并返回提示内容
@ToBoolean(id: string,message?: string) |参数修饰并类型转换布尔类型 类型转换失败则会终止函数执行并返回提示内容
@ToDate(id: string,message?: string) | 参数修饰并类型转换为date类型  类型转换失败则会终止函数执行并返回提示内容
@Equals(id: string,comparison?: any) | 参数修饰并做值对比校验
@NotNull(id: string,message?: string) |	限制必须不为null 
@AssertFalse(id: string,message?: string) |		限制必须为false
@AssertTrue(id: string,message?: string)	 |	限制必须为true
@DecimalMax(id: string,value: number,message?: string) |		限制必须为一个不大于指定值的数字
@DecimalMin(id: string,value: number,message?: string) |		限制必须为一个不小于指定值的数字
@Future(id: string,message?: string)	 |	限制必须是一个将来的日期
@Max(id: string,value: number,message?: string)	 |	限制必须为一个不大于指定值的数字
@Min(id: string,value: number,message?: string)	 |	限制必须为一个不小于指定值的数字
@Past(id: string,message?: string)	 |	限制必须是一个过去的日期
@Pattern(id: string,pattern: RegExp,message?: string)	 |	限制必须符合指定的正则表达式
@Size(id: string,max: number,min: number,message?: string)	 |	限制字符长度必须在min到max之间
@NotEmpty(id: string,message?: string) 	 |		验证注解的元素值不为null且不为空（字符串长度不为0、集合大小不为0）
@NotBlank(id: string,message?: string)	 |	验证注解的元素值不为空（不为null、去除首位空格后长度为0），不同于@NotEmpty，@NotBlank只应用于字符串且在比较时会去除字符串的空格
@Email(id: string,message?: string) |		验证注解的元素值是Email
@Phone(id: string,message?: string) | 验证元素值是手机号

## 自定义校验提示内容
框架默认修饰器提示信息可以通过配置文件`src/config/argDecorator.config.ts`进行覆盖。通过`Result`模块用户可以自定义校验失败时返回的数据格式或者方式，比如json,或者状态码。
```ts
import { Result } from '@umajs/core';

export default {
    Require: {
        err({key, ctx, tip}) {
            return Result.send(tip || `请求${key} 参数不能为空。`,403);
        },
    },
    ToNumber: {
        err({key, ctx, tip}) {
            return Result.json({
                code: 0,
                msg: tip || `请求${key} 参数必须为数字类型。`,
            });
        },
    },
};


```