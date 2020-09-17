import * as assert from 'assert';
import * as path from 'path';
import AspectLoader, { AspectMap } from '../../src/loader/AspectLoader';

describe('test/loader/AspectLoader.test.ts', () => {
    const basePath = path.join(__dirname, '../__fixtures__/loader/aspect');

    describe('loadAspectDir(dirPath: string)', () => {
        it ('load aspect dir', () => {
            const aspectPath = path.join(basePath);

            AspectLoader.loadAspectDir(aspectPath);

            const testAspect = AspectMap.get('test');
            const result = Reflect.construct(<Function>testAspect, []);

            assert(result.before() === 1);
        });
    });

    describe('getAspect(filePath: string)', () => {
        it('get aspect', () => {
            const aspectPath = path.join(basePath);

            AspectLoader.loadAspectDir(aspectPath);

            const testAspect = AspectLoader.getAspect('test');
            const result = Reflect.construct(<Function>testAspect, []);

            assert(result.before() === 1);
        });
    });
});
