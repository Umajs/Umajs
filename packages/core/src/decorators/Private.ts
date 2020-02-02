import controllerInfo from '../info/controllerInfo';

/**
 * 将 method 声明不匹配默认路由
 */
export function Private(target: any, methodName: string) {
    if (!methodName) {
        throw new Error('@Private only can use in method');
    }

    controllerInfo.setControllersInfo(target.constructor, methodName, { inside: true });
}
