import 'reflect-metadata';
import { TControllerInfo, TMethodInfo, TPath, THelper } from '../types/TControllerInfo';

const METADATA_KEY = 'uma:controller';
// Internal registry to keep track of controller classes
const ControllerRegistry: Set<Function> = new Set();

export default class {
    /**
     * set controller info
     * @param clazzName controller name
     * @param methodName controller method name
     * @param info controller info
     */
    static setControllersInfo(clazz: Function, methodName: string, info: THelper = {}) {
        // Retrieve existing metadata or create new
        const clazzInfo: TControllerInfo = Reflect.getMetadata(METADATA_KEY, clazz) || { methodMap: new Map() };

        // Register class
        ControllerRegistry.add(clazz);

        /**
         * Get fields that need to be set or updated
         * rootPath: controller visit path
         * methodTypes: controller method visit method type get|post...
         */
        const { rootPath, path, methodTypes = [], argProps, argIndex, argDecorator } = info;
        const { methodMap } = clazzInfo;

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

        // update controller info metadata
        clazzInfo.clazz = clazz;
        Reflect.defineMetadata(METADATA_KEY, clazzInfo, clazz);
    }

    static getControllersInfo(): TControllerInfo[] {
        const controllersInfo: TControllerInfo[] = [];

        for (const clazz of ControllerRegistry) {
            const info: TControllerInfo = Reflect.getMetadata(METADATA_KEY, clazz);

            if (info) controllersInfo.push(info);
        }

        return controllersInfo;
    }

    static get(clazz: Function) {
        return Reflect.getMetadata(METADATA_KEY, clazz);
    }

    static isAspectMethod(clazz: Function, method: string): boolean {
        const info: TControllerInfo = Reflect.getMetadata(METADATA_KEY, clazz);

        if (!info) return false;

        return info.methodMap.has(method);
    }
}
