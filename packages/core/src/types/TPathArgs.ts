import { RequestMethod } from './RequestMethod';

export type TPathObjArgs = {
    value?: string | string[],
    method?: RequestMethod | RequestMethod[],
};
