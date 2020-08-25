import Service from './service';

export default async (...props: string[]) => {
    const [action, ...actionProps] = props;

    Service[action](...actionProps);
};
