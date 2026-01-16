[中文](./README.zh-CN.md)

# `Umajs`（Launched by 58）
> An easy-to-use framework base on Typescript

## Introduction

Umajs is a lightweight Node.js Web framework based on Typescript launched by 58.com. Its Chinese meaning is Ursa Major, and the Big Dipper is part of it; just as Umajs is also composed of different packages. We hope that every part of Umajs is excellent, shining, and can withstand the test of various large-scale projects.

## Features
* Based on Koa2, compatible with middleware.
* Unified Response (Result), making it easier and clearer for Controller to respond with data.
* Decorators, making code organization more elegant and convenient.
* Custom Decorators (createArgDecorator) can quickly extend argument decorators for parameter validation, transformation, aggregation, etc.
* Aspect-Oriented Programming (AOP), decorator-based `Aspect` can be easily used to intercept and modify arbitrary methods, and can convert middleware into `Aspect.around` usage.
* Dependency Injection (IOC), module dependencies no longer need to be imported and instantiated manually.
* Plugins and Aspects make middleware usage more elegant.
* High stability and high performance, with full unit test coverage.
* Route layering, optimizing route addressing.
* TS development is recommended, making development and maintenance clearer, and usage of dependency injection methods more convenient.
* Unified constraints and specifications.

## Usage

Please refer to: [Umajs Documentation](https://umajs.github.io)

Backup site [Recommended]: [https://umajs.gitee.io/](https://umajs.gitee.io/)

## Initialize Project

```
yarn install
yarn run init
```

## Run Sample

```
cd packages/app && npm run app
```

## Development

- When developing a sub-project, run in the sub-project root directory:
    ```
    npm start
    ```

- To start the web project, run in the app project root directory:
    ```
    npm run app
    ```

- To start debugging mode, just press F5 in the root directory.

## Contribution

Welcome to submit PRs or Issues to provide suggestions and feedback.

## Features Showcase

The following code demonstrates the following features:
> 1. Create argument decorators via `createArgDecorator` to validate and transform the `age` parameter.
> 
> 2. The controller easily responds with data via `Result` provided by the framework.
> 
> 3. `Aspect` intercepts methods via the `around` method, validating method `arguments` and validating/modifying `return values`.

```js
// index.controller.ts
import Method from './method.aspect';
import { AgeCheck } from './ArgDecorator';

@Aspect(Method) // Can decorate the class to decorate all methods
export default class extends  BaseController {

    // @Aspect(Method) // Can decorate a method to decorate a single method
    @Path('/hello')
    index(@Query('name') name: string, @AgeCheck('age') age: number ) {
        return Result.json({
            name,
            age,
        });
    }
}
```

```js
// ArgDecorator.ts
export const AgeCheck = createArgDecorator((ctx: IContext, ageKey: string) => {
    let age = ctx.query[ageKey];

    if (age === undefined) return Result.json({
        code: 0,
        msg: 'Please add age parameter',
    });

    age = +age;

    if (Number.isNaN(age) || age < 0 || age > 120) return Result.json({
        code: 0,
        msg: 'Please pass correct age parameter',
    });

    return age;
});
```

```js
// method.aspect.ts
import { IAspect, IProceedJoinPoint } from '@umajs/core';

export default class implements IAspect {
    async around(proceedPoint: IProceedJoinPoint) {
        const { proceed, args } = proceedPoint;

        // Validate arguments
        if (args[0] !== 'Umajs') return Result.send('name must be Umajs');

        const result = await proceed(...args);

        if (result.type === 'json') {
            // Add timestamp to JSON return value
            result.data.time = new Date();
        }

        return result;
    }
}
```
