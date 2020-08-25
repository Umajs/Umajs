import Plugin from './plugin';
import { actionHelp } from '../../utils/utils';

export default async (...props: string[]) => {
    const [action, ...actionProps] = props;

    if (!action) return actionHelp('plugin');

    await Promise.resolve(Plugin[action](...actionProps));
};
