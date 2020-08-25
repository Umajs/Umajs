import { Server, IncomingMessage, ServerResponse } from 'http';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';
import * as bodyParser from 'koa-body';
import * as Koa from 'koa';

import Uma from '../core/Uma';

import { TJsonpBody } from './TJsonpBody';

export type TUmaOption = {
    Router: () => Koa.Middleware,
    ROOT: string,
    env?: 'development' | 'production' | string,
    strictDir?: boolean,
    configPath?: string,
    proxy?: boolean,
    subdomainOffset?: number,
    jsonpBody?: TJsonpBody,
    bodyParser?: bodyParser.IKoaBodyOptions,
    createServer?: (cb: (req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse) => void) => Server,
    beforeLoad?: (uma: Uma) => void,
    afterLoaded?: (uma: Uma) => void,
}
