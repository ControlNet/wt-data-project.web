import { createI18n } from 'vue-i18n'


import zh_CN from './lang/zh-CN.json'
import en_US from './lang/en-US.json'


export const i18n = createI18n({
    locale: 'en-US',
    globalInjection: true,
    messages: {
        "en-US": en_US,
        "zh-CN": zh_CN
    }
})