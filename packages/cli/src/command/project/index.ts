
import * as inquirer from 'inquirer';
import { promisify } from 'util';
import * as path from 'path';
import * as MetalSmith from 'MetalSmith'; // 遍历文件夹 找需不需要渲染
import * as git from 'simple-git/promise';
import { delPath } from '../../utils/delPath';
import packageConfig from '../../utils/packageConfig';
import { fetchRepoList } from '../../api';
import { waitFnloading } from '../../utils/utils';
import { downloadDirectory } from '../../utils/constants';

let { render } = require('consolidate').ejs;
// 所有的模版引擎,返回的都是渲染函数

render = promisify(render);

const download = async (repo: string, tag: string) => {
    let api = 'https://github.com/Ursajs/ursa-templates';

    if (tag) {
        api += `#${tag}`;
    }

    // /user/xxxx/.template/repo
    const dest = `${downloadDirectory}/${repo}`;
    // 获取版本信息
    // const gitCommits = await fechRepoCommits();
    // const commitSha = gitCommits[0].sha;

    // console.log(commitSha);
    delPath(dest);
    await git().silent(true).clone(api, dest);

    return dest; // 下载的最终目录
};

interface repoItem {
    id: number,
    name: string,
    private: boolean
    [propName: string]: any;
}
export default async (projectName: string) => {
    // 1) 获取项目的模板 （所有的）
    let repos = await waitFnloading(fetchRepoList, 'fetching template ....')();

    repos = JSON.parse(repos).map((item:repoItem) => item.name);
    // 选择模板 inquirer
    const { repo } = await inquirer.prompt({
        name: 'repo', // 获取选择后的结果
        type: 'list',
        message: 'please choise a template to create project',
        choices: repos, // 选择
    });


    // // 通过当前选择的项目 拉取对应的版本
    // let tags = await waitFnloading(fechTagList, 'fetching tags ....')(repo);
    // console.log(tags);
    // tags = tags.map((item) => item.name);
    // const { tag } = await Inquirer.prompt({
    //   name: 'tag', // 获取选择后的结果
    //   type: 'list',
    //   message: 'please choise tags to create project',
    //   choices: tags,
    // });

    // 把模板放到一个临时目录里 存好，以备后期使用 download-git-repo
    const result = await waitFnloading(download, 'download template')(repo);
    const newResult = path.join(result, repo);
    // 需要配置的模版,让用户填写信息

    await new Promise((resolve, reject) => {
        MetalSmith(__dirname) // 传入路径 他默认会遍历当前路径下的src文件夹
            .source(newResult)
            .destination(path.resolve(projectName))
            .use(async (files: { [x: string]: any; }, metal: { metadata: () => void; }, done: () => void) => {
                const obj = await inquirer.prompt(packageConfig); // 弹出消息
                const meta = metal.metadata();

                Object.assign(meta, obj);
                // delete files['config.js'];
                done();
            })
            .use((files: object, metal: { metadata: () => void; }, done: (err: Error, files: MetalSmith.Files, metalsmith: MetalSmith) => void) => {
                const obj = metal.metadata();

                Reflect.ownKeys(files).forEach(async (file: string) => {
                    // 这个是要处理的  <%
                    if (file.includes('js') || file.includes('json')) {
                        let content = files[file].contents.toString(); // 文件的内容

                        if (content.includes('<%')) {
                            content = await render(content, obj);
                            files[file].contents = Buffer.from(content); // 渲染
                        }
                    }
                });
                // 根据用户的输入 下载模板
                done(null, files, null);
            })
            .build((err: any) => {
                if (err) {
                    reject();
                } else {
                    resolve();
                }
            });
    });

    process.exit();
};
