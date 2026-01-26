import Koa = require('koa');
import * as path from 'path';
import * as http from 'http';
import * as https from 'https';
import { koaBody } from 'koa-body';

import ResourceLoader from '../loader/ResourceLoader';
import ConfigLoader from '../loader/ConfigLoader';
import PluginLoader from '../loader/PluginLoader';
import controllerInfo from '../info/controllerInfo';
import { packageInfo } from '../info/packageInfo';
import { UmaError } from './UmaError';
import { ILogger, ConsoleLogger } from '../logger/ILogger';

import { Context } from '../extends/Context';
import { Request } from '../extends/Request';
import { Response } from '../extends/Response';
import typeHelper from '../utils/typeHelper';
import mixin from '../utils/mixin';
import type { TUmaOption } from '../types/TUmaOption';
import type { IContext } from '../types/IContext';
import type { TConfig, TPluginConfig } from '../types/TConfig';
import type { TControllerInfo } from '../types/TControllerInfo';

let instance: Uma | null = null;

export default class Uma {
    /**
     * Private constructor to enforce singleton pattern
     * Initializes the Uma instance with options and optional Koa app
     * @param options Uma configuration options
     * @param app Optional existing Koa instance
     */
    private constructor(readonly options: TUmaOption, app?: Koa<Koa.DefaultState, IContext>) {
        if (!options || !options.ROOT) {
            throw new Error(`Uma options.ROOT must set value. e.g { ROOT: './src' }, now ${JSON.stringify(options)}`);
        }

        // Merge default options with user provided options
        this.options = mixin(true, {
            jsonpBody: {},
            configPath: path.resolve(options.ROOT, 'config'),
            env: process.env.NODE_ENV,
            strictDir: false,
        }, options);

        const { env = 'development', proxy, subdomainOffset } = this.options;

        process.env.NODE_ENV = env;

        this.env = env;
        this.app = app || new Koa();

        if (proxy) this.app.proxy = proxy;
        if (subdomainOffset) this.app.subdomainOffset = subdomainOffset;

        // Default logger
        this.logger = new ConsoleLogger();
    }

    env: string;

    app: Koa<Koa.DefaultState, IContext>;

    server: http.Server | https.Server;

    callback: (...args: any[]) => any;

    port: number;

    routers: string[] = [];

    config: TConfig;

    logger: ILogger;

    /**
     * Load core resources including config, plugins, and aspects
     * This method is called during the preparation phase
     */
    private async load() {
        this.loadConfig();

        await this.loadPlugin();

        const reservedDir = ['aspect', 'plugins'];

        ResourceLoader.loadResourceDir(this.options.ROOT, reservedDir);
    }

    /**
     * Load configuration from config directory
     */
    loadConfig() {
        ConfigLoader.loadConfigDir(this.options.configPath);
        Object.freeze(ConfigLoader.config);
        this.config = ConfigLoader.config;
    }

    /**
     * Load plugins
     */
    async loadPlugin() {
        await PluginLoader.loadDir(this.options.ROOT);
    }

    /**
     * Use Koa middleware
     * @param mw Koa middleware
     */
    use(mw: Koa.Middleware<any, IContext>) {
        this.app.use(mw);
    }

    /**
     * Get app context
     */
    get context(): IContext {
        return this.app.context;
    }

    /**
     * Start the HTTP server
     * @param port Port number to listen on (default: 8058)
     * @param callback Optional callback function to run after server starts
     */
    async start(port: number = 8058, callback?: (...args: any[]) => any) {
        try {
            if (!this.port) this.port = port;
            if (callback) this.callback = callback;
            const { app, options: { createServer } } = this;
            const koaCallback = app.callback();

            await this.prepare();
            this.server = createServer ? createServer(koaCallback) : http.createServer(koaCallback);

            this.server.listen(this.port, async () => {
                this.logger.info(`Uma server running at port: ${this.port} `);
                this.logger.info(`Uma version: ${packageInfo.version}`);

                if (typeof this.callback === 'function') {
                    await Promise.resolve(Reflect.apply(this.callback, this, []));
                }
            });
        } catch (e) {
            if (e instanceof UmaError) {
                this.logger.error(`[UmaError]: ${e.message}`);
            } else {
                this.logger.error(e);
            }

            process.exit(1);
        }
    }

    /**
     * Prepare the application
     * - Mixin core extensions (Request, Response, Context)
     * - Run beforeLoad hooks
     * - Configure body parser
     * - Load resources
     * - Mount router
     * - Run afterLoaded hooks
     */
    async prepare() {
        const { app, options: { Router, beforeLoad, afterLoaded } } = this;

        // Mixin extensions to Koa prototypes
        mixin(false, app.request, Request);
        mixin(false, app.response, Response);
        mixin(false, app.context, Context);

        if (typeHelper.isFunction(beforeLoad)) await Promise.resolve(Reflect.apply(beforeLoad, this, [this]));

        // Configure koa-body middleware
        if (this.options.bodyParser) {
            this.app.use((ctx, next) => {
                if (['POST', 'PUT', 'PATCH'].indexOf(ctx.method) > -1) {
                    const bodyParserOpts = mixin(false, { multipart: true }, this.options.bodyParser);

                    return Reflect.apply(koaBody(bodyParserOpts), null, [ctx, next]);
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

    /**
     * Get list of enabled plugin names
     * Filters out disabled plugins from configuration
     */
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

    /**
     * Get options for a specific plugin
     * @param pluginName Name of the plugin
     * @returns Plugin configuration object
     */
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
    static get controllersInfo(): TControllerInfo[] {
        return controllerInfo.getControllersInfo();
    }

    static get logger(): ILogger {
        return Uma.instance().logger;
    }

    /**
     * Get or create the singleton Uma instance
     * @param options Configuration options (required for the first call)
     * @returns The Uma instance
     */
    static instance(options?: TUmaOption): Uma {
        if (instance) return instance;

        if (!options) {
            throw new Error('Uma.instance(options) requires options to be passed for the first call.');
        }

        instance = new Uma(options);

        return instance;
    }

    /**
     * Create a Koa middleware for integrating Uma into an existing Koa app
     * This allows Uma to be used as a sub-app or middleware within another Koa application.
     *
     * (async () => {
     *     const app = new Koa();
     *     app.use(await Uma.middleware({...}, app));
     * })();
     * @param options Uma options
     * @param app Koa instance
     * @returns Koa middleware function
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
     * Create a request handler callback (useful for Serverless or Express integration)
     * This method initializes Uma and returns a callback function compatible with http.createServer
     * or other frameworks like Express.
     *
     * (async () => {
     *    const app = express();
     *    const callback = <any> await Uma.callback(options);
     *    app.use((req, res, next) => callback(req, res).then(() => {
     *          if (res.headersSent) return;
     *          next();
     *      }));
     * })()
     * @param options Uma options
     * @param app Optional Koa instance
     * @returns Request handler callback
     */
    static async callback(options: TUmaOption, app?: Koa) {
        if (instance) throw new Error('Uma can only be instantiated once, const koaCallback = Uma.callback({...})');

        instance = new Uma(options, <Koa<Koa.DefaultState, IContext>>app);
        await instance.prepare();

        return instance.app.callback();
    }
}
