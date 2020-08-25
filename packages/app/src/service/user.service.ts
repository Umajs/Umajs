import { Inject, BaseService } from '@umajs/core';
import User from '../model/User';

export default class extends BaseService {

    @Inject(User) // or @Inject('User')
    user: User;

    getDefaultUserAge() {
        return this.user.getAge();
    }
}