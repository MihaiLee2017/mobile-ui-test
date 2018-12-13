import request from '@/common/lib/request'
// import lib from '@/common/lib/index'
import config from '@/config/index'        // 配置文件引入
const service = {
  baserurl: '2',
  getAPPlist: () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('world')
        resolve('world')
      }, 3000)
    })
  },
  getAPPlist2: () => {
    return request.request({
      api: config.api.reginTest,
      data: {
        a: 1
      }
    })
  }
}

export default service
