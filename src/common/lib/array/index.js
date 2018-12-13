/**
 * Created by BIYY on 2017-11-17.
 */
// import toast from '../toast'


let array = {}
/**
 * 数组的去重复
 * @param arr{Array}
 * @returns {*}
 */
array.unique = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length;) {
      if (arr[j] === arr[i]) {
        arr.splice(j, 1)
      } else {
        j++
      }
    }
  }
  return arr
}

/**
 * 数组的去重复
 * @param arr{Object}
 * @returns {*}
 */
// array.uniqueOfObj = (arr) => {
//   let result = []
//   let hash = {}
//   for (let i = 0, elem; (elem = arr[i]) != null; i++) {
//     if (!hash[elem]) {
//       result.push(elem)
//       hash[elem] = true
//     }
//   }
//   return result
// }

/**
 * 获取数组的下标
 * @param arr
 * @param val
 * @returns {number}
 */
array.getIndex = (arr, val) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === val) {
      return i
    }
  }
  return -1
}

export default array
