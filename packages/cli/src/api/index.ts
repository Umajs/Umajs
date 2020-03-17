import { xhr } from '../utils/utils';
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
    const data = await xhr('GET', 'https://api.github.com/repos/Ursajs/ursa-templates/commits?sha=master');

    return data;
};
