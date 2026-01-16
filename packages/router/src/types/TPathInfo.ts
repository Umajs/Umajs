import * as pathToRegexp from 'path-to-regexp';

export type TPathInfo = {
    // File name
    name?: string,

    // Method name
    methodName?: string,

    // class object
    clazz?: Function,

    // params matched by methodPath
    keys?: pathToRegexp.Key[];

    routePath?: string;

    methodTypes?: string[];
};
