import Vue from 'vue'
import mk from './MK'
import router from './router'
import Antd from 'ant-design-vue'
import store from './store'
import request from 'utils/request'
import db from 'utils/localstorage'
import VueApexCharts from 'vue-apexcharts'
import 'ant-design-vue/dist/antd.css'
import * as echarts from 'echarts'
import cesiumJS from 'utils/cesiumJS'
import PicViewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

import 'utils/install'
var Cesium = require('cesium/Cesium')
var widgets = require('cesium/Widgets/widgets.css')
Vue.use(PicViewer)
PicViewer.setDefaults({
  Options: {'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source'}
})
Vue.config.productionTip = false
Vue.use(Antd)
Vue.use(db)
Vue.use(VueApexCharts)
Vue.use(cesiumJS)
Vue.component('apexchart', VueApexCharts)

Vue.use({
  install (Vue) {
    Vue.prototype.$db = db
  }
})
Vue.prototype.Cesium = Cesium
Vue.prototype.widgets = widgets
Vue.prototype.$echarts = echarts
Vue.prototype.$post = request.post
Vue.prototype.$postDate = request.postDate
Vue.prototype.$get = request.get
Vue.prototype.$put = request.put
Vue.prototype.$delete = request.delete
Vue.prototype.$export = request.export
Vue.prototype.$download = request.download
Vue.prototype.$upload = request.upload

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(mk)
}).$mount('#mk')
