import * as send from 'koa-send';

import { CALLBACK_FIELD, VIEW_PATH, DOWNLOAD_PATH } from '../info/UniqueKey';
import { IContext } from '../types/IContext';
import { IResults, TResultStreamData, TResultRedirectData, TResultDownData, TResultViewData, TResultJsonData, TResultJsonpData } from '../types/IResult';

export const Results: IResults = {
    done() {
    },
    send(ctx: IContext, data: any) {
        return ctx.send(data);
    },
    json(ctx: IContext, data: TResultJsonData) {
        return ctx.json(data);
    },
    jsonp(ctx: IContext, data: TResultJsonpData) {
        const { [CALLBACK_FIELD]: callbackField, ...jsonpData } = data;

        return ctx.jsonp(jsonpData, callbackField);
    },
    view(ctx: IContext, data: TResultViewData) {
        const { [VIEW_PATH]: viewPath, ...viewData } = data;

        return ctx.view(viewPath, viewData);
    },
    stream(ctx: IContext, data: TResultStreamData) {
        const { data: streamData, fileName } = data;

        if (fileName) ctx.attachment(fileName);

        ctx.body = streamData;
    },
    download(ctx: IContext, data: TResultDownData) {
        if (!send) throw new Error('Before you use send, please run " npm i -S koa-send "\n');

        const { [DOWNLOAD_PATH]: downloadPath, ...downloadOpts } = data;

        if (!ctx.type && !ctx.get('Content-Disposition')) ctx.attachment(downloadPath);

        return send(ctx, downloadPath, downloadOpts);
    },
    redirect(ctx: IContext, data: TResultRedirectData) {
        const { url, alt } = data;

        return ctx.redirect(url, alt);
    },
};
