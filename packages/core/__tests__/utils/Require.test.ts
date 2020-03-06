import * as assert from 'assert';
import * as path from 'path';
import Require from '../../src/utils/Require';

describe('test/utils/Require.test.ts', () => {
    describe('default(p: string): any', () => {
        const baseDir = path.join(__dirname, '../__fixtures__/requireDefault');

        it('should return default obj', () => {
            const loadObj = Require.default(path.join(baseDir, 'Object.ts'));

            assert(loadObj.a === 1);
        });

        it('should return default function', () => {
            const loadFunc = Require.default(path.join(baseDir, 'Function.ts'));

            assert(loadFunc() === 'abc');
        });

        it('should return default module', () => {
            const loadModule = Require.default(path.join(baseDir, 'Module.ts'));

            assert(loadModule.a === 1);
        });

        it('load file with not default', () => {
            const loadNodefault = Require.default(path.join(baseDir, 'Nodefault.ts'));

            assert(loadNodefault.a === 1);
        });
    });
});
