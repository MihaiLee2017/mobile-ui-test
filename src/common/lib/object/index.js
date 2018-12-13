/**
 * Created by BIYY on 2017-11-17.
 */
let obj = {}
/**
 * 对象合并 深拷贝
 * @param des
 * @param src
 * @param override
 * @returns {*}
 */
obj.deepExtend = (des, src) => {
  if (Array.isArray(src)) {
    if (Array.isArray(des)){
      for (let i = 0; i < src.length; i++) {
        if (src[i] instanceof Object){
          des[i] = obj.deepExtend(des[i], src[i])
        } else {
          des[i] = src[i]
        }
      }
    } else {
      des = [].concat(src)
    }
  } else if (src instanceof Object && !Array.isArray(src)){
    if (des instanceof Object && !Array.isArray(des)){
      for (let key of Object.keys(src)) {
        if (src[key] instanceof Object) {
          des[key] = obj.deepExtend(des[key], src[key])
        } else {
          des[key] = src[key]
        }
      }
    } else {
      des = Object.assign({}, src)
    }
  } else {
    des = src
  }

  return des
}
/**
 * 对象深拷贝
 * @param des 目标对象
 * @param src 源对象
 * @param override
 * @returns {*}
 */
obj.deepCopy = (des, src) => {
  let d = des || {}
  for (let i in src) {
    if (typeof src[i] === 'object') {
      d[i] = (src[i].constructor === Array) ? [] : {}
      obj.deepCopy(src[i], d[i])
    } else {
      d[i] = src[i]
    }
  }
  return d
}
/**
 * 对象合并
 * @param des
 * @param src
 * @param override
 * @returns {*}
 */
obj.extend = (des, src, override) => {
  if (src instanceof Array) {
    for (let i = 0, len = src.length; i < len; i++) {
      obj.extend(des, src[i], override)
    }
  }
  for (let i in src) {
    if (override || !(i in des)) {
      des[i] = src[i]
    }
  }
  return des
}
/**
 * 判断字符串是否为json格式
 * @param str
 * @returns {boolean}
 */
obj.isJSON = (str) => {
  if (typeof str === 'string') {
    try {
      JSON.parse(str)
      if (str.indexOf('{') > -1) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  } else {
    str = JSON.stringify(str)
    obj.isJSON(str)
  }
  return false
}

/**
 * 判断非空,
 * @param val
 * @returns {Boolean}
 */
obj.isEmpty = (val) => {
  if (val == null){
    return true
  }
  if (val == undefined || val == 'undefined'){
    return true
  }
  if (val === ''){
    return true
  }
  if (val.length === 0){
    return true
  }
  if (typeof (val) == 'object' && JSON.stringify(val) == '{}'){
    return true
  }
  if (!/[^(^\s*)|(\s*$)]/.test(val)){
    return true
  }
  return false
}

export default obj
