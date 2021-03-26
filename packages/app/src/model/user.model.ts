import { Type, Required, Min } from '@umajs/model/app';
import Model from '@umajs/model/app/Model';

export default class UserInfo extends Model {
    constructor({ id, name, age }: UserInfo, isValid: boolean) {
        super(isValid);
        this.id = id;
        this.name = name;
        this.age = age;
    }

    @Type('number')
    id: number = 123;

    @Required()
    name?: string;

    @Min(0)
    age?: number;
}