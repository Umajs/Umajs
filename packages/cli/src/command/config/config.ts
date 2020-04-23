import * as fs from 'fs';
import * as path from 'path';

import { actionHelp } from '../../utils/utils';

export default class Config {
    static init(configName: string) {
        if (!configName) return actionHelp(configName);

        const rootDir = path.resolve(process.cwd(), 'src');

        if (!fs.existsSync(rootDir)) return console.log(`Please execute the command in the "URSA_ROOT", now in "${rootDir}"`);

        const configDir = path.resolve(rootDir, 'config');

        if (!fs.existsSync(configDir)) fs.mkdirSync(configDir);

        const configPath = path.resolve(configDir, `${configName}.config.ts`);

        if (fs.existsSync(configPath)) return console.log(`${configPath} is exists.`);

        fs.writeFileSync(configPath, 'export default {\n};\n');

        console.log(`${configName}.config.ts init in "src/config"`);
    }
}
