import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import i18n from '@/locales/index'

// import style
import '@/style/media.scss';
import '@/style/public.scss'

import SvgIcon from 'vue-svgicon'
import common from '@/common'

Vue.use(common);
Vue.use(SvgIcon, {
    tagName: 'icon'
});


let vue = new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')

export default vue;