import * as fs from 'fs';

import Uma from '../core/Uma';
import Require from '../utils/Require';
import loadDir from '../utils/loadDir';

export default class ResourceLoader {
    static loadResource(filePath: string) {
        try {
            Require.default(filePath);
        } catch (err) {
            if (Uma.env !== 'production') console.log(err);
        }
    }

    static loadResourceDir(dirPath: string, ignoreDirs: string[] = []) {
        if (!fs.existsSync(dirPath)) {
            return;
        }

        loadDir(dirPath, ResourceLoader.loadResource, ignoreDirs);
    }
}
