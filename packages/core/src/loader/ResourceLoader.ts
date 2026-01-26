import * as fs from 'fs';

import Uma from '../core/Uma';
import Require from '../utils/Require';
import loadDir from '../utils/loadDir';
import { UmaError } from '../core/UmaError';

export default class ResourceLoader {
    /**
     * Load resource
     * @param filePath resource file path
     */
    static loadResource(filePath: string) {
        try {
            Require.default(filePath);
        } catch (err) {
            if (Uma.env !== 'production') console.log(err);
            // In strict mode or production, we might want to throw?
            // For now, keeping existing behavior but preparing for better error handling if needed.
            // But user asked to "throw exceptions".
            // If we throw here, loadDir loop might break.
            throw new UmaError(`Failed to load resource: ${filePath}. Reason: ${err.message}`);
        }
    }

    /**
     * Load resource directory
     * @param dirPath resource directory path
     * @param ignoreDirs ignore directories
     */
    static loadResourceDir(dirPath: string, ignoreDirs: string[] = []) {
        if (!fs.existsSync(dirPath)) {
            return;
        }

        loadDir(dirPath, ResourceLoader.loadResource, ignoreDirs);
    }
}
