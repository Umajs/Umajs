import Require from '../utils/Require';

export default class LazyModules {
    static requireCatch(pName: string) {
        try {
            return Require.default(pName);
        } catch (err) { // eslint-disable-line @typescript-eslint/no-unused-vars
            throw new Error(`Before you use ${pName}, please run "npm i -S ${pName}"\n`);
        }
    }

    static get jsonpBody() {
        return LazyModules.requireCatch('jsonp-body');
    }

    static get send() {
        return LazyModules.requireCatch('koa-send');
    }
}
