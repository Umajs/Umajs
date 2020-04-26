import * as Koa from 'koa';
import * as koaStatic from 'koa-static';

export default function (ursa: any, options: { root: string, opts?: koaStatic.Options }): Koa.Middleware {
    return koaStatic(options.root, options.opts);
}
