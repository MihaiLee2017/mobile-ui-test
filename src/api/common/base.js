import request from '@/utils/request'

export function post(url, params) {
  return request({
    url,
    method: 'post',
    data: params
  })
}

export function get(url, params) {
  return request({
    url,
    method: 'get',
    params: params
  })
}
