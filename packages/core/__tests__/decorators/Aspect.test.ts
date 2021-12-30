import { Around } from '../../src/decorators/Aspect'

const DecoratorA = () => Around(({ proceed, args }) => {
    const result: number = proceed(...args);

    return result + 1;
});

const DecoratorB = () => Around(async ({ proceed, args }) => {
    const result: number = await proceed(...args);

    return result + 2;
});

@DecoratorA()
@DecoratorA()
class Test {
    a() {
        return 1;
    }

    @DecoratorA()
    b() {
        return 2;
    }
}

@DecoratorB()
@DecoratorB()
class TestB {
    c() {
        return 1;
    }

    @DecoratorB()
    d() {
        return 2;
    }
}


describe('test/decorator/Aspect.ts', () => {
    describe('around test', () => {
        const test = new Test();

        it ('around test a', () => {
            expect(test.a()).toEqual(3);
        });

        it ('around test b', () => {
            expect(test.b()).toEqual(5);
        });
    });

    describe('around async test', () => {
        const testB = new TestB();

        it ('around async test c', async () => {
            const c = await testB.c();

            expect(c).toEqual(5);
        });

        it ('around async test d', async () => {
            const d = await testB.d();

            expect(d).toEqual(8);
        });
    });
});
