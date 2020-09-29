import { IContext } from '@umajs/core';
import validator from 'validator';
import Tips from './Tips';

export default class Check {
    ctx: any;

    key: any;

    val: any;

    constructor(ctx:IContext, key:any, val:any) {
        this.ctx = ctx;
        this.key = key;
        this.val = val;
    }

    /**
     *  if val be equal to empty string, null,undefined. return false
     * @param tip
     */
    isRequire(tip?:string) {
        if (!this.val) {
            return Tips.Require.err({ key: this.key, val: this.val, tip }); // As Require
        }

        return this.val;
    }

    NotEmpty(tip) {
        const valid = validator.isEmpty(this.val);

        if (valid) {
            return Tips.NotEmpty.err({ key: this.key, val: this.val, tip });
        }

        return this.val;
    }

    Equals({ comparison, tip }) {
        const valid = validator.equals(this.val, comparison);

        if (!valid) {
            return Tips.Equals.err({ key: this.key, val: this.val, tip, comparison });
        }

        return this.val;
    }

    isNumber(tip?:string) {
        return this.toNumber(tip);
    }

    toNumber(tip?:string) {
        const intVal = parseInt(this.val);

        if (Number.isNaN(intVal)) {
            return Tips.ToNumber.err({ key: this.key, val: this.val, tip });
        }

        return intVal;
    }

    toBoolean(tip?:string) {
        const { val, key, ctx } = this;

        if (typeof val === 'boolean') {
            return val;
        }

        if (['true', 'false'].indexOf(String(val)) !== -1) {
            return (JSON.parse(val));
        }

        return Tips.ToBoolean.err({ key, val, ctx, tip });
    }
}
