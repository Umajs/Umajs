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
 * param decorator
 */
export const Param: (key: string) => ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string):ParameterDecorator => fn1(ctx, argKey));

/**
 * query decorator
 */
export const Query: TQueryDecorator = createArgDecorator((ctx: IContext, argKey: string) => fn(ctx, argKey));

/**
 * Parameter required
 */
export const Require: (key: string, tip?: string) => ParameterDecorator = createArgDecorator((ctx: IContext, key: string, tip: string) => {
    const val = fn(ctx, key);
    const ck = new Check(ctx, key, val);

    return ck.isRequire(tip);
});

/**
 * Boolean type conversion validation
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
Query.AssertFalse = AssertFalse; //  Must be false
// @AssertTrue(id,message) Must be true
Query.AssertTrue = AssertTrue;
// @DecimalMax(id,value,message) Must be a number not greater than the specified value
Query.DecimalMax = DecimalMax;
// @DecimalMin(id,value,message) Must be a number not less than the specified value
Query.DecimalMin = DecimalMin;
// @Max(id,value,message) Must be a number not greater than the specified value
Query.Max = Max;
// @Min(id,value,message) Must be a number not less than the specified value
Query.Min = Min;
// @Future(id,message) Must be a future date
Query.Future = Future;
// @Past(id,message) Must be a past date
Query.Past = Past;
// @Pattern(id,value,message) Must match the specified regular expression
Query.Pattern = Pattern;
// @Size(id,max,min,message) Character length must be between min and max
Query.Size = Size;
// @NotBlank(id,message) Validates that the annotated element value is not empty
// (not null, length is 0 after removing leading and trailing spaces).
// Unlike @NotEmpty, @NotBlank applies only to strings and removes spaces during comparison.
Query.NotBlank = NotBlank;
// @Email(id,message) Validates that the annotated element value is an Email.
// Custom email formats can also be specified via regex and flags.
Query.Email = Email;
// @Phone(id,message) Validates that the element value is a mobile phone number
Query.Phone = Phone;
