// import cookie from 'assets/plugins/cookie/index'
const _state = {
  list: []
}
const mutations = {
  updatePage (state, list) {
    state.list = list
  },
  addPage (state, page) {
    state.list.push(page)
  },
  deletePage (state, page) {
    state.list.splice(state.list.findIndex(item => item === page), 1)
  }
}
const getters = {
  getPage(state) {
    return state.list
  }
}

const actions = {
  changePage(context, list) {
    context.commit('updatePage', list)
  }
}

export default {
  state: _state,
  mutations,
  getters,
  actions
}
