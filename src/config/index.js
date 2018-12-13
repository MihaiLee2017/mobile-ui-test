/**
 * Created by BIYY on 2017-10-12.
 */
import env from 'env'
let config = {}
config.env = env // product,local,test
config.userTest = {
  // 模拟获取的用户uid
  uid: 'guanzq',
  // 模拟token，在这里写入
  ssoToken: 'T2429426253693952',
}
config.requestType = {
  get: 'get',
  post: 'post',
  jsonp: 'jsonp'
}
config.statusBarColor = [0, 162, 223, 1] // 状态栏颜色
config.language = 'CN' // 状态栏颜色 'CN,EN'
config.apiMeta = { // 接口api配置
  base: {   // 基础配置一般是针对mas接口进行的配置
    successKey: 'code', // 成功标识字段
    successValue: 0,  // 成功标识值
    errorKey: 'msg', // 错误提示信息字段
  },
  custom: { // 自定义配置----其他特殊处理的可以类似新增
    successKey: 'code', // 成功标识字段
    successValue: 1,  // 成功标识值
    errorKey: 'err',  // 错误提示信息字段
  }
}

config.baseUrl = {
  // 开发环境
  local: 'https://nx1.newpearl.com/mas-api/restful/hrUrl',
  // 生产环境
  product: 'https://m.infore.com/mas-api/proxy?alias=',
  // 测试环境
  test: 'https://sccappdev.konka.com/mam-api/'
}
config.masUrl = {
  // 开发环境
  local: 'https://dctest.mideadc.com/mas-api/restful/',
  // 生产环境
  product: 'https://dctest.mideadc.com/mas-api/restful/',
  // 测试环境
  test: 'https://dctest.mideadc.com/mas-api/restful/'
}

config.api = {
  // 接口配置范例
  getTest: {  // 接口名称
    url: `${config.baseUrl[config.env]}/getRewardInfo/002SCB/2018`, // 接口地址（必填）
    type: 'get', // 接口请求类型默认未get
    meta: config.apiMeta.base // 接口配置项（可选）
  },
  postTest: {  // 接口名称
    url: `${config.masUrl[config.env]}/muc/api/segiuser/registerUser`, // 接口地址（必填）
    type: 'post', // 接口请求类型默认未get
    meta: config.apiMeta.base // 接口配置项（可选）
  },
  jsonpTest: {
    url: `${config.masUrl[config.env]}talkbar/talkbar/talkingSupport/countMineBase`,
    type: 'jsonp',
    meta: config.apiMeta.custom
  }
}

export default config
