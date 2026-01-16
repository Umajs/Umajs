import * as Koa from 'koa';

import { IRequest } from './IRequest';
import { IResponse } from './IResponse';

export interface BaseContext {
    /**
     * Send content
     * @param data content
     * @param status status code
     */
    send(data: string, status?: number): void;

    /**
     * Send json
     * @param data json content
     */
    json(data: Object): void;

    /**
     * Send jsonp
     * @param data json content
     * @param callbackField callback field
     */
    jsonp(data: Object, callbackField?: string): void;

    /**
     * Send template
     * @param viewPath template path
     * @param locals variables
     */
    view(viewPath: string, locals?: any): void;

    /**
     * userAgent
     */
    userAgent: string;

    /**
     * Route parameters
     */
    param: any;

    /**
     * Set header
     * @param name header name
     * @param value header value
     */
    setHeader(name: string | any, value?: string | string[]): void;

    /**
     * Get header
     * @param name header name
     */
    getHeader(name: string | any): any;
}

export interface IContext extends Koa.Context, BaseContext {
    request: IRequest;
    response: IResponse;
}
