import { TControllerInfo, TMethodInfo, TPath } from '../types/TControllerInfo';
import { THelper } from '../types/THelper';

const ControllerMap: Map<Function, TControllerInfo> = new Map();

export default class {
    /**
     * set controller info
     * @param clazzName controller name
     * @param methodName controller method name
     * @param info controller info
     */
    static setControllersInfo(clazz: Function, methodName: string, info: THelper = {}) {
        const clazzInfo: TControllerInfo = ControllerMap.get(clazz) || {};

        /**
         * 获取需要设置或更新的字段
         * clazzName: controller name
         * rootpath: controller visit path
         * mpath: controller method visit path
         * methodType: controller method visit method type get|post...
         * inside: controller method is private
         */
        const { clazzName, rootPath, path, methodTypes = [], inside, argProps, argIndex, argDecorator } = info;

        // De-weighting according to clazzName( for reload )
        if (clazzName) {
            // for (const [k, { name }] of ControllerMap) {
            //     if (name === clazzName) {
            //         ControllerMap.delete(k);
            //         console.log('hot reload', clazzName);
            //     }
            // }

            clazzInfo.name = clazzName;
        }

        if (rootPath) {
            clazzInfo.path = clazzInfo.path || [];
            clazzInfo.path.push(rootPath);
        }

        if (methodName) {
            const methodMap: Map<string, TMethodInfo> = clazzInfo.methodMap || new Map();
            const methodInfo: TMethodInfo = methodMap.get(methodName) || {
                args: [],
                paths: [],
            };

            methodInfo.name = methodName;

            methodInfo.inside = inside !== undefined ? inside : methodInfo.inside;

            if (path) {
                const pathObj: TPath = { path };

                if (methodTypes.length > 0) pathObj.methodTypes = methodTypes;

                methodInfo.paths.push(pathObj);
            }

            if (argDecorator) {
                methodInfo.args.push({
                    argDecorator,
                    argProps,
                    argIndex,
                });
            }

            methodMap.set(methodName, methodInfo);
            clazzInfo.methodMap = methodMap;
        }

        // update controller info
        ControllerMap.set(clazz, { clazz, ...clazzInfo });
    }

    static getControllersInfo(): IterableIterator<TControllerInfo> {
        return ControllerMap.values();
    }

    static get(clazz: Function) {
        return ControllerMap.get(clazz);
    }
}
