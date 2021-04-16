import * as fs from 'fs';
import * as path from 'path';
import { BaseController, Path, Private, Param, Query, RequestMethod, Around, Service, Result } from '@umajs/core';
import { Get, Post } from '@umajs/path';
import { RequestFile } from '@umajs/arg-decorator';
import TestService from '../service/test.service';
import { AgeCheck } from '../decorator/AgeCheck';
import UserService from '../service/user.service';
import { method } from '../aspect/method.aspect';

export default class Index extends BaseController {

    @Service(TestService)
    testService: TestService

    @Service(UserService)
    userService: UserService;

    @Path('/')
    index() {
        console.log(this.userService.getDefaultUserAge());

        console.log('\n\n', this.ctx.i18n.hi);

        this.ctx.setLocale('en-us');

        console.log(this.ctx.i18n.hi);

        this.ctx.setLocale('zh-cn');

        console.log(this.ctx.i18n.hi);

        return this.view('index.html', {
            frameName: this.testService.returnFrameName(),
        });
    }

    @Path('/home')
    home() {
        this.setHeader('clientType','PC');
        console.log(this.ctx.get('Cache-Control'));
        console.log(this.ctx.get('clientType'));
        this.ctx.set('myappend','1');
        this.ctx.set('myappend','2');
        console.log(this.ctx.get('myappend'));
        this.ctx.cookies.set('name','zdj');
        this.ctx.cookies.set('name1','zdj1');
        return Result.send('this is home router! '+this.getHeader('Cache-Control'));
    }

    @Get('/reg/:name*')
    @Around(method)
    reg(@AgeCheck('age') age: number, @Param('name') name: string) {
        return Result.send(`this is reg router. ${name} ${age}`);
    }

    @Post('/submit', '/yu/:id')
    submit(@RequestFile('pic') file:File) {
        // this.ctx.request.body
        // this.ctx.request.files
        return Result.send(`This request get RequestFile file is ${file['path']}`);
    }

    @Path('/test', '/static/test2')
    async test() {
        console.log('>>>');

        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('<<<');

        return Result.send('this is static router');
    }

    @Path('/cookie')
    cookie() {
        this.ctx.cookies.set('hehe', 'cookie set done');

        return Result.send(this.ctx.cookies.get('hehe'));
    }

    @Private
    inline() {
        return Result.send('this is private router');
    }

    @Path('/ss')
    ss() {
        this.ctx.session.set('haha', 'Hello World');
        return Result.send(this.ctx.session.get('haha'));
    }

    @Path('/home/:name')
    params(@Param('name') name: string, @Query('title') title: string) {
        return Result.send(`name=${name}, title=${title}`);
    }

    @Path('/download')
    downFile() {
        return Result.download('/src/controller/template.controller.ts');
    }

    @Path('/stream')
    donwStream() {
        const rs = fs.createReadStream(path.resolve(__dirname, './template.controller.ts'));
        return Result.stream(rs, 'controller.ts');
    }
}
