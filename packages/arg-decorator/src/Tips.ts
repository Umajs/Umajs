import Uma, { Result, mixin } from '@umajs/core';

import { IArgErrorTip } from './type';
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Unified validation prompt return method. Use Result.json or Result.send as needed
 * @param msg Validation prompt message
 */
export const DefualtReturn = (msg:string|{[key: string]:any}) => Result.json({
    code: 0,
    msg,
});

const Tips = {
    Require: {
        err({ key, val, tip }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} parameter is required. Input value${val}`);
        },
    },
    NotEmpty: {
        err({ key, val, tip }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} parameter cannot be empty. Input value${val}`);
        },
    },
    NotBlank: {
        err({ key, val, tip }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} parameter cannot be empty. Input value${val}`);
        },
    },
    Equals: {
        err({ key, val, tip, comparison }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} parameter must be equal to${comparison}. Input value${val}`);
        },
    },
    toDate: {
        err({ key, val, tip }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} parameter must be a date format string. Input value${val}`);
        },
    },
    ToNumber: {
        err({ key, val, tip }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} parameter must be a number type. Input value${val}`);
        },
    },
    ToBoolean: {
        err({ key, val, tip }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} parameter must be true or false. Input value${val}`);
        },
    },
    ToArray: {
        err({ key, val, tip }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} parameter must be an array or string array type. Input value${val}`);
        },
    },
    AssertFalse: {
        err({ key, val, tip }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} parameter must be false. Input value${val}`);
        },
    },
    AssertTrue: {
        err({ key, val, tip }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} parameter must be true. Input value${val}`);
        },
    },
    DecimalMax: {
        err({ key, val, max, tip }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} parameter cannot exceed the maximum number${max}. Input value${val}`);
        },
    },
    DecimalMin: {
        err({ key, val, min, tip }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} parameter cannot be less than the minimum number${min}. Input value${val}`);
        },
    },
    Max: {
        err({ key, val, max, tip }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} parameter cannot exceed the maximum number${max}. Input value${val}`);
        },
    },
    Min: {
        err({ key, val, min, tip }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} parameter cannot be less than the minimum number${min}. Input value${val}`);
        },
    },
    Future: {
        err({ key, val, tip }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} parameter must be a future date format. Input value${val}`);
        },
    },
    Past: {
        err({ key, val, tip }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} parameter must be a past date format. Input value${val}`);
        },
    },
    Pattern: {
        err({ key, val, tip, pattern }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} parameter must match the regex${pattern}. Input value${val}`);
        },
    },
    Size: {
        err({ key, val, tip, min, max }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} parameter must be greater than ${min} and less than ${max}. Input value${val}`);
        },
    },
    isEmail: {
        err({ key, val, tip }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} parameter must be in email format. Input value${val}`);
        },
    },
    isPhone: {
        err({ key, val, tip }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} parameter must be a phone number type, input value${val}.
            Specific format referencehttps://github.com/validatorjs/validator.js/blob/master/src/lib/isMobilePhone.js.`);
        },
    },

};

// Can configure prompts via argDecorator.config.ts
mixin(true, Tips, Uma.config.argDecorator || {});

export default Tips;
