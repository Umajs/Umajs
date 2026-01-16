import { TControllerInfo, TMethodInfo, TPath, THelper } from '../types/TControllerInfo';

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
         * Get fields that need to be set or updated
         * rootPath: controller visit path
         * methodTypes: controller method visit method type get|post...
         */
        const { rootPath, path, methodTypes = [], argProps, argIndex, argDecorator } = info;
        const methodMap: Map<string, TMethodInfo> = clazzInfo.methodMap || new Map();

        if (rootPath) clazzInfo.path = rootPath;

        if (methodName) {
            const methodInfo: TMethodInfo = methodMap.get(methodName) || {
                args: [],
                paths: [],
            };

            methodInfo.name = methodName;

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
        }

        clazzInfo.methodMap = methodMap;
        // update controller info
        ControllerMap.set(clazz, { clazz, ...clazzInfo });
    }

    static getControllersInfo(): IterableIterator<TControllerInfo> {
        return ControllerMap.values();
    }

    static get(clazz: Function) {
        return ControllerMap.get(clazz);
    }

    static isAspectMethod(clazz: Function, method: string) {
        const info: TControllerInfo = ControllerMap.get(clazz);

        if (!info) return true;

        return info.methodMap.has(method);
    }
}
