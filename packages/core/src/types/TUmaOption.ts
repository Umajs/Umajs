import { Server, IncomingMessage, ServerResponse } from 'http';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';
import * as bodyParser from 'koa-body';

import Uma from '../core/Uma';

import { TJsonpBody } from './TJsonpBody';

export type TUmaOption = {
    Router: Function,
    ROOT: string,
    env?: 'development' | 'production' | string,
    configPath?: string,
    proxy?: boolean,
    subdomainOffset?: number,
    jsonpBody?: TJsonpBody,
    bodyParser?: bodyParser.IKoaBodyOptions,
    createServer?: (cb: (req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse) => void) => Server,
    beforeLoad?: (uma: Uma) => void,
    afterLoaded?: (uma: Uma) => void,
}
