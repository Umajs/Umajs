export interface IJoinPoint<T = any> {
    target: T;
    args: Array<any>;
}

export interface IProceedJoinPoint<T = any> extends IJoinPoint<T> {
    proceed(...props: any[]): Promise<any>;
}
