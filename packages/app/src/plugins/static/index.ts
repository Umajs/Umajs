import * as Koa from 'koa';
import * as koaStatic from 'koa-static';

import { Ursa } from '@ursajs/core';

export default (ursa: Ursa, options: any = {}): Koa.Middleware => {
    return koaStatic(options.root, options.opts);
};
