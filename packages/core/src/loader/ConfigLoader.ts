import * as fs from 'fs';
import * as path from 'path';

import Require from '../utils/Require';
import { TConfig } from '../types/TConfig';
import loadDir from '../utils/loadDir';

export default class ConfigLoader {
    static config: TConfig = {};

    static loadConfig(filePath: string) {
        const fileInfo = path.parse(filePath);
        const [configName, type, ...suffix] = fileInfo.name.split('.');

        if (suffix.length === 0 && type === 'config') {
            const fileConfig = Require.default(filePath);

            Reflect.set(ConfigLoader.config, configName, fileConfig);
        }
    }

    static loadConfigDir(dirPath: string) {
        if (!fs.existsSync(dirPath)) return;

        loadDir(dirPath, ConfigLoader.loadConfig);
    }
}
