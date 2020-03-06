import * as fs from 'fs';
import * as path from 'path';
import { BaseController, Path, Private, Param, Query, RequestMethod, Aspect, Service, Result } from '@ursajs/core';

import TestService from '../service/test.service';
import { AgeCheck } from '../decorator/AgeCheck';
import UserService from '../service/user.service';

export default class Index extends BaseController {

    @Service('test')
    testService: TestService

    @Service('user')
    userService: UserService;

    index() {
        console.log(this.userService.getDefaultUserAge());
        return Result.view('index.html', { test: this.testService.return1() })
    }

    @Path('/reg/:name*')
    @Aspect.around('test')
    reg(@AgeCheck('age') age: number, @Param('name') name: string) {
        return Result.send(`this is reg router. ${name} ${age}`);
    }

    @Path({
        value: ['/submit', '/yu/:id'],
        method: RequestMethod.POST
    })
    submit() {
        // this.ctx.request.body
        // this.ctx.request.files
        return Result.send('submit success');
    }

    @Path('/test', '/static/test2')
    test() {
        return Result.send('this is static router');
    }

    @Private
    inline() {
        return Result.send('this is private router');
    }

    @Path({
        method: RequestMethod.POST
    })
    onlyGet() {
        return Result.send('this method only can post');
    }

    @Path('/home/:name')
    params(@Param('name') name: string, @Query('title') title: string) {
        return Result.send(`name=${name}, title=${title}`);
    }

    @Path('/download')
    download() {
        return Result.download('/src/controller/template.controller.ts');
    }

    @Path('/stream')
    stream() {
        const rs = fs.createReadStream(path.resolve(__dirname, './template.controller.ts'));
        return Result.stream(rs, 'controller.ts');
    }
}
