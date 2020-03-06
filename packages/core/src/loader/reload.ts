import * as path from 'path';
import * as Koa from 'koa';
import * as chokidar from 'chokidar';
import Log from '../utils/log';
import Require from '../utils/Require';

import { Ursa } from '../index';
import ControllerLoader from './ControllerLoader';
import AspectLoader from './AspectLoader';
import ServiceLoader from './ServiceLoader';

const log = new Log();
const loadMethods = {
    controller: (p: string, ursa: Ursa) => {
        ControllerLoader.loadController(p);
        ursa.options.Router();
    },
    aspect: (p: string) => {
        AspectLoader.loadAspect(p);
    },
    service: ServiceLoader.loadService,
};

/**
 * HMR or reload in development
 * @param {Ursa} ursa
 */
export default function reload() {
    const ursa: Ursa = Ursa.instance();
    const { ROOT } = ursa.options;
    const watcher: chokidar.FSWatcher = chokidar.watch(ROOT, { ignoreInitial: true });

    watcher.on('change', (p: string) => {
        /* eslint-disable-next-line */
        const fileInfo: RegExpMatchArray = path.basename(p).match(new RegExp(`.*\.(${Object.keys(loadMethods).join('|')})\.`));
        const fileType: string = fileInfo
            ? fileInfo[1]
            : null;

        if (fileType) {
            Require.deleteCache(p);
            loadMethods[fileType](p, ursa);
            log.info('Hot Update: %s has been modified', p);
        } else if (path.basename(p).match(/^app\./)) {
            log.warn('Manual Restart To Update: %s has been modified', p);
        } else {
            ursa.server.close();
            ursa.app = new Koa();
            ursa.start();
            log.info('Restart: %s has been modified', p);
        }
    });

    watcher.on('error', (e: Error) => {
        log.error(e.toString());
    });
}
