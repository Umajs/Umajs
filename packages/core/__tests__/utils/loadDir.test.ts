import * as assert from 'assert';
import * as path from 'path';
import loadDir from '../../src/utils/loadDir';

describe('test/utils/loadDir.test.ts', () => {
    describe('loadDir(dirPath, loadFn, ignoreDirs)', () => {
        const baseDir = path.join(__dirname, '../__fixtures__/loadDir');

        it('load dir not exist should return void', () => {
            const result = loadDir(path.join(baseDir, 'aa'), () => {});

            assert(result === undefined);
        });

        it('load dir with ignoreDirs', async () => {
            const loadDirAsync = (dir: string, ignore: string[]): Promise<string[]> => new Promise(resolve => {
                let timer = null;
                const files = [];

                loadDir(dir, (filePath) => {
                    clearTimeout(timer);
                    timer = null;

                    files.push(filePath);

                    timer = setTimeout(() => {
                        resolve(files);
                    }, 200);
                }, ignore);
            });

            const result = await loadDirAsync(baseDir, ['dir']);

            assert(result.length === 1);
            assert(result[0].indexOf('dir2') < 0);
        });
    });
});

