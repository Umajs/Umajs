/*
 * @Author: zhang dajia
 * @Date: 2020-09-30 10:43:10
 * @Last Modified by: zhang dajia
 * @Last Modified time: 2020-09-30 16:52:53
 */
import { BaseService } from '../core/BaseService';
import { ServiceMap } from '../loader/ServiceLoader';

/**
 * @UmaService 修饰任意class为UmaService
 * @param clazz
 */
export function UmaService(clazz) {
    const { name } = clazz;

    if (clazz && clazz.prototype && clazz.prototype instanceof BaseService) {
        ServiceMap.set(name, clazz); // 和标准目录service不同 被@service修饰时，传递的参数为class类名称
    }
}
