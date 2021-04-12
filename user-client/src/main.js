import Vue from 'vue'
import VueVideoPlayer from 'vue-video-player'
import App from './App.vue'
import router from './router'
import store from './store'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import 'videojs-flash'
import 'videojs-contrib-hls/dist/videojs-contrib-hls'

const SUFIXE_TITLE = 'Some Default Title';

Vue.use(VueVideoPlayer, {
  // options: {
  //   autoSetup: false
  // },
  // events: global videojs events
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
