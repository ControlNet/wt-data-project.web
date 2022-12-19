import { createI18n } from 'vue-i18n'


import zh_cn from './lang/zh-cn.json'
import en_us from './lang/en-us.json'


const i18n = createI18n({
    locale: 'zh-cn',
    messages: {
        "zh-cn": zh_cn,
        "en-us": en_us
    }
})

export { i18n }