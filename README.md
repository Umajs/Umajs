# `Umajs`（Launched by 58）
> An easy-to-use framework base on Typescript

## 简介

Umajs 是58同城推出的一款基于 Typescript 轻量级 Nodejs Web 框架。它的中文含义是大熊座，北斗七星都是它的组成部分；正如同 Umajs 也是由不同的 package 所组合在一起。我们希望 Umajs 的每一部分，都是优秀的、闪耀的、经受的住各种大型项目检验的。

## Features
* 基于 Koa2，兼容 middleware
* 统一响应 (Result)， 让 Controller 响应数据更便捷清晰
* 装饰器 (Decorator)，代码组织更优雅方便
* 自定义装饰器 (createArgDecorator)， 可以快速的扩展参数装饰器，用于参数校验、参数转换、参数聚合等
* 面向切面 (AOP)，基于装饰器的 `Aspect` 可以很方便的对任意方法进行拦截、修改等，并且能将中间件转换成 `Aspect.around` 使用
* 依赖注入 (IOC)，模块依赖不再需要引入和实例化
* 插件、切面形式让中间件(Middleware)使用更优雅
* 高稳定高性能，单元测试覆盖全
* 路由分层，优化路由寻址
* 推荐 TS 开发，开发维护更清晰，对于依赖注入的方法使用也更便捷
* 统一约束和规范

## 使用方法

请参考： [Umajs使用文档](https://umajs.github.io)

备用站点【推荐】：[https://umajs.gitee.io/](https://umajs.gitee.io/)

## 初始化项目

```
yarn install
yarn run init
```

## 运行Sample

```
cd packages/app && npm run app
```

## 开发

- 开发子项目时，在子项目根目录执行
    ```
    npm start
    ```

- 启动 web 工程，在 app 项目根录目执行
    ```
    npm run app
    ```

- 启动调试模式，在根目录按 F5 即可

## 贡献

欢迎提交 PR 或者 Issue，向我们反馈建议和问题。

