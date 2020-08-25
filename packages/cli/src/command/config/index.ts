import Config from './config';

export default async (...props: string[]) => {
    const [action, ...actionProps] = props;

    Config[action](...actionProps);
};
