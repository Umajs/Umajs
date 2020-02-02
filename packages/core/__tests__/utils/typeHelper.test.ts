import * as assert from 'assert';
import typeHelper from '../../src/utils/typeHelper';

describe('test/utils/typeHelper.test.ts', () => {
    describe('type(target: any): string', () => {
        it('variable type', () => {
            const typeList = {
                String: typeHelper.type('test'),
                Number: typeHelper.type(1),
                Array: typeHelper.type([1]),
                Object: typeHelper.type({}),
                Function: typeHelper.type(() => {}),
                Null: typeHelper.type(null),
                Undefined: typeHelper.type(undefined),
                Map: typeHelper.type(new Map()),
                Symbol: typeHelper.type(Symbol('a')),
            };

            for (let i in typeList) {
                assert(i === typeList[i]);
            }
        });
    });

    describe('undef(): undefined', () => {
        it('should return undefined', () => {
            const result = typeHelper.undef;

            assert(result === undefined);
        });
    });

    describe('isUndef(obj: any): boolean', () => {
        it('string is not undefined', () => {
            const result = typeHelper.isUndef('a');

            assert(result === false);
        });

        it('undefined is undefined', () => {
            const result = typeHelper.isUndef(typeHelper.undef);

            assert(result === true);
        });
    });

    describe('isString(target: any): boolean', () => {
        it('1 is not string => ', () => {
            const result = typeHelper.isString(1);

            assert(result === false);
        });

        it('a is string => ', () => {
            const result = typeHelper.isString('a');

            assert(result === true);
        });
    });

    describe('isObject(target: any): boolean', () => {
        it('a is not object => ', () => {
            const result = typeHelper.isObject(['a']);
            const isObj2 = typeHelper.isObject({});

            assert(result === false);
            assert(isObj2 === true);
        });

        it('{} is object => ', () => {
            const result = typeHelper.isObject({});

            assert(result === true);
        });
    });

    describe('isFunction(target: any): boolean', () => {
        it('[1] is not function', () => {
            const result = typeHelper.isFunction([1]);

            assert(result === false);
        });

        it('() => {} is function', () => {
            const result = typeHelper.isFunction(() => {});

            assert(result === true);
        });

        it('function () {} is function', () => {
            const result = typeHelper.isFunction(function () {});

            assert(result === true);
        });
    });

    describe('isBoolean(target: any): boolean', () => {
        it('null is not boolean', () => {
            const result = typeHelper.isBoolean(null);

            assert(result === false);
        });

        it('true is boolean', () => {
            const result = typeHelper.isBoolean(true);

            assert(result === true);
        });

        it('false is boolean', () => {
            const result = typeHelper.isBoolean(false);

            assert(result === true);
        });
    });

    describe('isArray(target: any): boolean', () => {
        it('{} is not array', () => {
            const result = typeHelper.isArray({});

            assert(result === false);
        });

        it('[] is array', () => {
            const result = typeHelper.isArray([]);

            assert(result === true);
        });

        it('new Array(1) is array', () => {
            const result = typeHelper.isArray(new Array(1));

            assert(result === true);
        });
    });
});
