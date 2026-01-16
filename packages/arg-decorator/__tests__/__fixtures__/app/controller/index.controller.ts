import { BaseController, Path, RequestMethod, Result } from '@umajs/core';
import { Type, Required, Min, Model } from '@umajs/class-validator';
import { Body, RequestParam } from '../../../../src/index';

type user = {
    userid:string,
    age:number
}

class UserInfo extends Model {
    constructor({ id, name, age }: UserInfo, isValid: boolean) {
        super(isValid);
        this.id = id;
        this.name = name;
        this.age = age;
    }

    @Type('number')
    id: number = 123;

    @Required()
    name?: string;

    @Min(0)
    age?: number;
}

export default class Modify extends BaseController {
    @Path({ value: '/Body', method: RequestMethod.POST })
    body(@Body('userid') userId: string) {
        return Result.send(`This Post body parms userid is ${userId}`);
    }

    @Path({ value: '/Bodys', method: RequestMethod.POST })
    test5(@Body(['userid', 'age']) userInfo: user) {
        return Result.send(`${userInfo.userid}-${userInfo.age}`);
    }

    @Path('/get') // Bugs to be fixed: 404 on get request when interface provides both get and post
    @Path({ value: '/isRequire', method: RequestMethod.POST })
    isRequire(@Body.isRequire('age', 'Age is empty') userInfo: user) {
        return Result.send(`${JSON.stringify(userInfo)}`);
    }

    @Path({ value: '/Equals', method: RequestMethod.POST })
    equals(@Body.Equals('age', '18', 'Not 18 years old!') @Body.isRequire('age') age: number) {
        return Result.send(`${age}`);
    }

    @Path({ value: '/AssertFalse', method: RequestMethod.POST })
    AssertFalse(@Body.AssertFalse('AssertFalse', 'Parameter must be boolean type false') fls:Boolean) {
        return Result.send(`${fls}`);
    }

    @Path({ value: '/AssertTrue', method: RequestMethod.POST })
    AssertTrue(@Body.AssertTrue('AssertTrue', 'Parameter must be boolean type true') tru:Boolean) {
        return Result.send(`${tru}`);
    }

    @Path({ value: '/DecimalMax', method: RequestMethod.POST })
    DecimalMax(@Body.DecimalMax('DecimalMax', 10.0, 'Input value cannot be greater than 10.0') DecimalMax:number) {
        return Result.send(`${DecimalMax}`);
    }

    @Path({ value: '/DecimalMin', method: RequestMethod.POST })
    DecimalMin(@Body.DecimalMin('DecimalMin', 10.0, 'Input value cannot be less than 10.0') DecimalMin:number) {
        return Result.send(`${DecimalMin}`);
    }

    @Path({ value: '/Max', method: RequestMethod.POST })
    Max(@Body.Max('Max', 10, 'Input value cannot be greater than 10') Max:number) {
        return Result.send(`${Max}`);
    }

    @Path({ value: '/Min', method: RequestMethod.POST })
    Min(@Body.Min('Min', 10, 'Input value cannot be less than 10') Min:number) {
        return Result.send(`${Min}`);
    }

    @Path({ value: '/Future', method: RequestMethod.POST })
    Future(@Body.Future('Future', 'Future parameter must be a future date format') Future:Date) {
        return Result.send(`${Future}`);
    }

    @Path({ value: '/Past', method: RequestMethod.POST })
    Past(@Body.Past('Past', 'Past parameter must be a past date format') Past:Date) {
        return Result.send(`${Past}`);
    }

    @Path({ value: '/Pattern', method: RequestMethod.POST })
    Pattern(@Body.Pattern('Pattern', /^111/, 'Pattern must start with 111') Pattern:any) {
        return Result.send(`${Pattern}`);
    }

    @Path({ value: '/Size', method: RequestMethod.POST })
    Size(@Body.Size('Size', 10, 20) Size:number) {
        return Result.send(`${Size}`);
    }

    @Path({ value: '/NotEmpty', method: RequestMethod.POST })
    NotEmpty(@Body.NotEmpty('id') id:number) {
        return Result.send(`${id}`);
    }

    @Path({ value: '/NotBlank', method: RequestMethod.POST })
    NotBlank(@Body.NotBlank('id') id:number) {
        return Result.send(`${id}`);
    }

    @Path({ value: '/Email', method: RequestMethod.POST })
    Email(@Body.Email('Email') Email:string) {
        return Result.send(`${Email}`);
    }

    @Path({ value: '/Phone', method: RequestMethod.POST })
    Phone(@Body.Phone('Phone', 'Parameter must be in phone number format') Phone:number) {
        return Result.send(`${Phone}`);
    }

    @Path({ value: '/ToDate', method: RequestMethod.POST })
    ToDate(@Body.ToDate('date', 'Parameter must be a date format string') date:Date) {
        return Result.send(`${date}`);
    }

    @Path({ value: '/ToBoolean', method: RequestMethod.POST })
    ToBoolean(@Body.ToBoolean('is', 'Parameter must be a boolean type') is:Boolean) {
        return Result.send(`${is}`);
    }

    @Path({ value: '/ToNumber', method: RequestMethod.POST })
    ToNumber(@Body.ToNumber('number') number:number) {
        return Result.send(`${number}`);
    }

    @Path({ value: '/ToArray', method: RequestMethod.POST })
    ToArray(@Body.ToArray('arr', '|') arr:Array<any>) {
        return Result.send(`${arr.join(',')}`);
    }

    @Path('/RequestParam')
    RequestParam(@RequestParam('param') param:string) {
        return this.send(`${param}`);
    }

    @Path('/classValidator')
    model(@Body(UserInfo) userInfo: UserInfo) {
        return Result.send(`This Post body info is ${JSON.stringify(userInfo)}`);
    }
}
