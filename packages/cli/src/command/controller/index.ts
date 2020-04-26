import Controller from './controller';

export default async (...props: string[]) => {
    const [action, ...actionProps] = props;

    Controller[action](...actionProps);
};
