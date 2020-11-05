import * as flat from 'array.prototype.flat';

import typeHelper from '../utils/typeHelper';
import controllerInfo from '../info/controllerInfo';
import { TMethodDecoratorParams, TClassDecoratorParams } from '../types/TDecorator';
import { TPathObjArgs } from '../types/TPathArgs';

/**
 * 路由装饰器
 * 可以装饰 class，作为跟路由，只装饰 class 不生效，必须和 method 装饰配合使用
 * 可以装饰 method，没有跟路由的时候直接作为路由使用，有跟路由的时候和跟路由组合使用
 * @param args 路由参数
 * eg:
 * Path('/p1')
 * Path('/p1', 'p2')
 * Path({ value: '/p1' })
 * Path({ value: '/p1', method: RequestType.GET })
 * Path({ value: ['/p1', '/p2'], method: RequestType.GET })
 * Path({ value: ['/p1', '/p2'], method: [RequestType.GET, RequestType.POST] })
 */
export function Path(...args: [...string[]] | [TPathObjArgs]): Function {
    return function Method(...props: TMethodDecoratorParams | TClassDecoratorParams) {
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
            if (args.length > 1) {
                throw new Error('@Path only receive one Object as a parameter');
            }

            const { value = [], method = [] } = arg0;

            values.push(...flat([value]));
            methodTypes.push(...flat([method]));
        }

        // if config is string
        if (args.length > 1 || typeHelper.isString(arg0)) {
            values.push(...args);
        }

        const [target, methodName] = props;

        if (!typeHelper.isString(methodName)) return;

        values.forEach((p) => {
            if (!typeHelper.isString(p) || !p.startsWith('/')) throw new Error(`path must be string start with "/", now is "${p}"`);

            controllerInfo.setControllersInfo(target.constructor, methodName, { path: p, methodTypes });
        });
    };
}
