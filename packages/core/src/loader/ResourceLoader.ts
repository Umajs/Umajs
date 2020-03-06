import * as fs from 'fs';
import * as path from 'path';

import Require from '../utils/Require';
import loadDir from '../utils/loadDir';
import { ResourceClazzMap } from '../decorators/Resource';

export const ResourceMap: Map<string, Function> = new Map();

export default class ResourceLoader {
    static getResource(resourceName: string) {
        return ResourceMap.get(resourceName);
    }

    static loadResource(filePath: string) {
        try {
            const clazz = Require.default(filePath);

            if (ResourceClazzMap.has(clazz)) {
                const name = path.basename(filePath).split('.')[0];

                ResourceMap.set(name, Reflect.construct(clazz, ResourceClazzMap.get(clazz)));
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
