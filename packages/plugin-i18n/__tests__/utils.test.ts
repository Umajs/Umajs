'use strict';

import { requireDefault, template, formatLocale } from '../lib/utils';

describe('i18n utils tests', () => {
    it('requireDefault test', () => {

        const es6MD: string = requireDefault(__dirname + '/es6MD');
        const commonMD: string = requireDefault(__dirname + '/commonMD');
        
        expect(es6MD).toBe('It\'s es6 module');
        expect(commonMD).toBe('It\'s commonJS module');
    })

    it('template test', () => {
        const templates = {
            hi: template`Hi, ${'name'}`({name: 'john'}),
            date: template`Today is ${0} ${1}`('Sunday', '12:22AM'),
            welcome: template`${'name'}, welcome to ${'site'}, it's your ${0} time here`('second', {name: 'john', site: 'my home'}),
            arguments: template`${0} ${1} ${2} ${3} ${'name'}`('good', 'bye', {name: 'john'}),
            object: template`${'name'} ${'wf'}`({name: 'john'}),
        }

        expect(templates.hi).toBe('Hi, john');
        expect(templates.date).toBe('Today is Sunday 12:22AM');
        expect(templates.welcome).toBe('john, welcome to my home, it\'s your second time here');
        expect(templates.arguments).toBe('good bye   john');
        expect(templates.object).toBe('john ');
    })

    it('formatLocale test', () => {
        expect(formatLocale('ZH_CN')).toBe('zh-cn');
    })
})