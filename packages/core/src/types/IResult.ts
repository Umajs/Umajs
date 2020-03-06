import * as fs from 'fs';

import { IContext } from '../types/IContext';

export interface IResults {
    done: (ctx: IContext, data: any) => void;
    send: (ctx: IContext, data: any) => void;
    json: (ctx: IContext, data: any) => void;
    jsonp: (ctx: IContext, data: any) => void;
    view: (ctx: IContext, data: any) => void;
    stream: (ctx: IContext, data: fs.ReadStream) => void;
    download: (ctx: IContext, data: any) => void;
    redirect: (ctx: IContext, data: any) => void;
}

export type TResultType = keyof IResults;

export interface IResult {
    type: TResultType; // 类别
    data?: any; // 数据
    status?: number; // 状态
}
