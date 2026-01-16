import { Result } from '@umajs/core';

/* eslint-disable @typescript-eslint/no-unused-vars */
export default {
    Require: {
        err({key, ctx, tip}) {
            return Result.json({
                code: 0,
                msg: tip || `Request ${key} parameter cannot be empty.`,
            });
        },
    },
    Number: {
        err({key, ctx, tip}) {
            return Result.json({
                code: 0,
                msg: tip || `Request ${key} parameter must be a number type.`,
            });
        },
    },
};
