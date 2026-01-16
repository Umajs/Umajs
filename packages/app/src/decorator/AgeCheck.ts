import { createArgDecorator, Result, IContext } from '@umajs/core';

/**
 * 1、Parameter aggregation Entity
 * 2、Parameter validation
 * 3、Parameter conversion
 * 4、Convenient method
 * 5、utils, config, etc. can also be quickly referenced via this decorator
 */
export const AgeCheck = createArgDecorator((ctx: IContext, ageKey: string) => {
    let age = <number><unknown>ctx.query[ageKey];

    if (age === undefined) return Result.json({
        code: 0,
        msg: 'Please add age parameter',
    });

    age = +age;

    if (Number.isNaN(age) || age < 0 || age > 120) return Result.json({
        code: 0,
        msg: 'Please pass correct age parameter',
    });

    return age;
});
