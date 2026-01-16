import { createArgDecorator, IContext } from '@umajs/core';
import { Validate, Model } from '@umajs/class-validator';

import { TbodyDecorator } from './type';
import { DefualtReturn } from './Tips';
import Check from './check';

export const fn = (ctx: IContext, argKey?: string | Array<string> | Model | Function) => {
    const body = ctx.request.body || {};

    if (typeof argKey === 'string') return body[argKey];

    if (Array.isArray(argKey)) {
        const bodyParms = {};

        argKey.forEach((key) => {
            bodyParms[key] = body[key] || '';
        });

        return bodyParms;
    }

    if (typeof argKey === 'function' && typeof argKey.constructor === 'function') {
        const ArgModel:any = argKey;
        const [valid, schemeInfo] = Validate(new ArgModel(body, false));

        if (!valid) {
            return schemeInfo;
        }

        return DefualtReturn({ validate: valid, parms: schemeInfo });
    }

    if (typeof argKey === 'function') {
        const model = Reflect.construct(argKey, []);

        Reflect.ownKeys(model).forEach((key) => {
            if (body[key] !== undefined) model[key] = body[key];
        });

        return model;
    }

    return body;
};

/**
 * body decorator
 * @body()  Decorate the entire body
 * @body('key') Decorate a specific single property value
 * @body(['key1','key2']) Decorate multiple properties, return an object property containing key1, key2 properties
 * @body(Model) Decorate multiple properties, return a Model object
 */
export const Body: TbodyDecorator = createArgDecorator(fn);

/**
 * @Body.isRequire(key,tip)
 * @Body.isRequire([key1,key2],tip)
 * @Body.isRequire(Model,tip)
 */
const isRequire : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.isRequire(tip);
    });

const toNumber : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.toNumber(tip);
    });

const notEmpty : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.notEmpty(tip);
    });

const equals : (key: string, comparison:string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, comparison:string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.equals({ tip, comparison });
    });

const toArray : (key: string, split?:string, tip?:string) =>
ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, split?:string, tip?:string) => {
    const val = fn(ctx, argKey);
    const ck = new Check(ctx, argKey, val);

    return ck.toArray(tip, split);
});

const isBoolean : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.toBoolean(tip);
    });

const toDate : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.toDate(tip);
    });

const AssertFalse : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.assertFalse(tip);
    });

const AssertTrue : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.assertTrue(tip);
    });

const DecimalMax : (key: string, value:number, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, value: number, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.decimalMax({ tip, value });
    });

const DecimalMin : (key: string, value:number, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, value:number, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.decimalMin({ tip, value });
    });

const Max : (key: string, value:number, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, value:number, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.max({ tip, value });
    });

const Min : (key: string, value:number, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, value:number, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.min({ tip, value });
    });

const Future : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.future(tip);
    });

const Past : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.past(tip);
    });

const Pattern : (key: string, pattern:RegExp, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, pattern:RegExp, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.pattern({ tip, pattern });
    });

const Size : (key: string, min:number, max:number, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, min:number, max:number, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.size(tip, min, max);
    });

const NotBlank : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.notBlank(tip);
    });

const Email : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.isEmail(tip);
    });

const Phone : (key: string, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.isPhone(tip);
    });

Body.Require = isRequire;
Body.isRequire = isRequire;
Body.ToNumber = toNumber;
Body.isNumber = toNumber;
Body.NotEmpty = notEmpty;
Body.Equals = equals;
Body.isBoolean = isBoolean;
Body.ToBoolean = isBoolean;
Body.ToArray = toArray;
Body.ToDate = toDate;
// @AssertFalse(id,message)
Body.AssertFalse = AssertFalse; //  Must be false
// @AssertTrue(id,message) Must be true
Body.AssertTrue = AssertTrue;
// @DecimalMax(id,value,message) Must be a number not greater than the specified value
Body.DecimalMax = DecimalMax;
// @DecimalMin(id,value,message) Must be a number not less than the specified value
Body.DecimalMin = DecimalMin;
// @Max(id,value,message) Must be a number not greater than the specified value
Body.Max = Max;
// @Min(id,value,message) Must be a number not less than the specified value
Body.Min = Min;
// @Future(id,message) Must be a future date
Body.Future = Future;
// @Past(id,message) Must be a past date
Body.Past = Past;
// @Pattern(id,value,message) Must match the specified regular expression
Body.Pattern = Pattern;
// @Size(id,max,min,message) Character length must be between min and max
Body.Size = Size;
// @NotBlank(id,message) Validates that the annotated element value is not empty (not null, length is 0 after removing leading and trailing spaces).
// Unlike @NotEmpty, @NotBlank applies only to strings and removes spaces during comparison.
Body.NotBlank = NotBlank;
// @Email(id,message) Validates that the annotated element value is an Email. Custom email formats can also be specified via regex and flags.
Body.Email = Email;
// @Phone(id,message) Validates that the element value is a mobile phone number
Body.Phone = Phone;

// Body entity JSON validation
// Reference 1 https://github.com/eivindfjeldstad/validate
// Reference 2 https://github.com/skaterdav85/validatorjs#readme
