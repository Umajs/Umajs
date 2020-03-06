import * as Koa from 'koa';
import * as views from 'koa-views';

import { Ursa } from '@ursa/core';

export default (ursa: Ursa, options: any = {}): Koa.Middleware => {
    return views(options.root, options.opts);
};
