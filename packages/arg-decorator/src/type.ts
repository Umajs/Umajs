import { IContext } from '@umajs/core';

export type IArgErrorTip = {
    key:string, // 修饰参数属性名称
    val?:string, // 参数入参值
    ctx?:IContext, // 上下文
    tip?:string, // 自定义提示内容
    [key:string]:any
}

export type IBaseDecorator = (key?: string|Array<string>|Function,) => ParameterDecorator;

export type IBaseCheck = (key: string|Array<string>|Function, tip?:string) => ParameterDecorator

export type IEqualsCheck = (key: string, comparison:string|number|any, tip?:string) => ParameterDecorator

interface IBody {
    Require?: IBaseCheck,
    isRequire?: IBaseCheck,
    isBoolean?: IBaseCheck,
    isNumber?: IBaseCheck,
    ToNumber?: IBaseCheck,
    ToBoolean?: IBaseCheck,
    ToArray?: (key: string | Function | string[], split?:string, tip?: string) => ParameterDecorator;
    ToDate?: (key: string | Function | string[], tip?: string) => ParameterDecorator;
}

export interface TbodyDecorator extends IBody, IBaseDecorator {
    Equals?: IEqualsCheck,
    DecimalMax?: (key: string | Function | string[], value: number, tip?: string) => ParameterDecorator;
    DecimalMin?: (key: string | Function | string[], value: number, tip?: string) => ParameterDecorator;
    Max?: (key: string | Function | string[], value: number, tip?: string) => ParameterDecorator;
    Min?: (key: string | Function | string[], value: number, tip?: string) => ParameterDecorator;
    Future?: (key: string | Function | string[], tip?: string) => ParameterDecorator;
    Past?: (key: string | Function | string[], tip?: string) => ParameterDecorator;
    Pattern?: (key: string | Function | string[], pattern: RegExp, tip?: string) => ParameterDecorator;
    Size?: (key: string | Function | string[], min: number, max: number, tip?: string) => ParameterDecorator;
    NotEmpty?: IBaseCheck,
    NotBlank?: (key: string | Function | string[], tip?: string) => ParameterDecorator;
    Email?: (key: string | Function | string[], tip?: string) => ParameterDecorator;
    Phone?: (key: string | Function | string[], tip?: string) => ParameterDecorator;
    AssertTrue?: (key: string | Function | string[], tip?: string) => ParameterDecorator;
    AssertFalse?: IBaseCheck;
}
