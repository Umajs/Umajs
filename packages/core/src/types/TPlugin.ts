import { IContext } from './IContext';
import { RequestMethod } from './RequestMethod';

export type TPlugin = {
    use?: {
        handler: (ctx: IContext, next?: Function, options?: any) => any;
    }
    filter?: {
        regexp: RegExp;
        handler: (ctx: IContext, next?: Function, options?: any) => any;
    };
    ignore?: {
        regexp: RegExp;
        handler: (ctx: IContext, next?: Function, options?: any) => any;
    };
    method?: {
        type: RequestMethod | RequestMethod[];
        handler: (ctx: IContext, next?: Function, options?: any) => any;
    };
    results?: { [key: string]: any };
    context?: { [key: string]: any };
    request?: { [key: string]: any };
    response?: { [key: string]: any };
}
