'use strict';

import * as koa from 'koa';
import * as request from 'supertest';
import * as pedding from 'pedding';
import * as mm from 'mm';
import i18N from '../lib';
import { I18nOptions, WFOptions } from '../src/type.js'

/**
 * init app
 * @param config 
 */

describe('@wf-node/I18n', () => {
    
    describe('default configs', () => {
        const app = initApp()
        
        it('should use default locale: en-us', (done) => {
            request(app.callback())
            .get('/')
            .expect({ 
                hi: 'nice to meet you!',
                empty: '',
                index: 'index 1 2 3',
                index_back: 'index back 3 2 1',
                var: 'var john',
                var_more: 'var more 123 john',
                mix: 'mix hi john',
                mix_more: 'mix more name is john phone is 123',
                overflow_index: 'index overflow hi   john',
                overflow_var: 'overflow hi john ',
                repeat: 'repeat hi hi john john',
            })
            .expect(200,done)
        });
        
        it('should set cookie automatically', (done) => {
            request(app.callback())
            .get('/')
            .expect('Set-Cookie', /^i18n=en\-us; path=\/; expires=[^;]+ GMT$/)
            .expect(200,done)
        });
    })
    
    describe('DIY configs', () => {
        
        it('should set cookie domain',(done) => {
            const app = initApp({cookieDomain:'.wf.com'})
            request(app.callback())
            .get('/')
            .expect('Set-Cookie', /^i18n=en\-us; path=\/; expires=[^;]+; domain=.wf.com$/)
            .expect(200,done)
        })
        
        it('should get new dir',(done) => {
            const app = initApp({dirs:[__dirname + '/i18n-other']})

            request(app.callback())
            .get('/')
            .expect({
                newdir:'I get one new dir'
            })
            .expect(200,done)
        })

        it('should find dir by defaultDirName',(done) => {
            const app = initApp({defaultDirName: 'i18n-other'})

            request(app.callback())
            .get('/')
            .expect({
                newdir:'I get one new dir'
            })
            .expect(200,done)
        })

        it('should get defaultLocale: zh-cn',(done) => {
            const app = initApp({defaultLocale:'zh-cn'})

            request(app.callback())
            .get('/')
            .expect({ 
                hi: '很高兴遇见你!',
                empty: '',
                index: '索引 1 2 3',
                index_back: '索引逆序 3 2 1',
                var: '变量 john',
                var_more: '更多变量 123 john',
                mix: '混合 hi john',
                mix_more: '更多混合 name is john phone is 123',
                overflow_index: '索引溢出 hi   john',
                overflow_var: '变量溢出 hi john ',
                repeat: '重复 hi hi john john' 
            })
            .expect(200,done)
        })

        it('should not write cookie',(done) => {
            const app = initApp({writeCookie: false})

            request(app.callback())
            .get('/')
            .expect(function(res) {
                if(res.header['set-cookie']){
                    throw new Error('should not write cookie');
                }
            })
            .expect(200,done)
        })

        it('should use `__` replace `i18n`',(done) => {
            const app = initApp({functionName: '__'})

            request(app.callback())
            .get('/')
            .expect({
                fn: '__',
                hi: 'nice to meet you!',
            })
            .expect(200,done)
        })

        it('should set cookie field as `locale`',(done) => {
            const app = initApp({cookieField: 'locale'})

            request(app.callback())
            .get('/')
            .expect('Set-Cookie', /^locale=en\-us; path=\/; expires=[^;]+ GMT$/)
            .expect(200,done)
        })

        it('should be affected by query `locale`',(done) => {
            const app = initApp({queryField: 'locale'})
            done = pedding(2, done);

            request(app.callback())
            .get('/?i18n=zh-cn')
            .expect({ 
                hi: 'nice to meet you!',
                empty: '',
                index: 'index 1 2 3',
                index_back: 'index back 3 2 1',
                var: 'var john',
                var_more: 'var more 123 john',
                mix: 'mix hi john',
                mix_more: 'mix more name is john phone is 123',
                overflow_index: 'index overflow hi   john',
                overflow_var: 'overflow hi john ',
                repeat: 'repeat hi hi john john', 
            })
            .expect(200,done)

            request(app.callback())
            .get('/?locale=zh-cn')
            .expect({ 
                hi: '很高兴遇见你!',
                empty: '',
                index: '索引 1 2 3',
                index_back: '索引逆序 3 2 1',
                var: '变量 john',
                var_more: '更多变量 123 john',
                mix: '混合 hi john',
                mix_more: '更多混合 name is john phone is 123',
                overflow_index: '索引溢出 hi   john',
                overflow_var: '变量溢出 hi john ',
                repeat: '重复 hi hi john john',
            })
            .expect(200,done)
        })
    })

    describe('set Locale Manually', () => {
        const app = initApp()

        it('set locale to `zh-cn`', (done) => {
            request(app.callback())
            .get('/setLocale')
            .expect({ 
                hi: '很高兴遇见你!',
                empty: '',
                index: '索引 1 2 3',
                index_back: '索引逆序 3 2 1',
                var: '变量 john',
                var_more: '更多变量 123 john',
                mix: '混合 hi john',
                mix_more: '更多混合 name is john phone is 123',
                overflow_index: '索引溢出 hi   john',
                overflow_var: '变量溢出 hi john ',
                repeat: '重复 hi hi john john' 
            })
            .expect(200,done)
        })
    })

    describe('query && cookie && header && default', () => {
        const app = initApp()

        it('follow query', (done) => {
            request(app.callback())
            .get('/?i18n=zh-cn')
            .set('Cookie','i18n=en-us')
            .set('Accept-Language', 'en-us')
            .expect({ 
                hi: '很高兴遇见你!',
                empty: '',
                index: '索引 1 2 3',
                index_back: '索引逆序 3 2 1',
                var: '变量 john',
                var_more: '更多变量 123 john',
                mix: '混合 hi john',
                mix_more: '更多混合 name is john phone is 123',
                overflow_index: '索引溢出 hi   john',
                overflow_var: '变量溢出 hi john ',
                repeat: '重复 hi hi john john' 
            })
            .expect(200,done)
        })

        it('follow cookie', (done) => {
            request(app.callback())
            .get('/')
            .set('Cookie','i18n=zh-cn')
            .set('Accept-Language', 'en-us')
            .expect({ 
                hi: '很高兴遇见你!',
                empty: '',
                index: '索引 1 2 3',
                index_back: '索引逆序 3 2 1',
                var: '变量 john',
                var_more: '更多变量 123 john',
                mix: '混合 hi john',
                mix_more: '更多混合 name is john phone is 123',
                overflow_index: '索引溢出 hi   john',
                overflow_var: '变量溢出 hi john ',
                repeat: '重复 hi hi john john' 
            })
            .expect(200,done)
        })

        it('follow header', (done) => {
            request(app.callback())
            .get('/')
            .set('Cookie','')
            .set('Accept-Language', 'zh-cn')
            .expect({ 
                hi: '很高兴遇见你!',
                empty: '',
                index: '索引 1 2 3',
                index_back: '索引逆序 3 2 1',
                var: '变量 john',
                var_more: '更多变量 123 john',
                mix: '混合 hi john',
                mix_more: '更多混合 name is john phone is 123',
                overflow_index: '索引溢出 hi   john',
                overflow_var: '变量溢出 hi john ',
                repeat: '重复 hi hi john john' 
            })
            .expect(200,done)
        })

        it('follow default:en-us', (done) => {
            request(app.callback())
            .get('/')
            .set('Cookie','')
            .set('Accept-Language', '')
            .expect({ 
                hi: 'nice to meet you!',
                empty: '',
                index: 'index 1 2 3',
                index_back: 'index back 3 2 1',
                var: 'var john',
                var_more: 'var more 123 john',
                mix: 'mix hi john',
                mix_more: 'mix more name is john phone is 123',
                overflow_index: 'index overflow hi   john',
                overflow_var: 'overflow hi john ',
                repeat: 'repeat hi hi john john',
            })
            .expect(200,done)
        })

        it('follow default:zh-cn', (done) => {
            const appDefault = initApp({defaultLocale:'zh-cn'})

            request(appDefault.callback())
            .get('/')
            .set('Cookie','')
            .set('Accept-Language', '')
            .expect({ 
                hi: '很高兴遇见你!',
                empty: '',
                index: '索引 1 2 3',
                index_back: '索引逆序 3 2 1',
                var: '变量 john',
                var_more: '更多变量 123 john',
                mix: '混合 hi john',
                mix_more: '更多混合 name is john phone is 123',
                overflow_index: '索引溢出 hi   john',
                overflow_var: '变量溢出 hi john ',
                repeat: '重复 hi hi john john'
            })
            .expect(200,done)
        })
    })

    describe('mock acceptsLanguages',() => {
        const app = initApp();

        it('mock acceptsLanguages as zh-cn',(done) => {
            mm(app.request, 'acceptsLanguages', () => {
                return ['zh-cn']
            })

            request(app.callback())
            .get('/')
            .expect({
                hi: '很高兴遇见你!',
                empty: '',
                index: '索引 1 2 3',
                index_back: '索引逆序 3 2 1',
                var: '变量 john',
                var_more: '更多变量 123 john',
                mix: '混合 hi john',
                mix_more: '更多混合 name is john phone is 123',
                overflow_index: '索引溢出 hi   john',
                overflow_var: '变量溢出 hi john ',
                repeat: '重复 hi hi john john'
            })
            .expect(200,done)
        })

        it('mock acceptsLanguages as null',(done) => {
            mm(app.request, 'acceptsLanguages', () => {
                return []
            })

            request(app.callback())
            .get('/')
            .expect({
                hi: 'nice to meet you!',
                empty: '',
                index: 'index 1 2 3',
                index_back: 'index back 3 2 1',
                var: 'var john',
                var_more: 'var more 123 john',
                mix: 'mix hi john',
                mix_more: 'mix more name is john phone is 123',
                overflow_index: 'index overflow hi   john',
                overflow_var: 'overflow hi john ',
                repeat: 'repeat hi hi john john',
            })
            .expect(200,done)
        })
    })
});


function initApp(config?: I18nOptions){
    const newconfig = Object.assign({}, config);
    // if(!newconfig.dirs) newconfig.dirs = [__dirname + '/i18n']
    
    const app: koa = new koa();
    const options: WFOptions = {
        WF_ROOT: __dirname,
    }
    i18N({ app, options }, newconfig);
    const fname = newconfig && newconfig.functionName || 'i18n';

    app.use(function (ctx: koa.Context) {

        if(config && (config.dirs || config.defaultDirName)){
            ctx.body = {
                newdir: ctx[fname].newdir
            }
            return;
        }

        if(ctx.path === '/setLocale'){
            ctx.setLocale('zh-cn');
        }

        if(config && config.functionName){
            ctx.body = {
                fn: fname,
                hi: ctx['__'].hi
            }
            return;
        }

        ctx.body = { 
            hi: ctx[fname].hi,
            empty: ctx[fname].empty,
            index: ctx[fname].index(1, 2, '3'),
            index_back: ctx[fname].index_back(1, 2, '3'),
            var: ctx[fname].var({name: 'john'}),
            var_more: ctx[fname].var_more({name: 'john', phone: 123}),
            mix: ctx[fname].mix('hi', {name: 'john'}),
            mix_more: ctx[fname].mix_more('name is', 'phone is', {name: 'john', phone: 123}),
            overflow_index: ctx[fname].overflow_index('hi', {name: 'john'}),
            overflow_var: ctx[fname].overflow_var('hi', {name: 'john'}),
            repeat: ctx[fname].repeat('hi', {name: 'john'}),
        }
    })
    
    return app
}

