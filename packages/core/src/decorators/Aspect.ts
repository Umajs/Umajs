import { aspect } from '../utils/aspect';
import { ENotice } from '../types/ENotice';
import { TMethodDecorator } from '../types/TDecorator';

/**
 * @Aspect('aspectName')
 * @param aspectName 指定的切面名称
 */
function Aspect(aspectName: string): TMethodDecorator {
    return aspect(aspectName, Object.values(ENotice));
}

/**
 * @Aspect.before('aspectName')
 * @param aspectName 指定的切面名称
 */
Aspect.before = function before(aspectName: string): TMethodDecorator {
    return aspect(aspectName, [ENotice.before]);
};

/**
 * @Aspect.after('aspectName')
 * @param aspectName 指定的切面名称
 */
Aspect.after = function after(aspectName: string): TMethodDecorator {
    return aspect(aspectName, [ENotice.after]);
};

/**
 * @Aspect.around('aspectName')
 * @param aspectName 指定的切面名称
 */
Aspect.around = function around(aspectName: string): TMethodDecorator {
    return aspect(aspectName, [ENotice.around]);
};

/**
 * @Aspect.afterReturning('aspectName')
 * @param aspectName 指定的切面名称
 */
Aspect.afterReturning = function afterReturning(aspectName: string): TMethodDecorator {
    return aspect(aspectName, [ENotice.afterReturning]);
};

/**
 * @Aspect.afterThrowing('aspectName')
 * @param aspectName 指定的切面名称
 */
Aspect.afterThrowing = function afterThrowing(aspectName: string): TMethodDecorator {
    return aspect(aspectName, [ENotice.afterThrowing]);
};

export default Aspect;
