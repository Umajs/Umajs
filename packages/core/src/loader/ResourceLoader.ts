import * as fs from 'fs';

import Require from '../utils/Require';
import loadDir from '../utils/loadDir';
import { ResourceClazzMap } from '../decorators/Resource';

export const ResourceClassMap: Map<Function, Function> = new Map();

export default class ResourceLoader {
    static loadResource(filePath: string) {
        try {
            const clazz = Require.default(filePath);

            if (ResourceClazzMap.has(clazz)) {
                const clazzInstance = Reflect.construct(clazz, ResourceClazzMap.get(clazz));

                ResourceClassMap.set(clazz, clazzInstance);
            }
        } catch (err) {
            if (process.env.NODE_ENV === 'debugger') console.log(err);
        }
    }

    static loadResourceDir(dirPath: string, ignoreDirs: string[] = []) {
        if (!fs.existsSync(dirPath)) {
            return;
        }

        loadDir(dirPath, ResourceLoader.loadResource, ignoreDirs);
    }
}
