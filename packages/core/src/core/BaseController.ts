import Result from './Result';
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

    send = Result.send;

    json = Result.json;

    jsonp = Result.jsonp;

    view = Result.view;

    stream = Result.stream

    download = Result.download

    redirect = Result.redirect

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
