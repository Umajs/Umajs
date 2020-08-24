import { start, stop, send } from './__fixtures__/app/app';

import Crypto from '../src/crypto';

describe('session test', () => {
    beforeAll(async () => {
        await start();
    });

    afterAll(async () => {
        await stop();
    });

    it('should set cookie', async () => {
        const result = await send('/');

        expect(result.header['set-cookie'][0].split(';')[0]).toEqual('c=cc');
    });

    it('should set session', async () => {
        const result = await send('/ss');

        const rt = result.header['set-cookie'][0].split(';')[0];

        const crypto = new Crypto('uma:sess');

        expect(crypto.decrypt(rt.split('=')[1])).toEqual({ s: 'ss' });
    });
})
