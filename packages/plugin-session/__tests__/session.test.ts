import { start, stop, send } from './__fixtures__/app/app';

describe('session test', () => {
    beforeAll(async () => {
        await start();
    });

    afterAll(async () => {
        await stop();
    });

    it('should set cookie', async () => {
        const result = await send('/');
        expect(result.text).toEqual('set cookie done');
    });

    it('should set session', async () => {
        const result = await send('/ss');
        expect(result.text).toEqual('set session done');
    });
})
