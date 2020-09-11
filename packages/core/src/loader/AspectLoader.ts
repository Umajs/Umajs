import * as fs from 'fs';
import * as path from 'path';

import Require from '../utils/Require';
import loadDir from '../utils/loadDir';
import typeHelper from '../utils/typeHelper';
import { IAspect } from '../types/IAspect';

export const AspectMap: Map<string, IAspect> = new Map();
export const AspectClassMap: Map<IAspect, IAspect> = new Map();

export default class AspectLoader {
    static getAspect(aspect: string | IAspect) {
        return typeHelper.isString(aspect) ? AspectMap.get(aspect) : AspectClassMap.get(aspect);
    }

    static loadAspect(filePath: string) {
        const fileInfo = path.parse(filePath);
        const [clazzName, type, ...suffix] = fileInfo.name.split('.');

        if (suffix.length === 0 && type === 'aspect') {
            const clazz: IAspect = Require.default(filePath);

            AspectMap.set(clazzName, clazz);
            AspectClassMap.set(clazz, clazz);
        }
    }

    static loadAspectDir(dirPath: string) {
        if (!fs.existsSync(dirPath)) return;

        loadDir(dirPath, AspectLoader.loadAspect);
    }
}
