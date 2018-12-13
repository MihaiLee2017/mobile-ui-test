const _state = {
  direction: 'forward'
}

const mutations = {
  updateDirection (state, direction) {
    state.direction = direction
  }
}
const getters = {
  getDirection(state) {
    return state.direction
  }
}
const actions = {
  changeDirection(context, direction) {
    context.commit('updateDirection', direction)
  }
}

export default {
  state: _state,
  getters,
  mutations,
  actions
}
