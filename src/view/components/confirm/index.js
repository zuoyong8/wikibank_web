import Vue from 'vue'
import Confirm from './Confirm.vue'

const ConfirmBox = Vue.extend(Confirm);

Confirm.install = (options) => {
  let instance = new ConfirmBox({
    data: options
  }).$mount();
  document.body.appendChild(instance.$el);

  return instance.confirm();
}

window.confirm = Confirm.install;

export default Confirm
