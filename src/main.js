// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Navigation from 'vue-navigation'
import pageClose from '@/components/page-close/index.vue' // 引入物理返回键处理组件
import VueI18n from 'vue-i18n' // 国际化
import native from '@/common/lib/native' // lib 引入 公共方法  因为再vue初始化之前，所以 @/lib引入之后，并不能使用
import config from '@/config/index' // 配置文件引入
import '@/lib' // lib 的引入
import { ToastPlugin, ConfirmPlugin, AlertPlugin, LoadingPlugin } from 'vux'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.use(MintUI)
Vue.use(ToastPlugin, { position: 'bottom' })
Vue.use(ConfirmPlugin)
Vue.use(AlertPlugin)
Vue.use(LoadingPlugin)

Vue.component('page-close', pageClose) // 引入物理返回键处理组件
// 国际化引入
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'CN', // 语言标识
  messages: {
    CN: require('@/common/lang/cn'), // 中文语言包
    EN: require('@/common/lang/en') // 英文语言包   其他语言包请自行添加
  }
})

Vue.use(Navigation, { router, store })
Vue.config.productionTip = false
const history = window.sessionStorage
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)
router.beforeEach(async (to, from, next) => {
  /**
   * 处理页面切换动画
   */
  renderDirection(to, from, next)

  /**
   * 处理跳转
   */
  if (/\/http/.test(to.path)) {
    let url = to.path.split('http')[1]
    window.location.href = `http${url}`
  } else {
    if (config.env !== 'local') {
      let extra = await native.getExtra()
      if (extra.extra) {
        extra = extra.extra
      }
      if (extra && extra.showWidgetKey) {
        console.log('showWidgetKey', extra.showWidgetKey)
        extra = JSON.parse(extra.showWidgetKey)
      }
      console.log('getExtra', extra)
      console.log('action', extra.action)
      if (extra.action) {
        store.commit('updateExtra', extra)
        next({
          name: extra.action
        })
      } else {
        next()
      }
    } else {
      next()
    }
  }
})
/**
 * 处理页面切换
 * @param to
 * @param from
 * @param next
 */
function renderDirection(to, from, next) {
  store.commit('updateLoading', true)
  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)
  if (toIndex) {
    if (
      toIndex > fromIndex ||
      !fromIndex ||
      (toIndex === '0' && fromIndex === '0')
    ) {
      store.commit('updateDirection', 'forward')
    } else {
      store.commit('updateDirection', 'reverse')
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    store.commit('updateDirection', 'forward')
  }
}
router.afterEach(function(to) {
  store.commit('updateLoading', false)
})

function init() {
  Vue.prototype.AppLanguage = function(lang) {
    i18n.locale = lang.language.toUpperCase()
  }
  new Vue({
    el: '#app',
    i18n,
    router,
    store,
    template: '<App/>',
    components: { App }
  })
}
if (config.env === 'local') {
  appendCss('./static/iconfont/iconfont.css')
  init()
} else {
  // 移动端引入cordova
  appendScript('cordova.js')
  appendCss('./static/iconfont/iconfont.css')
  document.addEventListener('deviceready', init, false)
}
// 引入 JS
function appendScript(src) {
  let $head = document.querySelector('head')
  let $script = document.createElement('script')
  $script.src = src
  $head.appendChild($script)
}
// 引入 CSS
function appendCss(src) {
  let $head = document.querySelector('head')
  let $link = document.createElement('link')
  $link.href = src
  $link.rel = 'stylesheet'
  $head.appendChild($link)
}
