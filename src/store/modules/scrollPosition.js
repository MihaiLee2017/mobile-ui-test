const _state = {
  homePos: 0
}

const mutations = {
  updateHomePos (state, pos) {
    state.homePos = pos
  }
}
const getters = {
  getHomePos(state) {
    return state.homePos
  }
}
const actions = {
  updateHomePos(context, pos) {
    context.commit('updateHomePos', pos)
  }
}

export default {
  state: _state,
  getters,
  mutations,
  actions
}
