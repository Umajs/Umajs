import * as Koa from 'koa';
import * as koaStatic from 'koa-static';

export default (uma: any, options: { root: string, opts?: koaStatic.Options }): Koa.Middleware => {
    const { root = './static', opts } = options;

    return koaStatic(root, opts);
};
