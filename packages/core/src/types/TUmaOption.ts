import { Server, IncomingMessage, ServerResponse } from 'http';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';
import * as Koa from 'koa';

import Uma from '../core/Uma';

export type TJsonpBody = {
    limit?: number,
    replacer?: (this: any, key: string, value: any) => any,
    space?: string | number,
};

export type TUmaOption = {
    Router: () => Koa.Middleware,
    ROOT: string,
    env?: 'development' | 'production' | string,
    strictDir?: boolean,
    configPath?: string,
    proxy?: boolean,
    subdomainOffset?: number,
    jsonpBody?: TJsonpBody,
    bodyParser?: any,
    createServer?: (cb: (req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse) => void) => Server,
    beforeLoad?: (uma: Uma) => void,
    afterLoaded?: (uma: Uma) => void,
}
