/*  设置cookie  */
const cookie = {}
cookie.setCookie = (c_name, value, expiredays) => {
  let exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = c_name + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
}
// 获取cookie
cookie.getCookie = (c_name) => {
  if (document.cookie.length > 0) {
    let c_start = document.cookie.indexOf(c_name + '=')
    if (c_start !== -1) {
      c_start = c_start + c_name.length + 1
      let c_end = document.cookie.indexOf(';', c_start)
      if (c_end === -1) {
        c_end = document.cookie.length
      }
      return unescape(document.cookie.substring(c_start, c_end))
    }
  }

  return ''
}
// 清除cookie
cookie.clearCookie = () => {
  // console.log('clearCookie')
  let keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  if (keys) {
    for (let i = keys.length; i--;) {
      document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
  }
}
//  删除对应cookie
cookie.delCookie = (name) => {
  console.log('delCookie', name)
  let exp = new Date()
  exp.setTime(exp.getTime() - 1)
  let cval = cookie.getCookie(name)
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

export default cookie
