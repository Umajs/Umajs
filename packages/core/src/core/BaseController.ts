import { IContext, BaseContext } from '../types/IContext';
import { IRequest } from '../types/IRequest';
import { IResponse } from '../types/IResponse';

/**
 * controller 自带方法在 ctx 中也有相同实现
 */
export class BaseController implements BaseContext {
    constructor(readonly ctx: IContext) {
        const { request: req, response: res } = ctx;

        this.req = req;
        this.res = res;
    }

    req: IRequest;

    res: IResponse;

    set status(status: number) {
        this.ctx.status = status;
    }

    send(data: string, status?: number) {
        this.ctx.send(data, status);
    }

    json(data: Object) {
        this.ctx.json(data);
    }

    jsonp(data: Object, callbackField: string = 'callback') {
        this.ctx.jsonp(data, callbackField);
    }

    view(viewPath: string, locals: any = {}) {
        return this.ctx.view(viewPath, locals);
    }

    get userAgent() {
        return this.ctx.header['user-agent'];
    }

    get param() {
        return this.ctx.param;
    }

    setHeader(name: string | any, value: string | string[]): void {
        this.ctx.setHeader(name, value);
    }

    getHeader(name: string | any): any {
        return this.ctx.getHeader(name);
    }
}
