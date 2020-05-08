
import {aseEncode, aseDecode} from '../src/utils';

describe('wf-session utils test', () => {
    it('aseEncode and aseDecode test', () => {
        let testObj = {a: 1, b: 2};
        let scret:string = 'wf:sess';
        expect(JSON.stringify(aseDecode(aseEncode(testObj, scret), scret))).toBe(JSON.stringify(testObj))
    })
})
