/*
 * @Author: zhang dajia
 * @Date: 2020-11-26 16:10:49
 * @Last Modified by: zhang dajia
 * @Last Modified time: 2020-11-26 17:37:56
 */
import { createArgDecorator, IContext, RequestMethod } from '@umajs/core';
import { fn as getBody } from './body';
import { fn as getQuery } from './index';

/** Decorator RequestParam
 * @RequestParam(key:string)
 */
export const RequestParam: (key: string) => ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string) => {
    const Method = ctx.request.method;
    let param = getQuery(ctx, argKey);

    if (param) return param;

    if (Method === RequestMethod.POST) {
        param = getBody(ctx, argKey);
    }

    return param;
});
