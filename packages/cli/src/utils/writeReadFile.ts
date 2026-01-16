import * as fs from 'fs';

import { INFO_PATH, DESC_PATH } from '../const/constants';
import { TTemplateInfo } from '../types/TTempleInfo';

/**
 * Write information
 * @param params Parameter key-value pairs
 */
export const writeInfo = async (params: TTemplateInfo) => {
    const info = { ...readInfo(), ...params };

    fs.writeFileSync(INFO_PATH, JSON.stringify(info, null, 4));
};

/**
 * Read project information
 */
export const readInfo = (): TTemplateInfo => {
    if (!fs.existsSync(INFO_PATH)) return { commitSha: null };

    const resData = fs.readFileSync(INFO_PATH, 'utf8');

    return JSON.parse(resData);
};

/**
 * Read template information
 */
export const readDesc = (): TTemplateInfo => {
    if (!fs.existsSync(INFO_PATH)) throw new Error('template error...');

    const resData = fs.readFileSync(DESC_PATH, 'utf8');

    return JSON.parse(resData);
};
