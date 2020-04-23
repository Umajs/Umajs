import * as git from 'simple-git/promise';

import { xhr } from '../utils/utils';
import { rm } from '../utils/file';
import { readInfo, writeInfo } from '../utils/writeReadFile';
import { DOWNLOAD_DIR } from '../const/constants';


// https://api.github.com/users/woshi555bin/repos
// http://igit.58corp.com/api/v4/groups/35259/subgroups?private_token=CdURRbijRNsNzNmpuh9H
// 获取项目列表
export const fetchRepoList = async () => {
    const data = await xhr('GET', 'https://api.github.com/repos/Ursajs/ursa-templates/contents');

    return data;
};

// 抓取tag列表
export const fechTagList = async (repo:string) => {
    const data = await xhr('GET', `https://api.github.com/repos/woshi555bin/${repo}/tags`);

    return data;
};

// 获取git HEAD
export const fechRepoCommits = async () => {
    try {
        return await xhr('GET', 'https://api.github.com/repos/Ursajs/ursa-templates/commits?sha=master');
    } catch (err) {
        return null;
    }
};

export const download = async (tag?: string) => {
    const api = `https://github.com/Ursajs/ursa-templates${tag ? `#${tag}` : ''}`;

    // /Users/xxx/.ursa-templates/ursa
    const { commitSha: localSha } = readInfo();

    // 获取版本信息 若为最新版本则重新下载，若不是则直接拉取本地
    const gitCommits: any = await fechRepoCommits();

    if (!gitCommits) {
        if (localSha) {
            return console.log('load template wrong, will use local template.');
        }

        throw new Error('load template wrong, please check network.');
    }

    const { sha: onlineSha } = JSON.parse(gitCommits)[0];

    if (onlineSha !== localSha) {
        rm(DOWNLOAD_DIR);
        await git().silent(true).clone(api, DOWNLOAD_DIR);
        writeInfo({ commitSha: onlineSha });
    }
};
