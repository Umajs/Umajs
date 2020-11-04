import { BaseController, Path, Private, Param, Query, RequestMethod, Result } from '@umajs/core';

export default class Index extends BaseController {
    index() {
        return Result.send('this is index router');
    }

    @Path('/reg/:name')
    reg() {
        return Result.send('this is reg router');
    }

    @Path('/static/test')
    test() {
        return Result.send('this is static router');
    }

    @Private
    inline() {
        return Result.send('this is private router');
    }

    @Path('/home/:name')
    params(@Param('name') name: string, @Query('title') title: string) {
        return Result.send(`name=${name}, title=${title}`);
    }

    @Path({
        method: RequestMethod.POST
    })
    onlyGet() {
        return Result.send('this method only can post');
    }

    @Path('/get')
    @Path({value:'/post', method:RequestMethod.POST})
    getOrPost(){
        return Result.send(`Methods can be accessed by both get and post requests`);
    }
    
    @Path({value:'/getAndPost', method:[RequestMethod.POST, RequestMethod.GET]})
    getAndPost(){
        return Result.send(`Methods can be accessed by both get and post requests`);
    }
}
