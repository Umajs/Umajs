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
    isRequire?:IBaseCheck,
    notEmpty?:IBaseCheck,
    isString?:IBaseCheck,
    isArray?:IBaseCheck,
    isBoolean?:IBaseCheck,
    isNumber?:IBaseCheck,
    toNumber?:IBaseCheck,
    toBoolean?:IBaseCheck,
    toArray?:IBaseCheck,
    stringify?:IBaseCheck,
    split?:IBaseCheck,
    stringToJSON?:IBaseCheck,
    equals?:IEqualsCheck
}

export interface TbodyDecorator extends IBody, IBaseDecorator {}
