import * as Koa from 'koa';
import * as views from 'koa-views';

type TKoaViewsOptions = {
    /*
    * autoRender the result into ctx.body, defaults to true
    */
    autoRender?: boolean,
    /*
    * default extension for your views
    */
    extension?: string,
    /*
    * these options will get passed to the view engine
    */
    options?: any,
    /*
    * map a file extension to an engine
    */
    map?: any,
    /*
    * replace consolidate as default engine source
    */
    engineSource?: any,
}

export type viewsOptions = {
    root?: string,
    opts?: TKoaViewsOptions,
}

export default (uma: any, options: viewsOptions = {}): Koa.Middleware => {
    const { root = './views', opts = {} } = options;

    return views(root, opts);
};
