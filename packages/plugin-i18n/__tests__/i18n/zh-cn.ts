export default function (template) {
    return {
        hi: '很高兴遇见你!',
        empty: '',
        index: template`索引 ${0} ${1} ${2}`,
        index_back: template`索引逆序 ${2} ${1} ${0}`,
        var: template`变量 ${'name'}`,
        var_more: template`更多变量 ${'phone'} ${'name'}`,
        mix: template`混合 ${0} ${'name'}`,
        mix_more: template`更多混合 ${0} ${'name'} ${1} ${'phone'}`,
        overflow_index: template`索引溢出 ${0} ${1} ${2} ${'name'}`,
        overflow_var: template`变量溢出 ${0} ${'name'} ${'noname'}`,
        repeat: template`重复 ${0} ${0} ${'name'} ${'name'}`,
    };
}
