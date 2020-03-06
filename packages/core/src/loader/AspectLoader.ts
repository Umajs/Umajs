import * as fs from 'fs';
import * as path from 'path';

import Require from '../utils/Require';
import loadDir from '../utils/loadDir';

export const AspectMap: Map<string, Function> = new Map();

export default class AspectLoader {
    static getAspect(aspectName: string) {
        return AspectMap.get(aspectName);
    }

    static loadAspect(filePath: string) {
        const fileInfo = path.parse(filePath);
        const [clazzName, type, ...suffix] = fileInfo.name.split('.');

        if (suffix.length === 0 && type === 'aspect') {
            const clazz: Function = Require.default(filePath);

            AspectMap.set(clazzName, clazz);
        }
    }

    static loadAspectDir(dirPath: string) {
        if (!fs.existsSync(dirPath)) return;

        loadDir(dirPath, AspectLoader.loadAspect);
    }
}
