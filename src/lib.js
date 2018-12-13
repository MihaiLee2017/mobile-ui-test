/**
 * 项目全局库管理
 */
import * as lib from '@/common/lib/index'
import native from '@/common/lib/native'
import config from '@/config/index'
import cubeModule from '@/../CubeModule.json'
import service from '@/service.js'
import Vue from 'vue'
import flexible from '@/common/lib/Flexible'
import FastClick from 'fastclick'
import SQLite from '@/common/lib/sqlite'
// import 'assets/css/index.less'
/**
 * 给vue添加prototype属性
 */
// Vue.prototype.$messageBox = MessageBox
Vue.prototype.$cubeModule = cubeModule
Vue.prototype.$nativeApi = native
Vue.prototype.$config = config
Vue.prototype.$service = service
Vue.prototype.$tools = {}
// 将lib的内容，合并在 $tools
Object.values(lib).forEach((fnObj) => {
  Object.assign(Vue.prototype.$tools, fnObj)
})
Vue.prototype.$request = Vue.prototype.$tools.request
Vue.prototype.$ajax = Vue.prototype.$tools.ajax
Vue.prototype.$sqlite = SQLite

/**
 * 引入VueScroller插件
 */
// Vue.use(VueScroller)
// Vue.use(MintUI)
Vue.use(flexible)
FastClick.attach(document.body)
