import * as Koa from 'koa';
import * as path from 'path';
import * as http from 'http';
import * as https from 'https';
import * as bodyParser from 'koa-body';

import AspectLoader from '../loader/AspectLoader';
import ControllerLoader from '../loader/ControllerLoader';
import ServiceLoader from '../loader/ServiceLoader';
import ResourceLoader from '../loader/ResourceLoader';
import ConfigLoader from '../loader/ConfigLoader';
import PluginLoader from '../loader/PluginLoader';
import controllerInfo from '../info/controllerInfo';
import { packageInfo } from '../info/packageInfo';

import { Context } from '../extends/Context';
import { Request } from '../extends/Request';
import { Response } from '../extends/Response';
import typeHelper from '../utils/typeHelper';
import mixin from '../utils/mixin';
import { TUrsaOption } from '../types/TUrsaOption';
import { IContext } from '../types/IContext';
import { TConfig } from '../types/TConfig';

let instance: Ursa = null;

export default class Ursa {
    private constructor(readonly options: TUrsaOption) {
        console.assert(options && options.ROOT, `Ursa options.ROOT must set value. e.g { ROOT: './src' }, now ${JSON.stringify(options)}`);

        this.options = mixin(true, {
            bodyParser: true,
            jsonpBody: {},
            configPath: path.resolve(options.ROOT, 'config'),
            env: process.env.NODE_ENV,
        }, options);

        const { env, proxy, subdomainOffset } = this.options;

        if (proxy) this.app.proxy = proxy;
        if (subdomainOffset) this.app.subdomainOffset = subdomainOffset;
        this.env = env;
        process.env.NODE_ENV = this.env;
    }

    config: TConfig;

    env: string;

    app: Koa<Koa.DefaultState, IContext> = new Koa();

    server: http.Server | https.Server;;

    routers: string[] = [];

    port: number;

    callback: Function;

    private async load() {
        this.loadConfig();

        this.loadResource();

        this.loadAspect();

        this.loadService();

        this.loadController();

        await this.loadPlugin();
    }

    loadConfig() {
        ConfigLoader.loadConfigDir(this.options.configPath);
        this.config = ConfigLoader.config;
    }

    loadService() {
        ServiceLoader.loadServiceDir(path.resolve(this.options.ROOT, 'service'));
    }

    loadAspect() {
        AspectLoader.loadAspectDir(path.resolve(this.options.ROOT, 'aspect'));
    }

    loadResource() {
        ResourceLoader.loadResourceDir(this.options.ROOT, ['aspect', 'config', 'controller', 'i18n', 'plugins', 'service']);
    }

    loadController() {
        ControllerLoader.loadControllerDir(path.resolve(this.options.ROOT, 'controller'));
    }

    async loadPlugin() {
        if (this.options.bodyParser) {
            this.app.use((ctx, next) => {
                if (['POST', 'PUT', 'PATCH'].indexOf(ctx.method) > -1) {
                    const bodyParserOpts = mixin(false, { multipart: true }, this.options.bodyParser);

                    return Reflect.apply(bodyParser(bodyParserOpts), null, [ctx, next]);
                }

                return next();
            });
        }

        await PluginLoader.loadDir(this.options.ROOT);
    }

    use(mw: Koa.Middleware<any, IContext>) {
        this.app.use(mw);
    }

    get context() {
        return this.app.context;
    }

    async start(port: number = 8058, callback?: Function) {
        if (!this.port) this.port = port;
        if (callback) this.callback = callback;

        const { app, options: { createServer, Router, beforeLoad, afterLoaded } } = this;

        mixin(false, app.request, Request);
        mixin(false, app.response, Response);
        mixin(false, app.context, Context);

        if (typeHelper.isFunction(beforeLoad)) await Promise.resolve(Reflect.apply(beforeLoad, this, [this]));

        await this.load();

        this.use(Router());

        if (typeHelper.isFunction(beforeLoad)) await Promise.resolve(Reflect.apply(afterLoaded, this, [this]));

        if (createServer) {
            console.assert(typeHelper.isFunction(createServer), 'config.createServer must be a function');
        }

        const koaCallback = app.callback();

        this.server = createServer ? createServer(koaCallback) : http.createServer(koaCallback);

        this.server.listen(this.port, async () => {
            console.log(`Ursa server running at port: ${this.port} `);
            console.log(`Ursa version: ${packageInfo.version}`);

            if (typeof this.callback === 'function') {
                await Promise.resolve(Reflect.apply(this.callback, this, []));
            }
        });
    }

    static use(mw: Koa.Middleware<any, IContext>) {
        Ursa.instance().use(mw);
    }

    static get env() {
        return Ursa.instance().env;
    }

    static get app() {
        return Ursa.instance().app;
    }

    static get server() {
        return Ursa.instance().server;
    }

    static get options() {
        return Ursa.instance().options;
    }

    static get config() {
        return ConfigLoader.config;
    }

    static get context() {
        return Ursa.instance().context;
    }

    static instance(options?: TUrsaOption): Ursa {
        if (instance) return instance;

        instance = new Ursa(options);

        return instance;
    }

    static get controllersInfo() {
        return controllerInfo.getControllersInfo();
    }
}
