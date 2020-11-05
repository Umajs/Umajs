import { start, stop, send, post } from '../__fixtures__/app/app';


describe('test @RequestMethod', () => {
    beforeAll(async () => {
        await start();
    });

    afterAll(async () => {
        await stop();
    });

    it('only post @requestMethod: do post ===> index.onlyGet ===> /index/onlyGet', async () => {
        const index = await post('/onlyPost');
        expect(index.text).toEqual('this method only can post');
    });

    it('only post @requestMethod: do get ===> index.onlyGet ===> /index/onlyGet', async () => {
        const index = await send('/onlyPost');
        expect(index.text).toEqual('Not Found');
    });
});