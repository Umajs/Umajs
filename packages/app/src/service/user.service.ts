import { Inject } from '@ursa/core';
import User from '../model/User';

export default class {

    @Inject('User')
    user: User;

    getDefaultUserAge() {
        return this.user.getAge();
    }
}