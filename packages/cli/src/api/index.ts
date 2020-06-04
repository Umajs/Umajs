import * as git from 'simple-git/promise';

import { xhr } from '../utils/utils';
import { rm } from '../utils/file';
import { readInfo, writeInfo } from '../utils/writeReadFile';
import { DOWNLOAD_DIR } from '../const/constants';


// 项目列表
// const GITHUB_CONTENTS = 'https://api.github.com/repos/Umajs/uma-templates/contents';
// 抓取列表
// const GITHUB_TAGS = 'https://api.github.com/repos/Umajs/uma-templates/tags';

// 获取最后一次提交信息
const GITHUB_COMMITS = 'https://api.github.com/repos/Umajs/uma-templates/commits?sha=master&per_page=1';
const GITEE_COMMITS = 'https://gitee.com/api/v5/repos/Umajs/uma-templates/commits?sha=master&per_page=1';

// GIT 地址
const GITHUB_REPO = 'https://github.com/Umajs/uma-templates';
const GITEE_REPO = 'https://github.com/Umajs/uma-templates';

const downloadFromGit = async (gitSource = 'github') => {
    // /Users/xxx/.uma-templates/uma
    const { commitSha: localSha } = readInfo();

    // 获取版本信息 若为最新版本则重新下载，若不是则直接拉取本地
    const gitCommits: any = await xhr('GET', gitSource === 'github' ? GITHUB_COMMITS : GITEE_COMMITS);

    if (!gitCommits) {
        if (localSha) {
            return console.log('load template wrong, will use local template.');
        }

        throw new Error('load template wrong, please check network.');
    }

    const { sha: onlineSha } = JSON.parse(gitCommits)[0];

    if (onlineSha !== localSha) {
        rm(DOWNLOAD_DIR);
        await git().silent(true).clone(gitSource === 'github' ? GITHUB_REPO : GITEE_REPO, DOWNLOAD_DIR);
        writeInfo({ commitSha: onlineSha });
    }
};

export const download = async () => {
    try {
        await downloadFromGit('gitee');
    } catch (err) {
        await downloadFromGit('github');
    }
};
