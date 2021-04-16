import { start, stop, send, post } from '../__fixtures__/app/app';

describe('test default && @Path && @Private', () => {
    beforeAll(async () => {
        await start();
    });

    afterAll(async () => {
        await stop();
    });

    it('default router ===> index.home ===> /', async () => {
        const index = await send('/');
        expect(index.text).toEqual('this is index router');
    });

    it('only method @path: regexp router ===> index.reg ===> /reg/index', async () => {
        const reg = await send('/reg/index');
        expect(reg.text).toEqual('this is reg router');
    });

    it('only method @path: static router ===> index.test ===> /static/test', async () => {
        const stat = await send('/static/test');
        expect(stat.text).toEqual('this is static router');
    });

    it('only method @path: static router endWith("/")===> index.test ===> /static/test', async () => {
        const stat = await send('/static/test/');
        expect(stat.text).toEqual('this is static router');
    });

    it('both get and post requests @path: router ===> index.getAndPost ===> /getAndPost', async () => {
        const stat = await send('/getAndPost');
        const statPost = await post('/getAndPost');
        expect(stat.text).toEqual(statPost.text);
    });
    it('both get and post requests @path: router ===> index.getOrPost ===> /get or /post', async () => {
        const stat = await send('/get');
        const statPost = await post('/post');
        expect(stat.text).toEqual(statPost.text);
    });

    it('only method @path: method cannot find in default ===> index.reg ===> /index/reg', async () => {
        const nopath = await send('/index/reg');
        expect(nopath.text).toEqual('Not Found');
    });

    // clazz add @Path decorator
    it('only clazz @path: default router cannot use default index ===> template.index ===> /template', async () => {
        const reg = await send('/template');
        expect(reg.text).toEqual('Not Found');
    });

    it('only clazz @path: default router ===> template.home ===> /tpl', async () => {
        const reg = await send('/tpl');
        expect(reg.text).toEqual('this is home router in template');
    });

    it('only clazz @path: no path router ===> template.index ===> /tpl/index', async () => {
        const reg = await send('/tpl/index');
        expect(reg.text).toEqual('Not Found');
    });

    it('only clazz @path: no path router ===> template.index ===> /tpl/template/index', async () => {
        const reg = await send('/tpl/template/index');
        expect(reg.text).toEqual('Not Found');
    });

    it('clazz @path & method @path: regexp router ===> template.reg ===> /tpl/reg/index', async () => {
        const reg = await send('/tpl/reg/test');
        expect(reg.text).toEqual('this is reg router in template');
    });

    it('clazz @path & method @path: static router ===> template.test ===> /tpl/static/test', async () => {
        const reg = await send('/tpl/static/test');
        expect(reg.text).toEqual('this is static router in template');
    });

    it('clazz @path & method @path:  method cannot find in default ===> template.reg ===> /tpl/reg', async () => {
        const nopath = await send('/tpl/reg');
        expect(nopath.text).toEqual('Not Found');
    });

    // private
    it('method @path & private: private cannot find ===> index.inline ===> /index/inline', async () => {
        const nopath = await send('/index/inline');
        expect(nopath.text).toEqual('Not Found');
    });

    it('clazz @path & private: private cannot find ===> template.inline ===> /tpl/inline', async () => {
        const nopath = await send('/tpl/inline');
        expect(nopath.text).toEqual('Not Found');
    });
});