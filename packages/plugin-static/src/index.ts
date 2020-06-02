import * as Koa from 'koa';
import * as koaStatic from 'koa-static';

export type staticOptions = koaStatic.Options;

export default (uma: any, options: { root: string, opts?: staticOptions }): Koa.Middleware => {
    const { root = './static', opts } = options;

    return koaStatic(root, opts);
};
