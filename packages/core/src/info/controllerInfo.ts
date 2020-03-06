import { TControllerInfo } from '../types/TControllerInfo';
import { TMethodInfo } from '../types/TMethodInfo';
import { IHelper } from '../types/IHelper';

const ControllerMap: Map<Function, TControllerInfo> = new Map();

/**
 * set controller info
 * @param clazzName controller name
 * @param methodName controller method name
 * @param info controller info
 */
function setControllersInfo(clazz: Function, methodName: string, info: IHelper = {}) {
    const clazzInfo: TControllerInfo = ControllerMap.get(clazz) || {};

    /**
     * 获取需要设置或更新的字段
     * clazzName: controller name
     * rootpath: controller visit path
     * mpath: controller method visit path
     * methodType: controller method visit method type get|post...
     * inside: controller method is private
     */
    const { clazzName, rootPath, mpath, methodType, inside, argKey, argIndex, argDecorator } = info;

    // De-weighting according to clazzName( for reload )
    if (clazzName) {
        for (const [k, { name }] of ControllerMap) {
            if (name === clazzName) {
                ControllerMap.delete(k);
                console.log('热更新更替旧的：', clazzName);
            }
        }

        clazzInfo.name = clazzName;
    }

    // if (clazzName) clazzInfo.name = clazzName;
    if (rootPath) clazzInfo.path = rootPath;

    if (methodName) {
        const { methodMap = new Map() } = clazzInfo;
        const methodInfo: TMethodInfo = methodMap.get(methodName) || {};

        const {
            path: methodPath = [],
            methodTypes = [],
            args = [],
        } = methodInfo;

        methodInfo.name = methodName;

        methodInfo.inside = inside !== undefined ? inside : methodInfo.inside;

        if (mpath) {
            methodPath.push(mpath);
            methodInfo.path = methodPath;
        }

        if (methodType) {
            methodTypes.push(methodType);
            methodInfo.methodTypes = methodTypes;
        }

        if (argDecorator) {
            args.push({
                argKey,
                argIndex,
                argDecorator,
            });
            methodInfo.args = args;
        }

        methodMap.set(methodName, methodInfo);
        clazzInfo.methodMap = methodMap;
    }

    // update controller info
    ControllerMap.set(clazz, { clazz, ...clazzInfo });
}

function getControllersInfo(): IterableIterator<TControllerInfo> {
    return ControllerMap.values();
}

export default {
    setControllersInfo,
    getControllersInfo,
};
