import { IContext, Result } from '@umajs/core';

/* eslint-disable @typescript-eslint/no-unused-vars */
export default {
    Require: {
        err({key, ctx, tip}) {
            return Result.json({
                code: 0,
                msg: tip || `请求${key} 参数不能为空。`,
            });
        },
    },
    Number: {
        err({key, ctx, tip}) {
            return Result.json({
                code: 0,
                msg: tip || `请求${key} 参数必须为数字类型。`,
            });
        },
    },
};
