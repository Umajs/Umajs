import * as path from 'path';
import ConfigLoader from '../../src/loader/ConfigLoader';

describe('test/loader/ConfigLoader.test.ts', () => {
    const basePath = path.join(__dirname, '../__fixtures__/loader/config');

    describe('loadConfigDir(dirPath: string)', () => {
        it ('load config dir', () => {
            ConfigLoader.loadConfigDir(basePath);

            expect(JSON.stringify(ConfigLoader.config)).toBe(JSON.stringify({
                default: {
                    name: 'defaultConfig',
                },
                online: {
                    name: 'onlineConfig',
                },
            }));
        });
    });
});
