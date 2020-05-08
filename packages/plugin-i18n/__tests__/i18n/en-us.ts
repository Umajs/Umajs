export default function (template) {
    return {
        hi: 'nice to meet you!',
        empty: '',
        index: template`index ${0} ${1} ${2}`,
        index_back: template`index back ${2} ${1} ${0}`,
        var: template`var ${'name'}`,
        var_more: template`var more ${'phone'} ${'name'}`,
        mix: template`mix ${0} ${'name'}`,
        mix_more: template`mix more ${0} ${'name'} ${1} ${'phone'}`,
        overflow_index: template`index overflow ${0} ${1} ${2} ${'name'}`,
        overflow_var: template`overflow ${0} ${'name'} ${'noname'}`,
        repeat: template`repeat ${0} ${0} ${'name'} ${'name'}`,
    }; 
}
