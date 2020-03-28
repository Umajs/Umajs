import Require from '../utils/Require';

export default class LazyModules {
    static requireCatch(pName: string) {
        try {
            return Require.default(pName);
        } catch (err) {
            throw new Error(`Before you use jsonp, please run "npm i -S ${pName}"\n`);
        }
    }

    static get jsonpBody() {
        return LazyModules.requireCatch('jsonp-body');
    }

    static get send() {
        return LazyModules.requireCatch('koa-send');
    }
}
