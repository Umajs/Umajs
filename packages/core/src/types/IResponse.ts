import * as Koa from 'koa';

import { IContext } from './IContext';
import { IRequest } from './IRequest';

export interface BaseResponse {}

export interface IResponse extends Koa.Response, BaseResponse {
    ctx: IContext;
    request: IRequest;
}
