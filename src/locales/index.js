import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhCN from "./languages/zh-cn";
import zhHK from "./languages/zh-hk";
import zhTW from "./languages/zh-tw";
import en from "./languages/en";
import vi from "./languages/vi";
import th from "./languages/th";
import request from "../axios/request";
Vue.use(VueI18n)

const DEFAULT_LANG = 'zh-CN'
const LOCALE_KEY = 'langAbbr'

const locales = {
  'zh-CN': zhCN,
  'en': en,
  'vi': vi,
  'zh-HK': zhHK,
  'zh-TW': zhTW,
  'th': th
}

const i18n = new VueI18n({
  locale: DEFAULT_LANG,
  messages: locales
})

export const setup = lang => {
  if (lang === undefined) {
    lang = window.localStorage.getItem(LOCALE_KEY)
    if (locales[lang] === undefined) {
      lang = DEFAULT_LANG
    }
  }
  window.localStorage.setItem(LOCALE_KEY, lang)

  Object.keys(locales).forEach(lang => {
    document.body.classList.remove(`lang-${lang}`)
  })
  document.body.classList.add(`lang-${lang}`)
  document.body.setAttribute('lang', lang)

  Vue.config.lang = lang
  i18n.locale = lang
  request.defaults.headers["Language"] = lang;
}

setup()
window.i18n = i18n

export default i18n