import Result from '../core/Result';

import { IJoinPoint, IProceedJoinPoint } from './IJoinPoint';

export interface IAspect {
    before?(point: IJoinPoint): void;
    after?(point: IJoinPoint): void;
    around?(proceedPoint: IProceedJoinPoint): Promise<Result>;
    afterReturning?(point: IJoinPoint, val: any): void;
    afterThrowing?(err: Error): void;
}
