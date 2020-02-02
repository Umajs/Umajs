import * as fs from 'fs';
import * as path from 'path';

import Require from '../utils/Require';
import loadDir from '../utils/loadDir';

export const ServiceMap: Map<string, Function> = new Map();

export default class ServiceLoader {
    static getService(serviceName: string) {
        return ServiceMap.get(serviceName);
    }

    static loadService(filePath: string) {
        const fileInfo = path.parse(filePath);
        const [clazzName, type, ...suffix] = fileInfo.name.split('.');

        if (suffix.length === 0 && type === 'service') {
            const clazz: Function = Require.default(filePath);

            ServiceMap.set(clazzName, clazz);
        }
    }

    static loadServiceDir(dirPath: string) {
        if (!fs.existsSync(dirPath)) return;

        loadDir(dirPath, ServiceLoader.loadService);
    }
}
