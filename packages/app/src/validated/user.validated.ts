import { Resource } from '@umajs/core';
/**
 * 
 * @param target 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
 * @param propertyKey 成员的名字
 * @param argIndex 方法参数装饰器:参数在函数参数列表中的索引 访问器装饰器:成员的属性描述符
 */
function Require(target?: any, propertyKey?: string,argIndex?:any):any{
    console.log(target,propertyKey,argIndex)
    return 
}

function Max(target?: any, propertyKey?: number,maxKey?: any,argIndex?:any):any{
    console.log(target,propertyKey,argIndex)
    return 
}

function Phone(target?: any, propertyKey?: string,argIndex?:any):any{
    console.log(target,propertyKey,argIndex)
    return 
}

function Email(target?: any, propertyKey?: string,argIndex?:any):any{
    console.log(target,propertyKey,argIndex)
    return 
}

@Resource('user')
export default class user {
    @Require({'message':'用户姓名必传'})
    static age:string;
    @Max(18,35,{message:'{user.age.Max}'})
    age:string;
    @Phone({message:'{user.phone.Phone}'})
    phone:number;
    @Email({message:'{user.email.Email}'})
    email:string;
    static get height(){
        return 100;
    }
}

//  参考https://github.com/eivindfjeldstad/validate#readme