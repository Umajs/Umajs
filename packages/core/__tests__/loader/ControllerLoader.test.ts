import * as assert from 'assert';
import * as path from 'path';
import ControllerLoader from '../../src/loader/ControllerLoader';
import controllerInfo from '../../src/info/controllerInfo';

describe('test/loader/ControllerLoader.test.ts', () => {
    const basePath = path.join(__dirname, '../__fixtures__/loader/controller');

    describe('loadControllerDir(dirPath: string)', () => {
        it ('load controller dir', () => {
            ControllerLoader.loadControllerDir(path.join(basePath));

            const controllerValues = controllerInfo.getControllersInfo();
            
            const testController = controllerValues.next();

            assert(testController.value !== undefined);
        });
    });
});
