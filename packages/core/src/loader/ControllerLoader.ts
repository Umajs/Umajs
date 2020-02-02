import * as fs from 'fs';
import * as path from 'path';

import Require from '../utils/Require';
import { BaseController } from '../core/BaseController';
import controllerInfo from '../info/controllerInfo';
import loadDir from '../utils/loadDir';

export default class ControllerLoader {
    static loadController(filePath: string) {
        const fileInfo = path.parse(filePath);
        const [clazzName, type, ...suffix] = fileInfo.name.split('.');

        if (suffix.length === 0 && type === 'controller') {
            const clazz: Function = Require.default(filePath);

            if (clazz && clazz.prototype && clazz.prototype instanceof BaseController) {
                controllerInfo.setControllersInfo(clazz, null, { clazzName });
            }
        }
    }

    static loadControllerDir(dirPath: string) {
        if (!fs.existsSync(dirPath)) {
            console.warn(`controller file path is not exists, path:${dirPath}`);

            return;
        }

        loadDir(dirPath, ControllerLoader.loadController);
    }
}
