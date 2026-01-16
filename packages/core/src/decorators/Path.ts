import typeHelper from '../utils/typeHelper';
import controllerInfo from '../info/controllerInfo';
import { RequestMethod } from '../types/RequestMethod';

export type TPathObjArgs = {
    value?: string | string[],
    method?: RequestMethod | RequestMethod[],
};

/**
 * Route decorator
 * Can decorate class as root route. Decorating only class does not take effect, must be used with method decoration
 * Can decorate method. Used directly as route when no root route, or combined with root route when present
 * @param args route parameters
 * eg:
 * Path('/p1')
 * Path('/p1', 'p2')
 * Path({ value: '/p1' })
 * Path({ value: '/p1', method: RequestMethod.GET })
 * Path({ value: ['/p1', '/p2'], method: RequestMethod.GET })
 * Path({ value: ['/p1', '/p2'], method: [RequestMethod.GET, RequestMethod.POST] })
 */
export function Path(...args: string[]): Function;

export function Path(arg: { value?: string | string[]; method?: RequestMethod | RequestMethod[]; }): Function;

export function Path(...args: [...string[]] | [TPathObjArgs]): Function {
    return function Method(...props: Parameters<MethodDecorator | ClassDecorator>) {
        const [arg0] = args;

        // when @Path decorate class
        if (props.length === 1) {
            if (args.length > 1) {
                throw new Error('@Path only receivew one (string) parameter when decorate class');
            }

            if (!typeHelper.isString(arg0) || !arg0.startsWith('/')) {
                throw new Error(`path must be string start with "/", now is "${arg0}"`);
            }

            return controllerInfo.setControllersInfo(props[0], null, { rootPath: arg0 });
        }

        const values: string[] = [];
        const methodTypes: RequestMethod[] = [];

        // when @Path decorate method
        // if config is object, only receive one Object as a parameter
        if (typeHelper.isObject(arg0)) {
            if (args.length > 1) throw new Error('@Path only receive one Object as a parameter');

            const { value = '/', method = [] } = arg0;

            if (Array.isArray(value)) values.push(...value);
            else if (typeof value === 'string') values.push(value);

            if (Array.isArray(method)) methodTypes.push(...method);
            else methodTypes.push(method);
        } else {
            const paths = args.length > 0 ? args : ['/'];
            
            for (const arg of paths) {
                 if (typeHelper.isString(arg)) values.push(arg as string);
                 else throw new Error(`@Path only receive one Object as a parameter, now is "${JSON.stringify(arg)}"`);
            }
        }

        const [target, methodName] = props;

        if (!typeHelper.isString(methodName)) return;

        values.forEach((p) => {
            if (!typeHelper.isString(p) || !p.startsWith('/')) throw new Error(`Path must be string start with "/", now is "${p}"`);

            controllerInfo.setControllersInfo(target.constructor, methodName, { path: p, methodTypes });
        });
    };
}

export const Get = (...value: string[]) => Path({
    value,
    method: RequestMethod.GET,
});

export const Post = (...value: string[]) => Path({
    value,
    method: RequestMethod.POST,
});

export const Put = (...value: string[]) => Path({
    value,
    method: RequestMethod.PUT,
});

export const Del = (...value: string[]) => Path({
    value,
    method: RequestMethod.DELETE,
});
