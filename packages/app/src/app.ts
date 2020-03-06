import Ursa from '@ursa/core';
import { Router } from '@ursa/router';

const ursa = Ursa.instance({
    Router,
    ROOT: __dirname,
    env: process.argv.indexOf('production') > -1 ? 'production' : 'development',
});

ursa.start(8058);
