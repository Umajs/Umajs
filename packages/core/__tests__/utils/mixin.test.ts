import * as assert from 'assert';
import mixin from '../../src/utils/mixin';

describe('test/utils/mixin.test.ts', () => {
    describe('mixin(deep: boolean = false, target: any, ...sources: any[])', () => {
        it('target is not object, return target', () => {
            const result = mixin(false, 1);

            assert(result === 1);
        });

        it('not deep mixin', () => {
            const target = {
                one: 't1',
                two: {
                    one: {
                        one: 't1-2-1-1',
                        two: 't1-2-1-2',
                    },
                },
            };
            const source = {
                one: 's1-1',
                two: {
                    one: {
                        one: 's1-2-1-1',
                    },
                },
            };

            mixin(false,  target, source);

            assert(target.one === 's1-1');
            assert(target.two.one.one === 's1-2-1-1');
            assert(target.two.one.two === undefined);

            source.two.one.one = 'aaa';
            assert(target.two.one.one === 'aaa');
        });

        it('deep mixin', () => {
            const target = {
                one: 't1',
                two: {
                    one: {
                        one: 't1-2-1-1',
                        two: 't1-2-1-2',
                    },
                },
            };
            const source = {
                one: 's1-1',
                two: {
                    one: {
                        one: 's1-2-1-1',
                    },
                },
            };

            mixin(true,  target, source);

            assert(target.one === 's1-1');
            assert(target.two.one.one === 's1-2-1-1');
            assert(target.two.one.two === 't1-2-1-2');

            source.two.one.one = 'aaa';
            assert(target.two.one.one === 's1-2-1-1');
        });

        it('mixin get', () => {
            const target = {
                one: 'one',
            };
            const source = {
                get one() {
                    return 'aaa';
                },
            };

            mixin(true, target, source);

            assert(target.one === 'aaa');
        });

        it('mixin set', () => {
            const target = {
                one: 'one',
                two: '',
            };
            const source = {
                set one(val: string) {
                    this.two = val + 'hhh';
                },
            };

            mixin(true, target, source);

            target.one = 'test';

            assert(target.two === 'testhhh');
        });
    });
});
