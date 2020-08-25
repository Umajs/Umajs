import * as fs from 'fs';
import * as path from 'path';

import Require from '../utils/Require';
import loadDir from '../utils/loadDir';
import typeHelper from '../utils/typeHelper';
import { ResourceClazzMap } from '../decorators/Resource';
import controllerInfo from '../info/controllerInfo';
import { BaseController } from '../core/BaseController';
import { BaseService } from '../core/BaseService';
import { ServiceMap } from './ServiceLoader';

export const ResourceMap: Map<string, Function> = new Map();
export const ResourceClassMap: Map<Function, Function> = new Map();

export default class ResourceLoader {
    static getResource(resource: string | Function) {
        return typeHelper.isString(resource) ? ResourceMap.get(resource) : ResourceClassMap.get(resource);
    }

    static loadResource(filePath: string) {
        try {
            const clazz = Require.default(filePath);
            const clazzName = path.basename(filePath).split('.')[0];

            if (ResourceClazzMap.has(clazz)) {
                const clazzInstance = Reflect.construct(clazz, ResourceClazzMap.get(clazz));

                ResourceMap.set(clazzName, clazzInstance);
                ResourceClassMap.set(clazz, clazzInstance);
            }

            if (clazz && clazz.prototype && clazz.prototype instanceof BaseController) {
                controllerInfo.setControllersInfo(clazz, null, { clazzName });
            }

            if (clazz && clazz.prototype && clazz.prototype instanceof BaseService) {
                ServiceMap.set(clazzName, clazz);
            }
        } catch (err) {
            console.log(err);
        }
    }

    static loadResourceDir(dirPath: string, ignoreDirs: string[] = []) {
        if (!fs.existsSync(dirPath)) {
            return;
        }

        loadDir(dirPath, ResourceLoader.loadResource, ignoreDirs);
    }
}
