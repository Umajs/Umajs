import { aspectHelper } from '../utils/aspectHelper';
import { ENotice } from '../types/ENotice';

/**
 * @aspectHelper('aspect')
 * @param aspect 指定的切面或切面名称
 */
function Aspect(aspect: string | Function): Function {
    return aspectHelper(aspect, Object.values(ENotice));
}

/**
 * @Aspect.before('aspect')
 * @param aspect 指定的切面或切面名称
 */
Aspect.before = function before(aspect: string | Function): Function {
    return aspectHelper(aspect, [ENotice.before]);
};

/**
 * @Aspect.after('aspect')
 * @param aspect 指定的切面或切面名称
 */
Aspect.after = function after(aspect: string | Function): Function {
    return aspectHelper(aspect, [ENotice.after]);
};

/**
 * @Aspect.around('aspect')
 * @param aspect 指定的切面或切面名称
 */
Aspect.around = function around(aspect: string | Function): Function {
    return aspectHelper(aspect, [ENotice.around]);
};

/**
 * @Aspect.afterReturning('aspect')
 * @param aspect 指定的切面或切面名称
 */
Aspect.afterReturning = function afterReturning(aspect: string | Function): Function {
    return aspectHelper(aspect, [ENotice.afterReturning]);
};

/**
 * @Aspect.afterThrowing('aspect')
 * @param aspect 指定的切面或切面名称
 */
Aspect.afterThrowing = function afterThrowing(aspect: string | Function): Function {
    return aspectHelper(aspect, [ENotice.afterThrowing]);
};

export default Aspect;
