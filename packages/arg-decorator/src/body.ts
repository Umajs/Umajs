import { createArgDecorator, IContext } from '@umajs/core';

import { TbodyDecorator } from './type';
import Check from './check';

const fn = (ctx: IContext, argKey?: string | Array<string> | Function) => {
    console.assert(typeof ctx.request.body !== 'undefined',
        '@Body decorator only can be used by POST RequestMethod , Please make sure you use it correctly.');
    const body = ctx.request.body || {};

    if (typeof argKey === 'string') return body[argKey];

    if (Array.isArray(argKey)) {
        const bodyParms = {};

        argKey.forEach((key) => {
            bodyParms[key] = body[key] || '';
        });

        return bodyParms;
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
 * body 装饰器
 * @body()  修饰完全body
 * @body('key') 修饰特定单个属性值
 * @body(['key1','key2']) 修饰多个属性，返回一个包含key1,key2属性的对象属性
 * @body(Model) 修饰多个属性，返回一个Model对象
 */
export const Body: TbodyDecorator = createArgDecorator(fn);

/**
 * @Body.isRequire(key,tip)
 * @Body.isRequire([key1,key2],tip)
 * @Body.isRequire(Model,tip)
 */
const isRequire : (key: string|Array<string>|Function, tip?:string) =>
    ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
        const val = fn(ctx, argKey);
        const ck = new Check(ctx, argKey, val);

        return ck.isRequire(tip);
    });

const toNumber : (key: string|Array<string>|Function, tip?:string) =>
ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
    const val = fn(ctx, argKey);
    const ck = new Check(ctx, argKey, val);

    return ck.toNumber(tip);
});

const notEmpty : (key: string|Array<string>|Function, tip?:string) =>
ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
    const val = fn(ctx, argKey);
    const ck = new Check(ctx, argKey, val);

    return ck.NotEmpty(tip);
});

const equals : (key: string|Array<string>|Function, comparison:string, tip?:string) =>
ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, comparison:string, tip?:string) => {
    const val = fn(ctx, argKey);
    const ck = new Check(ctx, argKey, val);

    return ck.Equals({ tip, comparison });
});

const isBoolean : (key: string|Array<string>|Function, tip?:string) =>
ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string, tip?:string) => {
    const val = fn(ctx, argKey);
    const ck = new Check(ctx, argKey, val);

    return ck.toBoolean(tip);
});

Body.isRequire = isRequire;
Body.toNumber = toNumber;
Body.isNumber = toNumber;
Body.notEmpty = notEmpty;
Body.equals = equals;
Body.isBoolean = isBoolean;
Body.toBoolean = isBoolean;

// Body 实体JSON校验 参考 https://github.com/eivindfjeldstad/validate
