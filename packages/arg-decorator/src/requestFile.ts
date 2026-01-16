/*
 * @Author: zhang dajia
 * @Date: 2020-11-26 16:10:49
 * @Last Modified by: zhang dajia
 * @Last Modified time: 2020-11-26 18:33:07
 */
import { createArgDecorator, IContext } from '@umajs/core';

/** Decorator RequestFile
 * @RequestFile(field:string)
 */
export const RequestFile: (field: string) => ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string) => {
    const Method = ctx.request.method;

    console.assert(Method === 'POST', '@RequestFile only be used request method type of POST,pls install koa-body and set multipart as true');

    return ctx.request.files[argKey];
});
