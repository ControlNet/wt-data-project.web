import { createI18n } from 'vue-i18n'


import zh_cn from './lang/zh-cn.json'


const i18n = createI18n({
    locale:'zh-cn',
    messages:{
        "zh-cn":zh_cn
    }
})

export {i18n}