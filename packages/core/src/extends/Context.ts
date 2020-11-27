import Uma from '../core/Uma';
import typeHelper from '../utils/typeHelper';
import { BaseContext, IContext } from '../types/IContext';
import LazyModules from '../loader/LazyModules';

export const Context: BaseContext = {
    send(val: string | Buffer, status?: number) {
        if (status) this.status = status;
        this.body = val;
    },

    json(data: Object) {
        this.type = 'application/json';
        this.body = data;
    },

    jsonp(data: Object, callbackField: string = 'callback') {
        this.set('X-Content-Type-Options', 'nosniff');
        this.type = 'application/javascript';
        this.body = LazyModules.jsonpBody(data, callbackField, Uma.options.jsonpBody);
    },

    view(viewPath: string, locals: any = {}) {
        locals.ctx = this;

        return this.render(viewPath, locals);
    },

    get userAgent() {
        return this.header['user-agent'];
    },

    param: {},

    setHeader(name: string | { [key: string]: string }, value?: string | string[]): void {
        const ctx: IContext = this;

        if (ctx.res.headersSent) {
            console.error(new Error(`Cannot set headers after they are sent to the client, url: ${ctx.url}`));

            return;
        }

        if (typeHelper.isString(name) && value !== undefined) {
            ctx.set(name, value);
        }

        if (typeHelper.isObject(name)) {
            ctx.set(name);
        }
    },

    getHeader(name: string | any): any {
        return this.header[name.toLowerCase()];
    },
};
