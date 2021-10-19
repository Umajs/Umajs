import typeHelper from '../utils/typeHelper';
import controllerInfo from '../info/controllerInfo';
import { RequestMethod } from '../types/RequestMethod';

export type TPathObjArgs = {
    value?: string | string[],
    method?: RequestMethod | RequestMethod[],
};

/**
 * 路由装饰器
 * 可以装饰 class，作为跟路由，只装饰 class 不生效，必须和 method 装饰配合使用
 * 可以装饰 method，没有跟路由的时候直接作为路由使用，有跟路由的时候和跟路由组合使用
 * @param args 路由参数
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

        const values = [];
        const methodTypes = [];

        // when @Path decorate method
        // if config is object, only receive one Object as a parameter
        if (typeHelper.isObject(arg0)) {
            if (args.length > 1) throw new Error('@Path only receive one Object as a parameter');

            const { value = '/', method = [] } = arg0;

            values.push(...(Array.isArray(value) ? value : [value]));
            methodTypes.push(...(Array.isArray(method) ? method : [method]));
        } else {
            (args.length > 0 ? args : ['/']).forEach((arg: any) => {
                if (typeHelper.isString(arg)) values.push(arg);
                else throw new Error(`@Path only receive one Object as a parameter, now is "${JSON.stringify(arg)}"`);
            });
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
