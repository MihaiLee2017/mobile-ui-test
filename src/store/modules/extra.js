const _state = {
  extra: null
}

const mutations = {
  updateExtra (state, extra) {
    state.extra = extra
  }
}
const getters = {
  getExtra(state) {
    return state.extra
  }
}
const actions = {
  changeExtra(context, extra) {
    context.commit('updateExtra', extra)
  }
}

export default {
  state: _state,
  getters,
  mutations,
  actions
}
