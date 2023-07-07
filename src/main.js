import Vue from 'vue'
import App from './App.vue'

import * as Cesium from 'cesium'
import "cesium/Build/Cesium/Widgets/widgets.css";
window.Cesium = Cesium;

import Viewer from 'vue-cesium-viewer'
Vue.use(Viewer)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
