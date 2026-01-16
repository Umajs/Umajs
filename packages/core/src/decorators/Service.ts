import { BaseController } from '../core/BaseController';
import { BaseService } from '../core/BaseService';
import typeHelper from '../utils/typeHelper';

/**
 * Inject service
 * @param serviceName file name
 */
export function Service<T extends typeof BaseService>(service: T): Function {
    return function s(target: T, property: string, desc: PropertyDescriptor): any {
        if (!(target instanceof BaseController) || !typeHelper.isUndef(desc)) {
            throw new Error(`Please check @Service(${service.name})/${property} used on Controller's property, and Controller extends BaseController.`);
        }

        return {
            get() {
                // @ts-ignore
                return Reflect.construct(service, [this.ctx]);
            },
        };
    };
}
