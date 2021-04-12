import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue'
import VueVideoPlayer from 'vue-video-player'
import App from './App.vue'
import router from './router'
import store from './store'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import 'videojs-flash'
import 'videojs-contrib-hls/dist/videojs-contrib-hls'
import globalMethod from './plugins/globalMethods'

Vue.use(globalMethod)

// const videojs = require('video.js')

// window.videojs = videojs

// Global Components
import './global-components'

// 3rd party plugins
import '@/libs/portal-vue'
import '@/libs/toastification'

Vue.use(VueVideoPlayer, {
  // options: {
  //   autoSetup: false
  // },
  // events: global videojs events
})

// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)

// Composition API
Vue.use(VueCompositionAPI)

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
