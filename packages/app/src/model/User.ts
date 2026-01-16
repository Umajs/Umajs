import { Resource } from '@umajs/core';

@Resource('Uma', 18)
export default class User {
    constructor(
        readonly name: string,
        readonly age: number,
    ) {}

    getAge() {
        return this.age;
    }
}
