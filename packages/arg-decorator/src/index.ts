import { createArgDecorator, IContext } from '@umajs/core';

import Check from './check';

export * from './body';

const fn = (ctx: IContext, argKey?: string) => ctx.query[argKey];

/**
 * param 装饰器
 */
export const Param: (key: string) => ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string):ParameterDecorator => ctx.param[argKey]);

/**
 * query 装饰器
 */
export const Query: (key: string) => ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string) => ctx.query[argKey]);

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
