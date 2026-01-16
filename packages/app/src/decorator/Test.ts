import { Around } from '@umajs/core';

export const DecoratorA = () => Around(async ({ proceed, args }) => {
    console.log('decorator a..1.');

    const result = await proceed(...args);

    console.log('decorator a..2.');

    return result;
});

export const AroundB = async ({ proceed, args }) => {
    console.log('decorator b..1.');

    const result = await proceed(...args);

    console.log('decorator b..2.');

    return result;
};

export const DecoratorB = () => Around(AroundB);
