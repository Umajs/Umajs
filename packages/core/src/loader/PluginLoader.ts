import * as fs from 'fs';
import * as path from 'path';
import * as compose from 'koa-compose';

import Uma from '../core/Uma';
import mixin from '../utils/mixin';
import typeHelper from '../utils/typeHelper';
import Require from '../utils/Require';

import { TPluginConfig } from '../types/TConfig';
import { TPlugin } from '../types/TPlugin';
import { IContext } from '../types/IContext';
import { Results } from '../extends/Results';

export default class PluginLoader {
    static loadPluginConfig() {
        if (!Uma.config.plugin) return;

        const pluginConfig: { [pluginName: string]: TPluginConfig } = {};

        for (const [name, config] of Object.entries(Uma.config.plugin)) {
            if (typeHelper.isBoolean(config)) {
                pluginConfig[name] = {
                    name,
                    enable: config,
                };
            } else {
                pluginConfig[name] = config;
            }
        }

        return pluginConfig;
    }

    static complexPlugin(plugin: TPlugin, options: any) {
        const uma = Uma.instance();
        const mws = [];

        // Load in the order of configuration
        // for (const [key, val] of Object.entries(plugin)) {
        for (const key of Object.keys(plugin)) {
            const val = plugin[key];

            if (key === 'request') {
                mixin(false, uma.app.request, val);
            } else if (key === 'response') {
                mixin(false, uma.app.response, val);
            } else if (key === 'context') {
                mixin(false, uma.context, val);
            } else if (key === 'results') {
                mixin(false, Results, val);
            } else if (key === 'use') {
                const { handler } = val;

                mws.push((ctx: IContext, next: Function) => handler(ctx, next, options));
            } else if (key === 'filter') {
                const { regexp = /.*/, handler } = val;

                mws.push((ctx: IContext, next: Function) => (regexp.test(ctx.url) ? handler(ctx, next, options) : next()));
            } else if (key === 'ignore') {
                const { regexp = /.*/, handler } = val;

                mws.push((ctx: IContext, next: Function) => (!regexp.test(ctx.url) ? handler(ctx, next, options) : next()));
            } else if (key === 'method') {
                const { type, handler } = val;

                mws.push((ctx: IContext, next: Function) => (type.indexOf(ctx.method) > -1 ? handler(ctx, next, options) : next()));
            }
        }

        if (mws.length > 0) uma.use(compose(mws));
    }

    static async loadPlugin(pluginConfig: TPluginConfig) {
        const uma = Uma.instance();
        const plugin: TPlugin | Function = Require.default(pluginConfig.path);
        const options = mixin(true, {}, pluginConfig.options || {}, Uma.config[pluginConfig.name] || {});

        // plugin.options & {plugin}.config
        pluginConfig.options = options;

        if (typeHelper.isFunction(plugin)) {
            const pluginResult = await Promise.resolve(plugin(uma, options));

            if (typeHelper.isFunction(pluginResult)) uma.use(pluginResult);
            else if (typeHelper.isObject(pluginResult)) PluginLoader.complexPlugin(pluginResult, options);
        } else {
            console.error(`[Plugin] ${pluginConfig.name} type error, it must be function like function(uma, options) {}.`);
        }
    }

    static async loadDir(rootPath: string) {
        const uma = Uma.instance();
        const pluginConfig = PluginLoader.loadPluginConfig();

        if (!pluginConfig) return;

        // Try to find matching plugins in the following directories
        //  -> {ROOT}/plugins
        //      -> {ROOT}/node_modules
        const dirs = [
            path.resolve(rootPath, './plugins'),
            path.resolve(rootPath, '../node_modules'),
            path.resolve(process.cwd(), './node_modules'),
        ];

        for (const [name, config] of Object.entries(pluginConfig)) {
            if (config.enable === false) continue;

            // Plugin type support
            const { type, handler } = config;

            if (type === 'middleware') {
                if (typeHelper.isFunction(handler)) {
                    uma.use(handler);
                } else {
                    console.error(new Error(`Plugin "${name}" config error, "middleware" must have "handler: Koa.Middleware". now is ${JSON.stringify(config)}`));
                }

                continue;
            }

            const packageName = config.packageName || `@umajs/plugin-${name}`;
            let isDirExist = false;

            for (const dir of dirs) {
                // If path is configured, check if the file exists, if not, remove it
                if (config.path) {
                    if (!fs.existsSync(config.path)) config.path = null;
                }

                // If path does not exist, generate path from name and packageName rules, check if file exists, if so, assign it
                if (!config.path) {
                    const target = path.join(dir, dir.indexOf('node_modules') > -1 ? packageName : name);

                    config.path = fs.existsSync(target) ? target : null;
                }

                // If path exists, load the plugin
                if (config.path) {
                    await PluginLoader.loadPlugin(config);
                    isDirExist = true;
                    break;
                }
            }

            if (!isDirExist) {
                throw new Error(`plugin ${name} not found`);
            }
        }
    }
}
