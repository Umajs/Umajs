import { IContext } from './IContext';

export type TPluginConfig = {
    enable?: boolean;
    name?: string;
    packageName?: string;
    path?: string;
    type?: 'middleware';
    handler?: (ctx: IContext, next: Function) => void;
    options?: {
        [key: string]: any,
    };
}
