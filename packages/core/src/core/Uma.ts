import * as Koa from 'koa';
import * as path from 'path';
import * as http from 'http';
import * as https from 'https';
import * as bodyParser from 'koa-body';

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
import { TUmaOption } from '../types/TUmaOption';
import { IContext } from '../types/IContext';
import { TConfig, TPluginConfig } from '../types/TConfig';
import { TControllerInfo } from '../types/TControllerInfo';

let instance: Uma = null;

export default class Uma {
    private constructor(readonly options: TUmaOption, app?: Koa<Koa.DefaultState, IContext>) {
        console.assert(options && options.ROOT, `Uma options.ROOT must set value. e.g { ROOT: './src' }, now ${JSON.stringify(options)}`);

        this.options = mixin(true, {
            jsonpBody: {},
            configPath: path.resolve(options.ROOT, 'config'),
            env: process.env.NODE_ENV || 'development',
            strictDir: false,
        }, options);

        const { env, proxy, subdomainOffset } = this.options;

        process.env.NODE_ENV = env;

        this.env = env;
        this.app = app || new Koa();

        if (proxy) this.app.proxy = proxy;
        if (subdomainOffset) this.app.subdomainOffset = subdomainOffset;
    }

    env: string;

    app: Koa<Koa.DefaultState, IContext> = null;

    server: http.Server | https.Server;

    callback: Function;

    port: number;

    routers: string[] = [];

    config: TConfig;

    private async load() {
        this.loadConfig();

        await this.loadPlugin();

        const reservedDir = ['aspect', 'plugins'];

        ResourceLoader.loadResourceDir(this.options.ROOT, reservedDir);
    }

    loadConfig() {
        ConfigLoader.loadConfigDir(this.options.configPath);
        Object.freeze(ConfigLoader.config);
        this.config = ConfigLoader.config;
    }

    async loadPlugin() {
        await PluginLoader.loadDir(this.options.ROOT);
    }

    use(mw: Koa.Middleware<any, IContext>) {
        this.app.use(mw);
    }

    get context(): IContext {
        return this.app.context;
    }

    async start(port: number = 8058, callback?: Function) {
        if (!this.port) this.port = port;
        if (callback) this.callback = callback;
        const { app, options: { createServer } } = this;
        const koaCallback = app.callback();

        await this.prepare();
        this.server = createServer ? createServer(koaCallback) : http.createServer(koaCallback);

        this.server.listen(this.port, async () => {
            console.log(`Uma server running at port: ${this.port} `);
            console.log(`Uma version: ${packageInfo.version}`);

            if (typeof this.callback === 'function') {
                await Promise.resolve(Reflect.apply(this.callback, this, []));
            }
        });
    }

    async prepare() {
        const { app, options: { Router, beforeLoad, afterLoaded } } = this;

        mixin(false, app.request, Request);
        mixin(false, app.response, Response);
        mixin(false, app.context, Context);

        if (typeHelper.isFunction(beforeLoad)) await Promise.resolve(Reflect.apply(beforeLoad, this, [this]));

        // koa-body
        if (this.options.bodyParser) {
            this.app.use((ctx, next) => {
                if (['POST', 'PUT', 'PATCH'].indexOf(ctx.method) > -1) {
                    const bodyParserOpts = mixin(false, { multipart: true }, this.options.bodyParser);

                    return Reflect.apply(bodyParser(bodyParserOpts), null, [ctx, next]);
                }

                return next();
            });
        }

        await this.load();

        this.use(Router());

        if (typeHelper.isFunction(afterLoaded)) await Promise.resolve(Reflect.apply(afterLoaded, this, [this]));
    }

    // static property start
    static version:string = packageInfo.version;

    static use(mw: Koa.Middleware<any, IContext>) {
        Uma.instance().use(mw);
    }

    static get env() {
        return Uma.instance().env;
    }

    static get app() {
        return Uma.instance().app;
    }

    static get server() {
        return Uma.instance().server;
    }

    static get options() {
        return Uma.instance().options;
    }

    static get config() {
        return ConfigLoader.config;
    }

    static get pluginConfig(): boolean | TPluginConfig {
        return ConfigLoader.config.plugin;
    }

    static get pluginKeys(): string[] {
        const pluginKeys = [];

        for (const [name, config] of Object.entries(Uma.config.plugin)) {
            if (config === true) {
                pluginKeys.push(name);
            } else if (config === false) {
                continue;
            } else if (config.enable === true) {
                pluginKeys.push(name);
            }
        }

        return pluginKeys;
    }

    static pluginOptions(pluginName: string) {
        const pluginCfg = Uma.config.plugin[pluginName];

        return typeHelper.isBoolean(pluginCfg) ? {} : pluginCfg.options;
    }

    static get context(): IContext {
        return Uma.instance().context;
    }

    /**
     * getControllerInfo()
     */
    static get controllersInfo(): IterableIterator<TControllerInfo> {
        return controllerInfo.getControllersInfo();
    }

    /**
     * Uma instance     eg. Uma.instance({...})
     * Uma getInstance  eg. Uma.instance()
     * @param options Uma options
     */
    static instance(options?: TUmaOption): Uma {
        if (instance) return instance;

        instance = new Uma(options);

        return instance;
    }

    /**
     * (async () => {
     *     const app = new Koa();
     *     app.use(await Uma.middleware({...}, app));
     * })();
     * @param options Uma options
     * @param app Koa instance
     */
    static async middleware(options: TUmaOption, app: Koa): Promise<Koa.Middleware> {
        if (instance) throw new Error('Uma can only be instantiated once, app.use(Uma.middleware({...}))');

        instance = new Uma(options, <Koa<Koa.DefaultState, IContext>>app);

        mixin(false, app.request, Request);
        mixin(false, app.response, Response);
        mixin(false, app.context, Context);

        await instance.load();

        return this.options.Router();
    }

    /**
     * (async () => {
     *    const app = express();
     *    const callback = <any> await Uma.callback(options);
     *    app.use((req, res, next) => callback(req, res).then(() => {
     *          if (res.headersSent) return;
     *          next();
     *      }));
     * })()
     * @param options Uma options
     * @param app Koa instance
     */
    static async callback(options: TUmaOption, app?: Koa) {
        if (instance) throw new Error('Uma can only be instantiated once, const koaCallback = Uma.callback({...})');

        instance = new Uma(options, <Koa<Koa.DefaultState, IContext>>app);
        await instance.prepare();

        return instance.app.callback();
    }
}
