import * as Koa from 'koa';
import { Files } from 'formidable';

import { IContext } from './IContext';
import { IResponse } from './IResponse';

export interface BaseRequest {}

export interface IRequest extends Koa.Request, BaseRequest {
    ctx: IContext,
    response: IResponse,
    body?: any;
    files?: Files;
}
