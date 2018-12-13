import Vue from 'vue'
import Router from 'vue-router'
// import indexApp from '../views/index.vue'
// import detailApp from '../views/detail.vue'
// 路由懒加载，实为异步加载路由，避免单个app.js体积过大
//  require.ensure在需要的时候才下载依赖的模块，当参数指定的模块都下载下来了（下载下来的模块还没执行），
// 便执行参数指定的回调函数。require.ensure会创建一个chunk，且可以指定该chunk的名称，如果这个chunk名已经存在了，
// 则将本次依赖的模块合并到已经存在的chunk中，最后这个chunk在webpack构建的时候会单独生成一个文件
const indexApp = r =>
  require.ensure([], () => r(require('@/views/index.vue')), 'indexApp') // 首页


// vux
const VuxLayout = r =>
  require.ensure([], () => r(require('@/views/vux/layout.vue')), 'VuxLayout')
const VuxIndex = r =>
  require.ensure([], () => r(require('@/views/vux/index')), 'VuxIndex')
const VuxToast = r =>
  require.ensure([], () => r(require('@/views/vux/toast')), 'VuxToast')
const VuxIndicator = r =>
  require.ensure(
    [],
    () => r(require('@/views/vux/indicator')),
    'VuxIndicator'
  )
const VuxLoadMore = r =>
  require.ensure([], () => r(require('@/views/vux/loadmore')), 'VuxLoadMore')
const VuxSwipe = r =>
  require.ensure([], () => r(require('@/views/vux/swipe')), 'VuxSwipe')


// mint
const MintLayout = r =>
  require.ensure([], () => r(require('@/views/mint/layout.vue')), 'MintLayout')
const MintIndex = r =>
  require.ensure([], () => r(require('@/views/mint/index')), 'MintIndex')
const MintToast = r =>
  require.ensure([], () => r(require('@/views/mint/toast')), 'MintToast')
const MintIndicator = r =>
  require.ensure(
    [],
    () => r(require('@/views/mint/indicator')),
    'MintIndicator'
  )
const MintLoadMore = r =>
  require.ensure([], () => r(require('@/views/mint/loadmore')), 'MintLoadMore')
const MintSwipe = r =>
  require.ensure([], () => r(require('@/views/mint/swipe')), 'MintSwipe')

Vue.use(Router)
export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'indexApp',
      component: indexApp
    },
    {
      path: '/vux',
      name: 'VuxLayout',
      component: VuxLayout,
      redirect: '/vux/index',
      children: [
        {
          path: 'index',
          component: VuxIndex,
          name: 'VuxIndex'
        },
        {
          path: 'toast',
          component: VuxToast,
          name: 'VuxToast'
        },
        {
          path: 'indicator',
          component: VuxIndicator,
          name: 'VuxIndicator'
        },
        {
          path: 'loadmore',
          component: VuxLoadMore,
          name: 'VuxLoadMore'
        },
        {
          path: 'swipe',
          component: VuxSwipe,
          name: 'VuxSwipe'
        }
      ]
    },
    {
      path: '/mint',
      name: 'MintLayout',
      component: MintLayout,
      redirect: '/mint/index',
      children: [
        {
          path: 'index',
          component: MintIndex,
          name: 'MintIndex'
        },
        {
          path: 'toast',
          component: MintToast,
          name: 'MintToast'
        },
        {
          path: 'indicator',
          component: MintIndicator,
          name: 'MintIndicator'
        },
        {
          path: 'loadmore',
          component: MintLoadMore,
          name: 'MintLoadMore'
        },
        {
          path: 'swipe',
          component: MintSwipe,
          name: 'MintSwipe'
        }
      ]
    }
  ]
})
