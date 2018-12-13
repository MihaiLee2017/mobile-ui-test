import { getToken } from '@/utils/auth'
import { stat } from 'fs'
import { loginByTest } from '@/api/login'
const _state = {
  user: null,
  token: getToken()
}

const mutations = {
  updateUser(state, user) {
    state.user = user
  },
  SET_TOKEN(state, token) {
    state.token = token
  }
}
const getters = {
  getUser(state) {
    return state.user
  },
  getToken(state) {
    return state.token
  }
}
const actions = {
  changeUser(context, user) {
    context.commit('updateUser', user)
  },
  getLogin(contest, user) {
    let params = {
      username: 'admin',
      pwd: '1234567'
    }
    loginByTest(params)
      .then(res => {
        let { data } = res
        contest.commit('SET_TOKEN', data.token)
      })
      .catch(err => {
        console.log('catch:', err)
      })
  }
}

export default {
  state: _state,
  getters,
  mutations,
  actions
}
