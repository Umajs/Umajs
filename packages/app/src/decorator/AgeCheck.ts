import { createArgDecorator, Result, IContext } from '@ursajs/core';

/**
 * 1、参数的聚合 Entity
 * 2、参数的校验
 * 3、参数的转换
 * 4、便捷方法
 * 5、utils、config 等也可以通过此装饰器快速引用
 */
export const AgeCheck = createArgDecorator((ageKey: string, ctx: IContext) => {
    let age = ctx.query[ageKey];

    if (age === undefined) return Result.json({
        code: 0,
        msg: '请加上 age 参数',
    });

    age = +age;

    if (Number.isNaN(age) || age < 0 || age > 120) return Result.json({
        code: 0,
        msg: '请传入正确的 age 参数',
    });

    return age;
});
