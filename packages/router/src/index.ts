import * as pathToRegexp from 'path-to-regexp';
import Ursa, { TMethodInfo } from '@ursajs/core';

import { TPathInfo } from './types/TPathInfo';
import router, { StaticRouterMap, RegexpRouterMap, ClazzMap } from './router';

export const Router = () => {
    console.log('======Init router S======');

    const ALLROUTE: string[] = [];

    // delete cache for reload
    RegexpRouterMap.clear();
    StaticRouterMap.clear();

    // go through contollerInfo，and init each router map
    for (const c of Ursa.controllersInfo) {
        const { name: clazzName, path: rootPath = '', clazz } = c;
        const methodMap: Map<string, TMethodInfo> = c.methodMap || new Map();

        const decoratorMethodNameArr: string[] = [...methodMap.values()].map(m => m.name);
        const methodNameArr: (string | number | symbol)[] = Reflect.ownKeys(clazz.prototype)
            .filter(name => name !== 'constructor' && !decoratorMethodNameArr.includes(String(name)));

        methodNameArr.forEach((methodName) => {
            ALLROUTE.push(`/${clazzName}/${String(methodName)}`);
        });

        // 主要是对被@Path修饰过的路由进行处理
        for (const m of methodMap.values()) {
            const { name: methodName = '', path: methodPath = [] } = m;
            const pathInfo: TPathInfo = { methodName, ...c };

            methodPath.forEach((p) => {
                // 路由访问地址为class中的Path修饰地址 + method的Path修饰地址
                const routePath = rootPath + p;

                console.log(`${routePath} ==> ${clazzName}.${methodName}`);
                ALLROUTE.push(routePath);

                // 如果method设置的Path中有:/(被认定为正则匹配路由，否则为静态路由
                if (p.indexOf(':') > -1 || p.indexOf('(') > -1) {
                    const keys: pathToRegexp.Key[] = [];
                    const pathReg = pathToRegexp(routePath, keys);

                    RegexpRouterMap.set(pathReg, { ...pathInfo, keys, routePath });
                } else {
                    StaticRouterMap.set(routePath, pathInfo);
                }
            });
        }

        // 保存所有的clazz信息到ClazzMap中
        ClazzMap.set(clazzName, c);
    }

    console.log('======Init router E======');

    const ursa = Ursa.instance();

    if (ursa && ursa instanceof Ursa) {
        ursa.routers = ALLROUTE;
    }

    return router;
};
