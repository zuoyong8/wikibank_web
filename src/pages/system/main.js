import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import * as filters from '@/filters';
import i18n from '@/locales/index'
// import iView from 'iview'
// import ViewUI from 'view-design';
import Confirm from '@/view/components/confirm'
import VueMessages from 'vue-messages'

// import style
import 'view-design/dist/styles/iview.css';
import '@/style/media.scss';
import '@/style/public.scss'

import 'iview/dist/styles/iview.css'
import 'vue-material/dist/vue-material.min.css'
import * as math from 'mathjs'
import common from '@/common'
import SvgIcon from 'vue-svgicon'
import animated from 'animate.css'
import clipboard from 'clipboard';

Vue.use(animated)
Vue.use(SvgIcon, {
  tagName: 'icon'
});
Vue.use(common)
// Vue.use(iView)
// Vue.use(ViewUI)
// Vue.use(VueMaterial)
Vue.use(VueMessages, {
  content: '',
  duration: 2,
  // themes: 'blackGold', // classic or classicBold
  styles: {
    fontSize: '16px',
    top: '28px'
  }
});

Vue.prototype.$confirm = Confirm.install;
Object.keys(filters).forEach(key => { // 过滤器挂载在Vue上
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false

Vue.prototype.clipboard = clipboard;

Vue.prototype.$math = math;

let vue = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

export default vue;