import { IContext } from './IContext';
import { RequestMethod } from './RequestMethod';

export type TPlugin = {
    use?: {
        handler: (ctx: IContext, next: Function) => any;
    }
    filter?: {
        regexp: RegExp;
        handler: (ctx: IContext, next: Function) => any;
    };
    ignore?: {
        regexp: RegExp;
        handler: (ctx: IContext, next: Function) => any;
    };
    method?: {
        type: RequestMethod | RequestMethod[];
        handler: (ctx: IContext, next: Function) => any;
    };
    results?: { [key: string]: any };
    context?: { [key: string]: any };
    request?: { [key: string]: any };
    response?: { [key: string]: any };
}
