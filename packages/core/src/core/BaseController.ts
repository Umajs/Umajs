import Result from './Result';
import { IContext, BaseContext } from '../types/IContext';
import { IRequest } from '../types/IRequest';
import { IResponse } from '../types/IResponse';

/**
 * Base controller class
 * Provides helper methods and properties for controllers
 */
export class BaseController implements BaseContext {
    constructor(readonly ctx: IContext) {
        const { request: req, response: res } = ctx;

        this.req = req;
        this.res = res;
    }

    /**
     * Request object
     */
    req: IRequest;

    /**
     * Response object
     */
    res: IResponse;

    /**
     * Set response status
     * @param status HTTP status code
     */
    set status(status: number) {
        this.ctx.status = status;
    }

    /**
     * Send response
     * @param body Response body
     * @param status HTTP status code
     */
    send = Result.send;

    /**
     * Send JSON response
     * @param data JSON data
     */
    json = Result.json;

    /**
     * Send JSONP response
     * @param data JSON data
     * @param callback Callback function name
     */
    jsonp = Result.jsonp;

    /**
     * Render view
     * @param template Template file path
     * @param data Template data
     */
    view = Result.view;

    /**
     * Stream response
     * @param fileName File name
     * @param stream Read stream
     */
    stream = Result.stream;

    /**
     * Download file
     * @param filePath File path
     * @param fileName File name
     */
    download = Result.download;

    /**
     * Redirect
     * @param url Redirect URL
     * @param status HTTP status code
     */
    redirect = Result.redirect;

    /**
     * Get user agent
     */
    get userAgent() {
        return this.ctx.header['user-agent'];
    }

    /**
     * Get request parameters
     */
    get param() {
        return this.ctx.param;
    }

    /**
     * Set response header
     * @param name Header name
     * @param value Header value
     */
    setHeader(name: string | any, value: string | string[]): void {
        this.ctx.setHeader(name, value);
    }

    /**
     * Get request header
     * @param name Header name
     */
    getHeader(name: string | any): any {
        return this.ctx.getHeader(name);
    }
}
