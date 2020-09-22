import { IContext, Result } from '@umajs/core';

/* eslint-disable @typescript-eslint/no-unused-vars */
export default {
    Require: {
        err(key: string, ctx?: IContext) {
            return Result.json({
                code: 0,
                msg: `${key} 参数不能为空。`,
            });
        },
    },
};
