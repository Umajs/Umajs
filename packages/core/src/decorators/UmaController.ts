/*
 * @Author: zhang dajia
 * @Date: 2020-09-30 10:43:10
 * @Last Modified by: zhang dajia
 * @Last Modified time: 2020-09-30 16:53:05
 */
import { BaseController } from '../core/BaseController';
import controllerInfo from '../info/controllerInfo';

/**
 * @UmaController 修饰任意class为UmaController
 * @param clazz
 */
export function UmaController(clazz) {
    // 和标准目录不同，默认路由时路由根目录匹配的是当前class类的名称  ？待讨论框架是否统一  fileName or  className
    const { name } = clazz;

    if (clazz && clazz.prototype && clazz.prototype instanceof BaseController) {
        controllerInfo.setControllersInfo(clazz, null, { clazzName: name });
    }
}
