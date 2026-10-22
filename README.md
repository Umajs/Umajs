[中文](./README.zh-CN.md)

# `Umajs`（Launched by 58）
> An easy-to-use framework based on TypeScript

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

```sh
nvm install
nvm use
npm ci
```

With nvm installed, run these commands from the repository root. `.nvmrc` pins Node.js to `22.17.0`; npm workspaces installs dependencies for the root and all packages and links local packages automatically.

## Run Sample

Build the local packages before starting the sample:

```sh
npx lerna run build
npm run app --workspace=app
```

The sample configures port `8058`. Currently, startup fails with `TS2351` at `new Koa()` in `packages/app/src/app.ts`: its namespace import is not constructable with the current TypeScript configuration. Resolve this compilation error before expecting the service to listen.

## Development

- Run the following commands from the repository root. For example, watch TypeScript compilation for the core package:
    ```sh
    npm run build-w --workspace=@umajs/core
    ```

    Currently, `npm start --workspace=@umajs/core` starts both watchers, but its lint watcher reports `Invalid option '--pass-on-patterns'`. Use the compilation watcher above and run lint separately.

- Check or build a package by its workspace name:
    ```sh
    npm run lint --workspace=@umajs/core
    npm run build --workspace=@umajs/core
    ```

- Run the configured test suites, or only the core tests:
    ```sh
    npm test
    npm run test:core
    ```

    `npm test` chains the core, router, i18n, session, and argument-decorator suites with `&&`, stopping at the first failure. Currently, four assertions in the core `Aspect.test.ts` fail, so later suites are not reached by this command.

- Existing VS Code configurations in `.vscode/launch.json` point to missing package-local `ts-node` files after workspace installation. Before using F5, update each `program` to `${workspaceFolder}/node_modules/ts-node/dist/bin.js` while retaining its package-specific `cwd` and arguments. The sample compilation error above still needs to be resolved.

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
