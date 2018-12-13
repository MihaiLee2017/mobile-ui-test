import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import extra from './modules/extra'
import direction from './modules/direction'
import loading from './modules/loading'
import page from './modules/pages'
import scrollPosition from './modules/scrollPosition'
import sqlite from './modules/sqlite'

Vue.use(Vuex)

// 使用频率高，赋给全局变量
for (let item of ['mapState', 'mapGetters', 'mapMutations', 'mapActions']) {
  window[item] = Vuex[item]
}

// 注册到 vm，可以通过 this.$vuex 调用
// Vue.prototype.$vuex = Vuex

export default new Vuex.Store({
  modules: {
    user,
    extra,
    direction,
    loading,
    page,
    scrollPosition,
    sqlite
  }
})
