[English](CHANGELOG.md) | [简体中文](CHANGELOG.zh-CN.md)

## Unreleased

以下记录根据仓库 `2.0.6` 版本提交（[cd4bf32](https://github.com/Umajs/Umajs/commit/cd4bf3249f25316371af3fc05153f6b72549406e)）之后的代码变更整理，发布状态待确认。

### 新功能

* **core:** 控制器与 `@Service` 通过内部依赖注入容器实例化，支持根据构造参数元数据递归解析依赖；资源加载失败、插件缺失或插件类型配置错误时抛出 `UmaError`。([6adcfed](https://github.com/Umajs/Umajs/commit/6adcfed4b34964d0fec1a246a17d694e77dad019))
* **core:** 增加 `Uma.logger`，启动及路由日志使用统一日志接口；`start()` 捕获初始化异常后记录错误并以状态码 `1` 退出进程。([9994103](https://github.com/Umajs/Umajs/commit/9994103a8803f9e2f153b75dc0a41edfae8f85ca), [6adcfed](https://github.com/Umajs/Umajs/commit/6adcfed4b34964d0fec1a246a17d694e77dad019))
* **core:** 加载与当前 `NODE_ENV` 匹配的 `<名称>.config.<环境>` 配置并参与深度合并，未设置 `NODE_ENV` 时按 `development` 匹配。([7456e2a](https://github.com/Umajs/Umajs/commit/7456e2a1fbfa30cccd906ec7afcd1566c7d7ce82))

### 缺陷修复

* **core:** `mixin` 深度合并支持循环引用与数组，并跳过 `__proto__`、`constructor`、`prototype` 属性，防止原型污染。([e6d64c9](https://github.com/Umajs/Umajs/commit/e6d64c97c0b8e7efa357bb9168055c771ab0291e))
* **router:** 同一静态路径支持按不同 HTTP 方法注册处理器；正则路由在匹配路径前先过滤请求方法，避免被方法不匹配的路由截断；路由冲突检测同时检查路径与 HTTP 方法。([9994103](https://github.com/Umajs/Umajs/commit/9994103a8803f9e2f153b75dc0a41edfae8f85ca))

### 不兼容变更

* **core:** 控制器元数据改用 `reflect-metadata` 存储；`Uma.controllersInfo` 返回值由 `IterableIterator<TControllerInfo>` 改为 `TControllerInfo[]`，调用迭代器 `.next()` 的代码需调整。([7456e2a](https://github.com/Umajs/Umajs/commit/7456e2a1fbfa30cccd906ec7afcd1566c7d7ce82))
* **core:** 启动初始化失败会退出进程，资源加载失败会抛出异常；依赖原有错误处理行为的应用需核对启动和异常处理逻辑。([6adcfed](https://github.com/Umajs/Umajs/commit/6adcfed4b34964d0fec1a246a17d694e77dad019))

## [2.0.6](https://github.com/Umajs/Umajs/compare/v2.0.5...cd4bf3249f25316371af3fc05153f6b72549406e)

根据仓库版本提交整理；版本提交日期为 2026-01-19，不代表已核实 npm 发布日期。

### 缺陷修复

* **core:** 首次初始化缺少配置或 `ROOT` 时抛出错误；`Result.finish()` 在响应处理器不存在时返回 `undefined`，避免调用非函数。
* **arg-decorator:** 调整默认校验提示为英文，修正 `NotBlank` 的错误提示；移除请求体未定义时的 `@Body` 断言，保留空对象兜底。

### 依赖更新

* **core, router, cli, plugins:** 更新运行时依赖并同步包版本与内部依赖；其中 `koa-body` 从 `4.x` 升级至 `7.x`，`path-to-regexp` 从 `3.x` 升级至 `8.x`，`commander` 从 `3.x` 升级至 `9.x`。升级应用时需核对依赖的 API、路由模式及 Node.js 版本要求。

## [2.0.5](https://github.com/Umajs/Umajs/compare/v2.0.4...v2.0.5) (2022-09-14)

### 依赖更新

* **packages:** 同步框架、路由、参数装饰器和插件版本及内部依赖至 `2.0.5`；`@umajs/cli` 保持 `2.0.4`。

## [2.0.4](https://github.com/Umajs/Umajs/compare/v2.0.4-alpha.0...v2.0.4) (2022-09-14)


### 新功能

* 更新 ts-node ([bd5db1f](https://github.com/Umajs/Umajs/commit/bd5db1fff2b32257561cb99eefc60f632c6c2dde))


### 性能优化

* 升级 npm 版本 ([837aa8d](https://github.com/Umajs/Umajs/commit/837aa8ded859262996772b077d6a49bf166313e7))



## [2.0.4-alpha.0](https://github.com/Umajs/Umajs/compare/v2.0.3...v2.0.4-alpha.0) (2022-09-13)


### 新功能

* 升级 TypeScript 插件版本并修复 @umajs/router 类型定义 ([56e2774](https://github.com/Umajs/Umajs/commit/56e2774c73524c35accc2296ab5053fdc4662fd0))



## [2.0.3](https://github.com/Umajs/Umajs/compare/v2.0.2...v2.0.3) (2022-03-14)


### 新功能

* **arg-decorator:** Query 装饰器支持直接访问校验装饰器，例如 @Query.isRequire ([4c63db7](https://github.com/Umajs/Umajs/commit/4c63db765de5b62e334ab0311bc05676dd5c0be0))



## [2.0.2](https://github.com/Umajs/Umajs/compare/v2.0.1...v2.0.2) (2021-12-30)


### 缺陷修复

* Around 装饰器调整 ([1eeca15](https://github.com/Umajs/Umajs/commit/1eeca150df88277455a4bc6d5da28c8bf2470f40))
* **around:** 修复 Around 装饰器错误 ([33c454c](https://github.com/Umajs/Umajs/commit/33c454c74727f32d005864f6a195745fc6661036))
* **typehelper:** 调整 isPromise 返回类型 ([8cce060](https://github.com/Umajs/Umajs/commit/8cce0601a74ab11234c3567fd0ae845aeca17aa8))
* 更新代码风格 ([fea0c62](https://github.com/Umajs/Umajs/commit/fea0c6299ba39d8174760510b1d83beb91cb79d7))


### 性能优化

* 优化注释 ([bc40575](https://github.com/Umajs/Umajs/commit/bc4057506a13b0384da05e03ef4907018160b91a))



## [2.0.1](https://github.com/Umajs/Umajs/compare/v1.2.4...v2.0.1) (2021-11-02)


### 缺陷修复

* 修复重复注册路由的问题 ([8ea3633](https://github.com/Umajs/Umajs/commit/8ea36337a1eb41d51e75be809d7965b8aea5269e))



## [2.0.1-alpha.0](https://github.com/Umajs/Umajs/compare/v2.0.0-alpha.0...v2.0.1-alpha.0) (2021-04-27)


### 性能优化

* 移除未使用的代码 ([e01fe62](https://github.com/Umajs/Umajs/commit/e01fe624d12cfc0db8faf7d1a6e46defc71aac64))
* 更新 Result 类型 ([b3d6a83](https://github.com/Umajs/Umajs/commit/b3d6a838ec9f31600e9f8004f37d9aa56177ec00))
* 更新 T ([caec953](https://github.com/Umajs/Umajs/commit/caec9536737fb14b6d104cc58ae256195b41a603))
* 更新版本 ([90dc5fe](https://github.com/Umajs/Umajs/commit/90dc5fe1b170d0e743e20de89ea9d1019619a237))



# [2.0.0-alpha.0](https://github.com/Umajs/Umajs/compare/v1.2.2...v2.0.0-alpha.0) (2021-04-26)


### 新功能

* Umajs V2 ([acd217b](https://github.com/Umajs/Umajs/commit/acd217bdbf6b01ebf43b7629d39564f58d32e5ff))


### 性能优化

* 移除对象形式的插件 ([c7cfff4](https://github.com/Umajs/Umajs/commit/c7cfff48a9e073f90e2fa06e54825c96940a2ab7))
* 移除 Private 并添加 Path 别名 ([26551d4](https://github.com/Umajs/Umajs/commit/26551d46064c23de399c0a1e23fa0e5ff4e63ef1))



## [1.2.4](https://github.com/Umajs/Umajs/compare/v1.2.3...v1.2.4) (2021-08-31)



## [1.2.3](https://github.com/Umajs/Umajs/compare/v2.0.1-alpha.0...v1.2.3) (2021-07-21)



## [2.0.1-alpha.0](https://github.com/Umajs/Umajs/compare/v2.0.0-alpha.0...v2.0.1-alpha.0) (2021-04-27)


### 性能优化

* 移除未使用的代码 ([e01fe62](https://github.com/Umajs/Umajs/commit/e01fe624d12cfc0db8faf7d1a6e46defc71aac64))
* 更新 Result 类型 ([b3d6a83](https://github.com/Umajs/Umajs/commit/b3d6a838ec9f31600e9f8004f37d9aa56177ec00))
* 更新 T ([caec953](https://github.com/Umajs/Umajs/commit/caec9536737fb14b6d104cc58ae256195b41a603))
* 更新版本 ([90dc5fe](https://github.com/Umajs/Umajs/commit/90dc5fe1b170d0e743e20de89ea9d1019619a237))



# [2.0.0-alpha.0](https://github.com/Umajs/Umajs/compare/v1.2.2...v2.0.0-alpha.0) (2021-04-26)


### 缺陷修复

* **aspect:** 调整 Around 函数名称 ([05ceed8](https://github.com/Umajs/Umajs/commit/05ceed831693059b58f05977c1ca90672c35b867))


### 新功能

* Umajs V2 ([acd217b](https://github.com/Umajs/Umajs/commit/acd217bdbf6b01ebf43b7629d39564f58d32e5ff))


### 性能优化

* 移除对象形式的插件 ([c7cfff4](https://github.com/Umajs/Umajs/commit/c7cfff48a9e073f90e2fa06e54825c96940a2ab7))
* 移除 Private 并添加 Path 别名 ([26551d4](https://github.com/Umajs/Umajs/commit/26551d46064c23de399c0a1e23fa0e5ff4e63ef1))
* 更新 ([89a005a](https://github.com/Umajs/Umajs/commit/89a005a8c72e24daaf5035e73a8bd33e176c2ad2))
* 升级 npm 版本 ([ec7af1c](https://github.com/Umajs/Umajs/commit/ec7af1c9a89b4f788ad972c5124a4e724755e61d))



## [1.2.2](https://github.com/Umajs/Umajs/compare/v1.2.1...v1.2.2) (2021-01-05)



## [1.2.1](https://github.com/Umajs/Umajs/compare/v1.2.0...v1.2.1) (2020-12-28)


### 缺陷修复

* 调整 Path 注释 ([f32f689](https://github.com/Umajs/Umajs/commit/f32f689b1d6df2ee632e62e58f4c4468fea3bb56))


### 性能优化

* **i18n:** 本地缓存优化 ([a0cf0b7](https://github.com/Umajs/Umajs/commit/a0cf0b73999b4ab270fe1ae25100f4fa1672a859))



# [1.2.0](https://github.com/Umajs/Umajs/compare/v1.1.5...v1.2.0) (2020-12-14)


### 性能优化

* 移除未使用的代码 ([1ac22ce](https://github.com/Umajs/Umajs/commit/1ac22ce9d04c1855e2ceb4da9548d99f75e7103b))
* 更新 ([98c4e47](https://github.com/Umajs/Umajs/commit/98c4e47054b2a6a13c8b70d7f92d14639f76e5fe))



## [1.1.5](https://github.com/Umajs/Umajs/compare/v1.1.4...v1.1.5) (2020-11-30)



## [1.1.4](https://github.com/Umajs/Umajs/compare/v1.1.3...v1.1.4) (2020-11-13)


### 缺陷修复

* **app:** 调整应用实例 ([435ae15](https://github.com/Umajs/Umajs/commit/435ae15d24a405375f997e72865377dacea493d2))


### 性能优化

* **env:** 环境处理调整 ([590af86](https://github.com/Umajs/Umajs/commit/590af866fdca2469e93dc5f220f8f5f13f96706b))



## [1.1.3](https://github.com/Umajs/Umajs/compare/v1.1.2...v1.1.3) (2020-11-10)


### 缺陷修复

* @Path 可多次装饰同一方法，使其同时支持 GET 和 POST 请求访问 ([d908974](https://github.com/Umajs/Umajs/commit/d9089741cf98a554971776caefe492effd4bb990))


### 性能优化

* **eslint:** 代码风格调整 ([36e0f62](https://github.com/Umajs/Umajs/commit/36e0f62e89ed5fa52e0a289fb254234dd8ea1f9b))
* 调整 methodType ([5a3f2e7](https://github.com/Umajs/Umajs/commit/5a3f2e785c402c3931cc920f1a6ee1132fb78f26))
* 调整 methodType ([bef90eb](https://github.com/Umajs/Umajs/commit/bef90ebd62152cb24d248e14da0bfcb831a4d7ad))
* 修复 methodType 错误 ([937903b](https://github.com/Umajs/Umajs/commit/937903b6e37b0653a5edfdc60dddf99440416aa4))



## [1.1.2](https://github.com/Umajs/Umajs/compare/v1.1.1...v1.1.2) (2020-10-29)


### 缺陷修复

* **views:** 调整 koa-views ([cff194a](https://github.com/Umajs/Umajs/commit/cff194a7f738050b15c45097389c8489a92ab2de))


### 性能优化

* **loader:** 插件加载器优化 ([cbe8d25](https://github.com/Umajs/Umajs/commit/cbe8d253776703735ea34c30092b575550c6910f))
* **loader:** 调整 reservedDir ([f9a488d](https://github.com/Umajs/Umajs/commit/f9a488d3ce91b7602944ea4cf618ad56f922dd9f))



## [1.1.1](https://github.com/Umajs/Umajs/compare/v1.1.0...v1.1.1) (2020-10-22)


### 缺陷修复

* **loader:** 修复启用逻辑 ([9f9046e](https://github.com/Umajs/Umajs/commit/9f9046e34954982d0bb87481a1a1d1f5c5112375))



# [1.1.0](https://github.com/Umajs/Umajs/compare/v1.0.1...v1.1.0) (2020-10-22)


### 缺陷修复

* **decorator:** 参数装饰器修复 ([0889633](https://github.com/Umajs/Umajs/commit/088963355ad4b54ced2d1f417e9dc223137feaa6))


### 新功能

* **add body decorator:** 在 @uma/arg-decorator 中新增 Body 装饰器 ([3396528](https://github.com/Umajs/Umajs/commit/33965281274c2646e2f7e8482a5f1e3f9d0d687c))
* **changelog:** 添加变更记录 ([181e628](https://github.com/Umajs/Umajs/commit/181e628fe650b26e4d8f233884b06ade4ab2663f))
* **decorator:** 新增 Require 和 Number ([fa15403](https://github.com/Umajs/Umajs/commit/fa15403180fa66b5032870333b55f49f99f5920a))
* **path:** 新增 @umajs/path ([c4377f4](https://github.com/Umajs/Umajs/commit/c4377f4dab299e12575d1cdb734e79d458a0530d))
* **result:** 支持泛型 ([4747305](https://github.com/Umajs/Umajs/commit/47473059525124d0767514f458d2c39259cf9711))


### 性能优化

* 请求体模型优化 ([4c89c36](https://github.com/Umajs/Umajs/commit/4c89c36a053547065931cadf1ff70f98b6364b24))
* 代码风格调整 ([5264796](https://github.com/Umajs/Umajs/commit/52647969131287cb7b17d5fa7a5e9c7db56e9e32))
* **types:** 更新类型定义 ([c6881ac](https://github.com/Umajs/Umajs/commit/c6881ac3c06cfda1d872a0bc51b47459d30fbe4f))
* 更新 URL ([149088d](https://github.com/Umajs/Umajs/commit/149088da5e00db2a5b2c667f788fef1fddc50c85))
* **version:** 调整 Uma 静态版本信息 ([f2355f7](https://github.com/Umajs/Umajs/commit/f2355f7ddbc2f21ee94c6001f70b31ec3df929a5))
* **views:** 更新视图 ([dee7826](https://github.com/Umajs/Umajs/commit/dee7826f17d6abda48ac83345e22a9861cb6af2e))


### 回退记录

* 回退重构：添加可在各处使用的 UmaController 和 UmaService，并要求使用 Uma.instance({strictDir:true}) ([8de5582](https://github.com/Umajs/Umajs/commit/8de5582c122747aaef7045e303b21e37750e7be7))



## [1.0.1](https://github.com/Umajs/Umajs/compare/v1.0.0...v1.0.1) (2020-09-22)


### 新功能

* **arg-decorator:** 新增 arg-decorator 包 ([e503f5e](https://github.com/Umajs/Umajs/commit/e503f5e3b3aac5103291e62df691eb86c2a650fe))
* 在 Lerna 中忽略 ar-decorator ([0d9a1c7](https://github.com/Umajs/Umajs/commit/0d9a1c76e721c5ddd9bec5478a39aae172900122))


### 性能优化

* **decorator:** 添加提示信息 ([ba12427](https://github.com/Umajs/Umajs/commit/ba124270453092945d737af5002a0b5a7901e89b))
* **types:** 更新类型定义 ([11249f5](https://github.com/Umajs/Umajs/commit/11249f5c966c963879b879d5098e8aec82ee8373))



# [1.0.0](https://github.com/Umajs/Umajs/compare/v0.1.9...v1.0.0) (2020-09-10)


### 缺陷修复

* **ctx:** 调整 serHeader ([2b91fa9](https://github.com/Umajs/Umajs/commit/2b91fa904691b0e40ec98f4ff3fd9afa30dae5d8))


### 性能优化

* **config:** 冻结配置 ([4114f2e](https://github.com/Umajs/Umajs/commit/4114f2e26454805d9b661c508786e6eb4d1507d2))
* **loader:** 调整保留目录 ([d301f47](https://github.com/Umajs/Umajs/commit/d301f478c162d484e44be55836c3c94b70cd6b9f))
* **log:** 移除未使用的日志 ([e8f8aa6](https://github.com/Umajs/Umajs/commit/e8f8aa65bee3308e2acf948a553a076258112496))



## [0.1.9](https://github.com/Umajs/Umajs/compare/4460f5cd3a73f0bd00433fea6a027daa5d8db506...v0.1.9) (2020-08-25)


### 新功能

* 新增 plugin-session ([50e4a89](https://github.com/Umajs/Umajs/commit/50e4a8993b519e958a7c4ce9785fc9ec6fd41c64))
* **cli:** 初始化 ([8fdbf88](https://github.com/Umajs/Umajs/commit/8fdbf88f3e9e2042f10dbf34ce49774cddcd9f61))
* **core:** 新增 strictDir 参数 ([0506dc7](https://github.com/Umajs/Umajs/commit/0506dc7a70d37a75cb504830bea62044a698eef1))
* 初始化 plugin-i18n ([28b1577](https://github.com/Umajs/Umajs/commit/28b15773d1ef5a407f2ccc89e8cb66dd61402e0a))
* 初始化 plugin-status ([7ed4cba](https://github.com/Umajs/Umajs/commit/7ed4cbafa87566b901af2f6ebca7b56dbe7fae15))
* **plugin-static:** 初始化静态资源插件 ([16dfc3f](https://github.com/Umajs/Umajs/commit/16dfc3faebbcc9336593ca909863580180119ab3))
* **plugin-views:** 初始化视图插件 ([4460f5c](https://github.com/Umajs/Umajs/commit/4460f5cd3a73f0bd00433fea6a027daa5d8db506))
* **router:** 初始化路由 ([e566d60](https://github.com/Umajs/Umajs/commit/e566d600810355111e3c1f8096e4828d2939c904))



