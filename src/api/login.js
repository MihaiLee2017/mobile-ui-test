import { get, post } from './common/base'
import * as URL from './common/url'
export function loginByTest(params) {
  return post(URL.LOGIN_TEST, params)
}

export function getLoginTest(params) {
  return get(URL.GET_INFO_TEST, params)
}
