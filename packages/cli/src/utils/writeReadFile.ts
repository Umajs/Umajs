import * as fs from 'fs';

import { INFO_PATH, DESC_PATH } from '../const/constants';
import { TTemplateInfo } from '../types/TTempleInfo';

/**
 * 写入信息
 * @param params 参数键值对
 */
export const writeInfo = async (params: TTemplateInfo) => {
    const info = { ...readInfo(), ...params };

    fs.writeFileSync(INFO_PATH, JSON.stringify(info, null, 4));
};

/**
 * 读取工程信息
 */
export const readInfo = (): TTemplateInfo => {
    if (!fs.existsSync(INFO_PATH)) return { commitSha: null };

    const resData = fs.readFileSync(INFO_PATH, 'utf8');

    return JSON.parse(resData);
};

/**
 * 读取模板信息
 */
export const readDesc = (): TTemplateInfo => {
    if (!fs.existsSync(INFO_PATH)) throw new Error('template error...');

    const resData = fs.readFileSync(DESC_PATH, 'utf8');

    return JSON.parse(resData);
};
