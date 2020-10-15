import { IContext } from '@umajs/core';
import validator from 'validator';
import Tips from './Tips';

export default class Check {
    ctx: any;

    key: any;

    val: any;

    constructor(ctx: IContext, key: any, val: any) {
        this.ctx = ctx;
        this.key = key;
        this.val = val;
    }

    /**
     *  if val be equal to empty string, null,undefined. return false
     * @param tip
     */
    isRequire(tip?: string) {
        if (!this.val) {
            return Tips.Require.err({ key: this.key, val: this.val, tip }); // As Require
        }

        return this.val;
    }

    notEmpty(tip) {
        const valid = validator.isEmpty(this.val, { ignore_whitespace: false });

        if (valid) {
            return Tips.NotEmpty.err({ key: this.key, val: this.val, tip });
        }

        return this.val;
    }

    notBlank(tip: string): any {
        const valid = validator.isEmpty(this.val, { ignore_whitespace: true });

        if (valid) {
            return Tips.NotEmpty.err({ key: this.key, val: this.val, tip });
        }

        return this.val;
    }

    equals({ comparison, tip }) {
        const valid = validator.equals(this.val, comparison);

        if (!valid) {
            return Tips.Equals.err({ key: this.key, val: this.val, tip, comparison });
        }

        return this.val;
    }

    isNumber(tip?: string) {
        return this.toNumber(tip);
    }

    /**
     * 必须为数字
     * @param tip
     */
    toNumber(tip?: string) {
        const intVal = parseInt(this.val);

        if (Number.isNaN(intVal)) {
            return Tips.ToNumber.err({ key: this.key, val: this.val, tip });
        }

        return intVal;
    }

    /**
     * 参数类型为Boolean
     * @param tip
     */
    toBoolean(tip?: string) {
        const { val, key, ctx } = this;

        if (typeof val === 'boolean') {
            return val;
        }

        if (['true', 'false'].indexOf(String(val)) !== -1) {
            return (JSON.parse(val));
        }

        return Tips.ToBoolean.err({ key, val, ctx, tip });
    }

    toDate(tip?: string) {
        const valid = validator.toDate(this.val);

        if (!valid) {
            return Tips.toDate.err({ key: this.key, val: this.val, tip });
        }

        return this.val;
    }

    /**
     * 限制必须为false
     * @param tip
     */
    assertFalse(tip?: string) {
        const { val, key, ctx } = this;

        if (['false'].indexOf(String(val)) !== -1) {
            return (JSON.parse(val));
        }

        return Tips.AssertFalse.err({ key, val, ctx, tip });
    }

    assertTrue(tip: string): any {
        const { val, key, ctx } = this;

        if (['false'].indexOf(String(val)) !== -1) {
            return (JSON.parse(val));
        }

        return Tips.AssertTrue.err({ key, val, ctx, tip });
    }

    decimalMax(arg0: { tip: string; value: number; }): any {
        const { tip, value } = arg0;
        const { val, key, ctx } = this;

        if (val <= value) {
            return (val - 0);
        }

        return Tips.DecimalMax.err({ key, val, max: value, ctx, tip });
    }

    decimalMin(arg0: { tip: string; value: any; }): any {
        const { tip, value } = arg0;
        const { val, key, ctx } = this;

        if (val >= value) {
            return (val - 0);
        }

        return Tips.DecimalMin.err({ key, val, min: value, ctx, tip });
    }

    max(arg0: { tip: string; value: any; }): any {
        const { tip, value } = arg0;
        const { val, key, ctx } = this;

        if (val <= value) {
            return (val - 0);
        }

        return Tips.Max.err({ key, val, max: value, ctx, tip });
    }

    min(arg0: { tip: string; value: any; }): any {
        const { tip, value } = arg0;
        const { val, key, ctx } = this;

        if (val >= value) {
            return (val - 0);
        }

        return Tips.Min.err({ key, val, min: value, ctx, tip });
    }

    future(tip: string): any {
        const valid = validator.isAfter(this.val);

        if (!valid) {
            return Tips.Future.err({ key: this.key, val: this.val, tip });
        }

        return this.val;
    }

    past(tip: string): any {
        const valid = validator.isBefore(this.val);

        if (!valid) {
            return Tips.Past.err({ key: this.key, val: this.val, tip });
        }

        return this.val;
    }

    pattern(arg0: { tip: string; pattern: RegExp; }): any {
        const { tip, pattern } = arg0;
        const { val, key, ctx } = this;

        if (pattern.test(val)) {
            return val;
        }

        return Tips.Pattern.err({ key, val, pattern, ctx, tip });
    }

    size(tip: string, max: number, min: number): any {
        const { val, key, ctx } = this;

        if (min < val && val < max) {
            return (val - 0);
        }

        return Tips.Size.err({ key, val, max, min, ctx, tip });
    }

    isEmail(tip: string): any {
        const valid = validator.isEmail(this.val);

        if (!valid) {
            return Tips.isEmail.err({ key: this.key, val: this.val, tip });
        }

        return this.val;
    }

    isPhone(tip: string): any {
        const valid = validator.isMobilePhone(this.val);

        if (!valid) {
            return Tips.isPhone.err({ key: this.key, val: this.val, tip });
        }

        return this.val;
    }
}
