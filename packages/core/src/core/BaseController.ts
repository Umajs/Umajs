import * as stream from 'stream';
import * as send from 'koa-send';

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

    send(data: string, status?: number) {
        return Result.send(data, status);
    }

    json(data: Object) {
        return Result.json(data);
    }

    jsonp(data: Object, callbackField: string = 'callback') {
        return Result.jsonp(data, callbackField);
    }

    async view(viewPath: string, locals: any = {}) {
        return Result.view(viewPath, locals);
    }

    stream(data: stream.Readable, fileName?: string) {
        return Result.stream(data, fileName);
    }

    download(filePath: string, opts?: send.SendOptions) {
        return Result.download(filePath, opts);
    }

    redirect(url: string, alt?: string) {
        return Result.redirect(url, alt);
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
