import * as fs from 'fs';
import * as path from 'path';

import Require from '../utils/Require';
import loadDir from '../utils/loadDir';
import typeHelper from '../utils/typeHelper';
import { ResourceClazzMap } from '../decorators/Resource';

export const ResourceMap: Map<string, Function> = new Map();
export const ResourceClassMap: Map<Function, Function> = new Map();

export default class ResourceLoader {
    static getResource(resource: string | Function) {
        return typeHelper.isString(resource) ? ResourceMap.get(resource) : ResourceClassMap.get(resource);
    }

    static loadResource(filePath: string) {
        try {
            const clazz = Require.default(filePath);

            if (ResourceClazzMap.has(clazz)) {
                const name = path.basename(filePath).split('.')[0];
                const clazzInstance = Reflect.construct(clazz, ResourceClazzMap.get(clazz));

                ResourceMap.set(name, clazzInstance);
                ResourceClassMap.set(clazz, clazzInstance);
            }
        } catch (err) {
            /* eslint-disable no-empty */
        }
    }

    static loadResourceDir(dirPath: string, ignoreDirs: string[] = []) {
        if (!fs.existsSync(dirPath)) {
            return;
        }

        loadDir(dirPath, ResourceLoader.loadResource, ignoreDirs);
    }
}
