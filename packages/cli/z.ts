import * as path from 'path';

import { cp } from './src/utils/file';


cp(path.resolve(__dirname, 'bin'), path.resolve(__dirname, 'bin1'), {
    callback(dest) {
        console.log(dest)
    }
});