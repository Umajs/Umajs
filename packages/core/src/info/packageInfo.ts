/* eslint-disable global-require */
type TPackageInfo = {
    version: string
}

export const packageInfo: TPackageInfo = require('../../package.json');
