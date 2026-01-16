[中文](./README.zh-CN.md)

# Built-in Argument Decorators (ArgDecorator)

`UMajs` provides `createArgDecorator` to easily create custom argument decorators, and the framework also provides the following decorators for direct use.

## Usage

> Install: `npm install -S @umajs/arg-decorator`

## Example

```ts
import { Query, Body } from '@umajs/arg-decorator';

// URL parameter type validation
@Path('/saveUser')
saveUser(@Query.ToNumber('age') age :number) {
    return Result.send(`This router queryParms is ${userId} ${age}`);
}

// POST parameter type validation
@Path({value:'/post',method:RequestMethod.POST})
saveUser(@Body.ToNumber('age') age: number){
    return Result.send(`This Post body info is ${JSON.stringify(userInfo)}`);
}
```

When the interface is accessed via `localhost:port//saveUser?age=str`, the controller method will stop execution and return a client prompt message by default:

```js
{
    "code": 0,
    "msg": "age 参数必须为数据类型。入参值str"
}
```

## Validation Argument Decorators

|  <div style="width:450px">Decorator</div> | <div style="width:200px">Description</div> |
---|---
@Param(id:string) | Dynamic route parameter decorator
@Query(id:string) | URL parameter decorator
@Body(id?:string or Function or string[] or class) | POST request parameter decorator `@Body() body:class` or `@Body('id') id:any` or `@Body(['name','age']) user: {name:any,age:any}`
@Require(id: string,message?:string) | URL parameter decorator with required validation
@ToNumber(id: string,message?: string) | Parameter decorator converting to number type. Failure terminates execution and returns prompt.
@ToBoolean(id: string,message?: string) | Parameter decorator converting to boolean type. Failure terminates execution and returns prompt.
@ToArray(id: string, split?:string ,message?: string) | Parameter decorator converting to array. Failure terminates execution and returns prompt.
@ToDate(id: string,message?: string) | Parameter decorator converting to date type. Failure terminates execution and returns prompt. Note: If input is a number, it will be coerced to date format.
@Equals(id: string,comparison?: any) | Parameter decorator with value comparison validation.
@NotNull(id: string,message?: string) | Restriction: must not be null.
@AssertFalse(id: string,message?: string) | Restriction: must be false.
@AssertTrue(id: string,message?: string) | Restriction: must be true.
@DecimalMax(id: string,value: number,message?: string) | Restriction: must be a number not greater than the specified value.
@DecimalMin(id: string,value: number,message?: string) | Restriction: must be a number not less than the specified value.
@Future(id: string,message?: string) | Restriction: must be a future date.
@Max(id: string,value: number,message?: string) | Restriction: must be a number not greater than the specified value.
@Min(id: string,value: number,message?: string) | Restriction: must be a number not less than the specified value.
@Past(id: string,message?: string) | Restriction: must be a past date.
@Pattern(id: string,pattern: RegExp,message?: string) | Restriction: must match the specified regular expression.
@Size(id: string,max: number,min: number,message?: string) | Restriction: character length must be between min and max.
@NotEmpty(id: string,message?: string) | Validates that the annotated element is not null and not empty (string length > 0, collection size > 0).
@NotBlank(id: string,message?: string) | Validates that the annotated element is not empty (not null, length > 0 after trimming). Unlike @NotEmpty, @NotBlank applies only to strings and trims whitespace during comparison.
@Email(id: string,message?: string) | Validates that the annotated element is an Email.
@Phone(id: string,message?: string) | Validates that the element is a mobile phone number. Specific format reference: `https://github.com/validatorjs/validator.js/blob/master/src/lib/isMobilePhone.js`

## Non-Validation Argument Decorators

| <div style="width:450px">Decorator</div> | Description |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| @Cookies(id:string)         | Cookies parameter decorator |
| @Headers(id:string)         | Headers parameter decorator |
| @RequestParam(id:string)    | General GET/POST parameter decorator. For POST requests, parameter retrieval priority is: Body < Query. Same parameters in URL override body property values. |
| @RequestFile(field: string) | File parameter decorator for file uploads |

## Advanced

### Body Argument Decorator Accepting Class

> When Body is passed as a class, the data retrieved from the request parameters is used as arguments to call the class constructor. Property type validation is also performed. If validation succeeds, the instantiated object is returned. For more class usage, please refer to [`@umajs/class-validator`](https://github.com/Umajs/class-validator).

```ts
// Define class
import { Type, Required, Min, Model } from '@umajs/class-validator';
export default class UserInfo extends Model {
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

// Argument decorator usage
@Path({ value: '/post', method: RequestMethod.POST })
model(@Body(UserInfo) userInfo: user) {
    return Result.send(`This Post body info is ${JSON.stringify(userInfo)}`);

    // >> {"code":0,"msg":{"validate":{"id":["id must be of type number."],"name":["name is required."],"age":["age must be greater than 0."]},"parms":{"id":"1","age":-10}}}
}

```

### Custom Validation Prompt Content

The framework's default decorator prompt messages can be overridden via the configuration file `src/config/argDecorator.config.ts`. Through the `Result` module, users can customize the data format or method returned when validation fails, such as JSON or status codes.

```ts
import { Result } from '@umajs/core';

export default {
    Require: {
        err({key, ctx, tip, val}) {
            return Result.send(tip || `Request ${key} parameter cannot be empty. Input value is ${val}`, 403);
        },
    },
    ToNumber: {
        err({key, ctx, tip, val}) {
            return Result.json({
                code: 0,
                msg: tip || `Request ${key} parameter must be a number type. Input value is ${val}`,
            });
        },
    },
};

```
