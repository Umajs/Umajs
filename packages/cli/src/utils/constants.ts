// 存放用户的所需要的常量
const { version } = require('../../package.json');
// 存储模板的位置
const downloadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.ursa-templates`;

export {
    version,
    downloadDirectory,
};
