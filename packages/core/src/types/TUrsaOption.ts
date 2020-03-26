import { Server, IncomingMessage, ServerResponse } from 'http';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';
import * as bodyParser from 'koa-body';

import Ursa from '../core/Ursa';

export type TUrsaOption = {
    Router: Function,
    ROOT: string,
    configPath?: string,
    proxy?: boolean,
    subdomainOffset?: number,
    jsonpBody?: TJsonpBody,
    bodyParser: boolean | bodyParser.IKoaBodyOptions,
    createServer?: (cb: (req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse) => void) => Server,
    env?: 'development' | 'production' | string,
    beforeLoad?: (ursa: Ursa) => void,
    afterLoaded?: (ursa: Ursa) => void,
}
