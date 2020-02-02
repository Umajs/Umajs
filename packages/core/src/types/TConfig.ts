import { TPluginConfig } from './TPluginConfig';

export type TConfig = {
    plugin?: { [pluginName: string]: boolean | TPluginConfig };
    [key: string]: any;
}
