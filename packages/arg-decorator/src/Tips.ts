import { IContext, Result } from '@umajs/core';

/* eslint-disable @typescript-eslint/no-unused-vars */
export default {
    Require: {
        err(key: string, ctx?: IContext, tip?: string) {
            return Result.json({
                code: 0,
                msg: tip || `${key} 参数不能为空。`,
            });
        },
    },
    Number: {
        err(key: string, ctx?: IContext, tip?: string) {
            return Result.json({
                code: 0,
                msg: tip || `${key} 参数必须为数据。`,
            });
        },
    }
};
