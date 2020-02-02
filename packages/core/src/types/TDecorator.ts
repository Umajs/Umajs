
export type TClassDecorator = <T extends Function>(target: T) => T | void;

export type TClassDecoratorParams = Parameters<TClassDecorator>;

export type TPropertyDecorator = (target: any, propertyKey: string) => any;

export type TPropertyDecoratorParams = Parameters<TPropertyDecorator>;

export type TMethodDecorator = (target: any, methodName: string, desc: PropertyDescriptor) => any;

export type TMethodDecoratorParams = Parameters<TMethodDecorator>;

export type TParameterDecorator = (target: any, parameterKey: string, parameterIndex: number) => void;

export type TParameterDecoratorParams = Parameters<TParameterDecorator>;
