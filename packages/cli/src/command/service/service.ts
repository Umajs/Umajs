import * as fs from 'fs';
import * as path from 'path';

import { actionHelp } from '../../utils/utils';
import { mkdir } from '../../utils/file';

const getServiceContext = (serviceName: string) => `import { BaseService } from '@umajs/core';

export default class ${serviceName} extends BaseService {
    // TODO
}
`;


export default class Config {
    static init(serviceName: string) {
        if (!serviceName) return actionHelp('service');

        const rootDir = path.resolve(process.cwd(), 'src');

        if (!fs.existsSync(rootDir)) return console.log(`Please execute the command in the "UMA_ROOT", now in "${rootDir}"`);

        const serviceDir = mkdir(rootDir, 'service');
        const serviceFileName = `${serviceName}.service.ts`;
        const servicePath = path.resolve(serviceDir, serviceFileName);

        if (fs.existsSync(servicePath)) return console.log(`${servicePath} is exists.`);

        fs.writeFileSync(servicePath, getServiceContext(serviceName.toLocaleLowerCase().replace(/([a-z])/, (s, name) => name.toLocaleUpperCase())));

        console.log(`${serviceFileName} init in "src/service"`);
    }
}
