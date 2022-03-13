import { createArgDecorator, IContext } from '@umajs/core';

import Check from './check';
import { TQueryDecorator } from './type';

export * from './body';

export * from './cookies';

export * from './headers';

export * from './requestFile';

export * from './requestParam';

export const fn = (ctx: IContext, argKey?: string) => ctx.query[argKey];

export const fn1 = (ctx: IContext, argKey?: string) => ctx.param[argKey];

/**
 * param 装饰器
 */
export const Param: (key: string) => ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string):ParameterDecorator => fn1(ctx, argKey));

/**
 * query 装饰器
 */
export const Query: TQueryDecorator = createArgDecorator((ctx: IContext, argKey: string) => fn(ctx, argKey));

/**
 * 参数必传
 */
export const Require: (key: string, tip?: string) => ParameterDecorator = createArgDecorator((ctx: IContext, key: string, tip: string) => {
    const val = fn(ctx, key);
    const ck = new Check(ctx, key, val);

    return ck.isRequire(tip);
});

/**
 * 布尔类型转换校验
 */
export const ToBoolean: (key: string, tip?: string) => ParameterDecorator = createArgDecorator((ctx: IContext, key: string, tip: string) => {
    const val = fn(ctx, key);
    const ck = new Check(ctx, key, val);

    return ck.toBoolean(tip);
});

export const Equals: (key: string, comparison:string|number|any, tip?: string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, key: string, comparison:string, tip: string) => {
        const val = fn(ctx, key);
        const ck = new Check(ctx, key, val);

        return ck.equals({ tip, comparison });
    });

export const ToNumber : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.toNumber(tip);
    });

export const isNumber = ToNumber;
export const isRequire = Require;

export const NotEmpty : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.notEmpty(tip);
    });

export const isBoolean : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.toBoolean(tip);
    });

export const ToArray : (key: string, split?:string, tip?:string) =>
ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, split?:string, tip?:string) => {
    const val = fn(ctx, argKey);
    const ck = new Check(ctx, argKey, val);

    return ck.toArray(tip, split);
});

export const ToDate : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.toDate(tip);
    });

export const AssertFalse : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.assertFalse(tip);
    });

export const AssertTrue : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.assertTrue(tip);
    });

export const DecimalMax : (key: string, value:number, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, value: number, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.decimalMax({ tip, value });
    });

export const DecimalMin : (key: string, value:number, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, value:number, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.decimalMin({ tip, value });
    });

export const Max : (key: string, value:number, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, value:number, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.max({ tip, value });
    });

export const Min : (key: string, value:number, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, value:number, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.min({ tip, value });
    });

export const Future : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.future(tip);
    });

export const Past : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.past(tip);
    });

export const Pattern : (key: string, pattern:RegExp, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, pattern:RegExp, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.pattern({ tip, pattern });
    });

export const Size : (key: string, min:number, max:number, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, min:number, max:number, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.size(tip, min, max);
    });

export const NotBlank : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.notBlank(tip);
    });

export const Email : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.isEmail(tip);
    });

export const Phone : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.isPhone(tip);
    });

Query.Require = isRequire;
Query.isRequire = isRequire;
Query.ToNumber = ToNumber;
Query.isNumber = ToNumber;
Query.NotEmpty = NotEmpty;
Query.Equals = Equals;
Query.isBoolean = isBoolean;
Query.ToBoolean = isBoolean;
Query.ToArray = ToArray;
Query.ToDate = ToDate;
// @AssertFalse(id,message)
Query.AssertFalse = AssertFalse; //  限制必须为false
// @AssertTrue(id,message)限制必须为true
Query.AssertTrue = AssertTrue;
// @DecimalMax(id,value,message)限制必须为一个不大于指定值的数字
Query.DecimalMax = DecimalMax;
// @DecimalMin(id,value,message)限制必须为一个不小于指定值的数字
Query.DecimalMin = DecimalMin;
// @Max(id,value,message)限制必须为一个不大于指定值的数字
Query.Max = Max;
// @Min(id,value,message)限制必须为一个不小于指定值的数字
Query.Min = Min;
// @Future(id,message)限制必须是一个将来的日期
Query.Future = Future;
// @Past(id,message)限制必须是一个过去的日期
Query.Past = Past;
// @Pattern(id,value,message)限制必须符合指定的正则表达式
Query.Pattern = Pattern;
// @Size(id,max,min,message)限制字符长度必须在min到max之间
Query.Size = Size;
// @NotBlank(id,message)验证注解的元素值不为空（不为null、去除首位空格后长度为0），不同于@NotEmpty，@NotBlank只应用于字符串且在比较时会去除字符串的空格
Query.NotBlank = NotBlank;
// @Email(id,message)验证注解的元素值是Email，也可以通过正则表达式和flag指定自定义的email格式
Query.Email = Email;
// @Phone(id,message)验证元素值是手机号
Query.Phone = Phone;
