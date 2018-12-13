/**
 * Created by BIYY on 2018-1-15.
 */
let string = {}
/**
 * 去除字符串空格
 * @param str
 */
string.trim = (str) => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * 将时间格式的字符串格式化为对应的时间对象
 * 支持   2018-12-1 或者  2018-12-1 12:23:34
 * @param str
 */
string.string2date = (str) => {
  if (typeof str === 'string') {
    return new Date(str.replace(/-/ig, '/'))
  } else {
    return str
  }
}

/**
 * 过滤html代码(把<>转换)
 * @param {String} str
 */
string.filterTag = (str) => {
  str = str.replace(/&/ig, '&amp;')
  str = str.replace(/</ig, '&lt;')
  str = str.replace(/>/ig, '&gt;')
  str = str.replace(' ', '&nbsp;')
  return str
}

export default string
