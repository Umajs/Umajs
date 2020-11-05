import { start, stop, send } from '../__fixtures__/app/app';

describe('test @Param && @Query', () => {
    beforeAll(async () => {
        await start();
    });

    afterAll(async () => {
        await stop();
    });

    // get
    it('params & query: get ===> index.params ===> /home/:name?title=xx', async () => {
        const index = await send('/home/username?title=hello');
        expect(index.text).toEqual('name=username, title=hello');
    });

    it('params & query: get endWith("/") ===> index.params ===> /home/:name?title=xx', async () => {
        const index = await send('/home/username/?title=hello');
        expect(index.text).toEqual('name=username, title=hello');
    });
});