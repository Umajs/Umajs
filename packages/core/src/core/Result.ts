import * as stream from 'stream';
import * as send from 'koa-send';

import { CALLBACK_FIELD, VIEW_PATH, DOWNLOAD_PATH } from '../info/UniqueKey';
import { Results } from '../extends/Results';
import { IResult, TResultType } from '../types/IResult';
import { IContext } from '../types/IContext';

export default class Result<T> implements IResult<T> {
    constructor({ type, data, status }: IResult<T>) {
        this.type = type;
        this.data = data;
        this.status = status;
    }

    type: TResultType | string;

    data: T;

    status: number;

    static done() {
        return new Result<never>({
            type: 'done',
        });
    }

    static send<T = string | Buffer>(data: T, status?: number) {
        return new Result<T>({
            type: 'send',
            data,
            status,
        });
    }

    static json<T extends { [key: string]: any }>(data: T) {
        return new Result<T>({
            type: 'json',
            data,
        });
    }

    static jsonp<T extends { [key: string]: any }>(data: T, callbackField: string = 'callback') {
        return new Result<T>({
            type: 'jsonp',
            data: {
                ...data,
                [CALLBACK_FIELD]: callbackField,
            },
        });
    }

    static view(viewPath: string, locals: { [key: string]: any } = {}) {
        return new Result({
            type: 'view',
            data: {
                ...locals,
                [VIEW_PATH]: viewPath,
            },
        });
    }

    static stream(data: stream.Readable, fileName?: string) {
        return new Result({
            type: 'stream',
            data: {
                data,
                fileName,
            },
        });
    }

    static download(filePath: string, opts?: send.SendOptions) {
        return new Result({
            type: 'download',
            data: {
                ...opts,
                [DOWNLOAD_PATH]: filePath,
            },
        });
    }

    static redirect(url: string, alt?: string) {
        return new Result({
            type: 'redirect',
            data: {
                url,
                alt,
            },
        });
    }

    static finish<T>(ctx: IContext, result: Result<T>) {
        const { type, status, data } = result;

        if (status) ctx.status = status;

        return Reflect.get(Results, type)(ctx, data);
    }
}
