import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as filters from './filters';
import zhCN from 'iview/dist/locale/zh-CN'
import enUS from 'iview/dist/locale/en-US'
import jaJP from 'iview/dist/locale/ja-JP'
import koKR from 'iview/dist/locale/ko-KR'
import ruRU from 'iview/dist/locale/ru-RU'
import en from './locales/en'
import zh from './locales/zh'
import ru from './locales/russian'
import iView from 'iview'
import ViewUI from 'view-design';
// import style
import 'view-design/dist/styles/iview.css';

import 'iview/dist/styles/iview.css'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import VueI18n from 'vue-i18n'
import axios from './axios/http'
import common from './common'
import SvgIcon from 'vue-svgicon'
import animated from 'animate.css'
import clipboard from 'clipboard'; 
Vue.use(animated)
Vue.use(SvgIcon, {
    tagName: 'icon'
});
Vue.use(common)
Vue.use(axios)
Vue.use(VueI18n)
Vue.use(iView)
Vue.use(ViewUI)
Vue.use(VueMaterial)
Vue.use(iView, {
    i18n: (key, value) => i18n.t(key, value)
})
const i18n = new VueI18n({
    messages: {
        'zh-CN': Object.assign( zhCN, zh),
        'en': Object.assign( enUS, en),
        'ru': Object.assign( ruRU, ru),
    },
    silentTranslationWarn: true,
})

Object.keys(filters).forEach(key => { //过滤器挂载在Vue上
    Vue.filter(key, filters[key])
})
Vue.config.productionTip = false

Vue.prototype.clipboard = clipboard;

let vue = new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')

export default vue;