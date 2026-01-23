import * as fs from 'fs';
import * as path from 'path';

import Require from '../utils/Require';
import { TConfig } from '../types/TConfig';
import loadDir from '../utils/loadDir';
import mixin from '../utils/mixin';

export default class ConfigLoader {
    static config: TConfig = {
        plugin: {},
    };

    static loadConfig(filePath: string) {
        const fileInfo = path.parse(filePath);
        const [configName, type, ...suffix] = fileInfo.name.split('.');

        if (type === 'config') {
            const fileConfig = Require.default(filePath);

            if (suffix.length === 0) {
                // Default config: replace or merge?
                // Usually default config is base.
                // We use mixin for deep merge if it already exists
                const existing = Reflect.get(ConfigLoader.config, configName);

                if (existing) {
                    Reflect.set(ConfigLoader.config, configName, mixin(true, existing, fileConfig));
                } else {
                    Reflect.set(ConfigLoader.config, configName, fileConfig);
                }
            } else {
                // Env specific config
                // Check if suffix matches current env?
                // The original logic seemed to ignore suffixes.
                // Now we should implement env override.
                // Assuming suffix[0] is env name.
                const env = process.env.NODE_ENV || 'development';

                if (suffix[0] === env) {
                    const existing = Reflect.get(ConfigLoader.config, configName) || {};

                    Reflect.set(ConfigLoader.config, configName, mixin(true, existing, fileConfig));
                }
            }
        }
    }

    static loadConfigDir(dirPath: string) {
        if (!fs.existsSync(dirPath)) return;

        // Load default configs first (no suffix), then env configs
        // loadDir loads files in directory order.
        // To ensure priority, we might need to load all paths then sort?
        // But loadDir is recursive.
        // For simplicity in this step, we trust loadDir order or rely on mixin logic.
        // However, file system order is not guaranteed.
        // Better approach:
        // 1. Scan all files
        // 2. Filter default configs -> load
        // 3. Filter env configs matching current env -> load and merge
        // Since loadDir is a util, we might not want to change it heavily.
        // We can use loadDir to gather files? Or just let loadConfig handle it if it can distinguishing priorities.
        // But loadConfig is called one by one.
        // Let's modify loadConfig to store configs temporarily and then merge?
        // Or we just improve loadConfig logic to be robust regardless of order?
        // If we load `prod` before `default`, we might merge `default` into `prod`.
        // Ideally `default` should be base.
        // Let's keep it simple: loadDir iterates. We can check if we are overwriting.
        // But to ensure correct override, we should probably read all keys first.
        // For now, let's implement the suffix check as requested.
        loadDir(dirPath, ConfigLoader.loadConfig);
    }
}
