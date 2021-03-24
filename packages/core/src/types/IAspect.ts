import Result from '../core/Result';

import { IJoinPoint, IProceedJoinPoint } from './IJoinPoint';

export interface IAspect {
    /** @deprecated */
    before?(point: IJoinPoint): void;
    /** @deprecated */
    after?(point: IJoinPoint): void;
    around?(proceedPoint: IProceedJoinPoint): Promise<Result>;
    /** @deprecated */
    afterReturning?(point: IJoinPoint, val: any): void;
    /** @deprecated */
    afterThrowing?(err: Error): void;
}
