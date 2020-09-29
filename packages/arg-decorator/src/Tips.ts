import Uma, { Result, mixin } from '@umajs/core';

import { IArgErrorTip } from './type';
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * 统一返回校验提示方法 按需使用Result.json 或者 Result.send
 * @param msg 校验提示信息
 */
const DefualtReturn = (msg:string) => Result.json({
    code: 0,
    msg,
});

const Tips = {
    Require: {
        err({ key, val, tip }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} 参数不能为空。入参值${val}`);
        },
    },
    NotEmpty: {
        err({ key, val, tip }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} 参数不能为空。入参值${val}`);
        },
    },
    Equals: {
        err({ key, val, tip, comparison }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} 参数必须等于${comparison}。入参值${val}`);
        },
    },
    ToNumber: {
        err({ key, val, tip }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} 参数必须为数据。入参值${val}`);
        },
    },
    ToBoolean: {
        err({ key, val, tip }:IArgErrorTip) {
            return DefualtReturn(tip || `${key} 参数必须为true或者false。入参值${val}`);
        },
    },
};

// 可以通过 argDecorator.config.ts 配置提示
mixin(true, Tips, Uma.config.argDecorator || {});

export default Tips;
