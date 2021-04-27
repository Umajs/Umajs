import * as Koa from 'koa';

import { IRequest } from './IRequest';
import { IResponse } from './IResponse';

export interface BaseContext {
    /**
     * 发送内容
     * @param data 内容
     * @param status 状态码
     */
    send(data: string, status?: number): void;

    /**
     * 发送json
     * @param data json内容
     */
    json(data: Object): void;

    /**
     * 发送 jsonp
     * @param data json内容
     * @param callbackField 回调字段
     */
    jsonp(data: Object, callbackField?: string): void;

    /**
     * 发送模板
     * @param viewPath 模板地址
     * @param locals 变量
     */
    view(viewPath: string, locals?: any): void;

    /**
     * userAgent
     */
    userAgent: string;

    /**
     * 路由参数
     */
    param: any;

    /**
     * 设置 header
     * @param name header 名称
     * @param value header 值
     */
    setHeader(name: string | any, value?: string | string[]): void;

    /**
     * 获取 header
     * @param name header 名称
     */
    getHeader(name: string | any): any;
}

export interface IContext extends Koa.Context, BaseContext {
    request: IRequest;
    response: IResponse;
}
