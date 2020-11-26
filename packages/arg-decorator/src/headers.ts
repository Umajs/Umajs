/*
 * @Author: zhang dajia
 * @Date: 2020-11-26 16:10:49
 * @Last Modified by: zhang dajia
 * @Last Modified time: 2020-11-26 16:20:30
 */
import { createArgDecorator, IContext } from '@umajs/core';

/** 装饰器 Headers
 * @Headers(key:string)
 */
export const Headers: (key: string) => ParameterDecorator = createArgDecorator((ctx: IContext, argKey: string) => ctx.get(argKey));
