import { start, stop, send, post } from '../__fixtures__/app/app';


describe('test @RequestMethod', () => {
    beforeAll(async () => {
        await start();
    });

    afterAll(async () => {
        await stop();
    });

    it('only post @requestMethod: do post ===> /onlyPost ===> /index/onlyPost', async () => {
        const index = await post('/onlyPost');
        expect(index.text).toEqual('this method only can post');
    });

    it('only post @requestMethod: do get ===> /onlyPost ===> /index/onlyPost', async () => {
        const index = await send('/onlyPost');
        expect(index.text).toEqual('Not Found');
    });

    it('only post @requestMethod && if is inside or has path decorator, return: do post ===> /index/onlyPost ===> /index/onlyPost', async () => {
        const index = await post('/index/onlyPost');
        expect(index.text).toEqual('Not Found');
    });
});