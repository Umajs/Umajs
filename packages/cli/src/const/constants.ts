import * as path from 'path';

import { TPackageInfo } from '../types/TPackageInfo';

/* eslint-disable global-require */
export const packageInfo: TPackageInfo = require('../../package.json');

// Template storage location
export const DOWNLOAD_DIR = path.resolve(`${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}`, '.uma-templates');

export const PLUGIN_PATH = path.resolve(DOWNLOAD_DIR, 'plugin');

// Plugin project path
export const PLUGIN_PROJECT_PATH = path.resolve(PLUGIN_PATH, 'project');

export const INFO_PATH = path.resolve(DOWNLOAD_DIR, 'info.json');

export const DESC_PATH = path.resolve(DOWNLOAD_DIR, 'desc.json');
