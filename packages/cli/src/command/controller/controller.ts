import * as fs from 'fs';
import * as path from 'path';

import { actionHelp } from '../../utils/utils';
import { mkdir } from '../../utils/file';

const getControllerContext = (controllerName: string) => `import { BaseController, Result } from '@umajs/core';

export default class ${controllerName} extends BaseController {
    index() {
        return Result.send('This router is "/${controllerName.toLocaleLowerCase()}/index"');
    }
}
`;


export default class Config {
    static init(controllerName: string) {
        if (!controllerName) return actionHelp('controller');

        const rootDir = path.resolve(process.cwd(), 'src');

        if (!fs.existsSync(rootDir)) return console.log(`Please execute the command in the "URSA_ROOT", now in "${rootDir}"`);

        const controllerDir = mkdir(rootDir, 'controller');
        const controllerFileName = `${controllerName}.controller.ts`;
        const controllerPath = path.resolve(controllerDir, controllerFileName);

        if (fs.existsSync(controllerPath)) return console.log(`${controllerPath} is exists.`);

        fs.writeFileSync(controllerPath, getControllerContext(controllerName.toLocaleLowerCase().replace(/([a-z])/, (s, name) => name.toLocaleUpperCase())));

        console.log(`${controllerFileName} init in "src/controller"`);
    }
}
