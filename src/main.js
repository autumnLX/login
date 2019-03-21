import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App'
import lang from '@/assets/scripts/i18n/index'
import axios from './api'

Vue.config.productionTip = false

Vue.use(VueI18n)
Vue.use(axios)

const i18n = new VueI18n({
  locale: 'zh',
  messages: lang
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  components: {
    App
  },
  template: '<App/>'
})
