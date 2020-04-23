import Plugin from './plugin';

export default async (...props: string[]) => {
    const [action, ...actionProps] = props;

    await Promise.resolve(Plugin[action](...actionProps));
};
