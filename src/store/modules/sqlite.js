/**
 * 项目公共的一些内容
 * @type {{}}
 */
import $request from '@/common/lib/request'
import $sqlite from '@/common/lib/sqlite'
import env from 'env' // product,local,test
const _state = {
  db: null // 数据库对象
}

const _mutations = {
  /**
   * 设置 todoInfo的对象
   * @param state vuex 固定参数
   * @param db 数据库对象
   */
  setDBM (state, db) {
    state.db = db
  }
}
const _getters = {
  db: state => state.db
}
const _actions = {
  /**
   * 获取数据字典，有以下情况：
   * 1、如果是 env 为local（即本地调试），则每次获取数据字典都是走 http
   * 2、如果 env 为 product 或 test（即底座环境），那么，dictTypeId 有值时，是从 sqlite 取数，dictTypeId 无值时，拉取整个字典保存 sqlite
   * @param commit
   * @param getters 此处只能使用 getters，否则不能取到用户信息
   * @param dictTypeId 查询条件，数据字典id
   * @return {Promise<*>}
   */
  async getDictionary ({ getters, dispatch }, dictTypeId = '') {
    let crmUser = getters.getCrmUser
    let params = {
      sessionid: crmUser.sessionid
    }

    // 如果是按单个查询，不传的话，会把整个数据字典加载
    if (dictTypeId) {
      params.dicttypeid = dictTypeId
    }

    if (env === 'local') {
      // TODO 本地调试，每次单取某数据字典值 配置接口使用
      // return new Promise((resolve, reject) => {
      //   $request('getSelectDataList', params).then((resp) => {
      //     resolve(resp.data)
      //   })
      // })
    } else {
      // 从 sqlite 查询某数据字典的值,此条件默认已有数据库
      let res = await dispatch('selectDictByCode', dictTypeId)
      return res
    }
  },
   /** ************************************字典离线表,字典应用************************************ */
   /**
   * 创建附件表
   * @param  表id 字典类型id   数据id 数据名称 状态
   * @return {Promise<any>}
   */
  createDictTable () {
    $sqlite.openOrgetDatabase('meicloud')
    return $sqlite.createTable('dicttable', ['id INTEGER PRIMARY KEY AUTOINCREMENT', 'dicttypeid', 'dictid', 'dictname', 'status'])
  },
  /**
   * 删除字典表
   * @return {Promise<any>}
   */
  dropDictTable () {
    $sqlite.openOrgetDatabase('meicloud')
    return $sqlite.deleteTabel('dicttable')
  },
  /**
   * 清空数据
   * @return {Promise<any>}
   */
  cleanDictTable () {
    $sqlite.openOrgetDatabase('meicloud')
    let sqlList = [
      'DELETE from dicttable',
      ['UPDATE sqlite_sequence SET seq = 0 where name=?', ['dicttable']]
    ]
    return $sqlite.sqlBatch(sqlList)
  },
  /**
   * 插入数据字典
   * @param tableList 数组对象，对象包含如下属性 ['dicttypeid', 'dictid', 'dictname', 'status']
   */
  async insertDictList ({ getters, dispatch }, isfirst) {
    let crmUser = getters.getCrmUser
    let params = {
      sessionid: crmUser.sessionid
    }
    if (env !== 'local') {
      $sqlite.openOrgetDatabase('meicloud')
      // 整个数据字典拉取，且保存在底座的 sqlite ,注意：这里是单线程
      let res = await $request('downloadDataList', params)
      // console.log(res)
      if (res.message.status === '0' || res.message.status === 0) {
        let countRes = await dispatch('selectDictCount')  // 判断是否有数据
        // console.log(countRes)
        let insertRes = null
        if (countRes && countRes.hasOwnProperty('code') && countRes.code === 1 && countRes.message[0] && countRes.message[0].count > 0){
          if (!isfirst) {
            let result = await dispatch('cleanDictTable')  // 有数据就清除
            // console.log(result)
            if (result.code ===  1) {
              insertRes = await $sqlite.insertDataList('dicttable',  res.data) // 插入数据
              return insertRes
            } else {
              return {
                code: 5,
                message: '情况数据失败'
              }
            }
          }
        } else {
          insertRes = await $sqlite.insertDataList('dicttable',  res.data) // 插入数据
          return insertRes
        }
      } else {
        return {
          code: 5,
          message: '获取数据失败'
        }
      }
    }
  },
  /**
   * 查询数据字典
   * @param dicttypeid 查询对应字典
   * @return {Promise<any>}
   */
  selectDictByCode (cxt, dicttypeid) {
    $sqlite.openOrgetDatabase('meicloud')
    return $sqlite.selectData('dicttable', 'dicttypeid=?', [dicttypeid], ['id', 'dicttypeid', 'dictid', 'dictname', 'status'])
  },
  /**
   * 查询草稿详情
   * @param dicttypeid 查询对应字典
   * @return {Promise<any>}
   */
  selectDictCount () {
    $sqlite.openOrgetDatabase('meicloud')
    return $sqlite.selectData('dicttable', '1=1', [], ['COUNT(*) AS count'])
  },
  /**************************************附件离线表,附件和底座提供的视频，图片，语音内容************************************ */
  /**
   * 删除字典表
   * @return {Promise<any>}
   */
  dropFileTable () {
    $sqlite.openOrgetDatabase('meicloud')
    return $sqlite.deleteTabel('filetable')
  },
  /**
   * 创建附件表
   * @param 表id 用户id 时间搓 关联表单id  表单内容  附件类型 视频文件 附件地址或者base64编码  录音视频时长 附件大小, 文件夹名称
   * @return {Promise<any>}
   */
  createFileTable () {
    $sqlite.openOrgetDatabase('meicloud')
    return $sqlite.createTable('filetable', ['id INTEGER PRIMARY KEY   AUTOINCREMENT', 'uid', 'time', 'formid', 'content', 'filetype', 'video', 'src', 'duration', 'filesize', 'filefolder'])
  },
  /**
   * 插入表单数据
   * @param table 对象，包含如下属性 [ 'uid', 'time', 'formid', 'content', 'filetype', 'video', 'src', 'duration', 'filesize', 'filefolder']
   */
  insertFile (cxt, table) {
    $sqlite.openOrgetDatabase('meicloud')
    return $sqlite.insertData('filetable', table )
  },
  /**
   * 查询文件列表 按照流程进行分类
   * @param getters
   * @return {Promise<any>}
   */
  selectFileList ({ getters, dispatch }) {
    $sqlite.openOrgetDatabase('meicloud')
    return $sqlite.selectData('filetable', '1=1  AND  uid=? GROUP BY formid', [getters.getUser.uid], ['id',  'uid', 'time', 'formid', 'content', 'filetype', 'video', 'src', 'duration', 'filesize', 'filefolder'])
  },
  /**
   * 查询草稿详情
   * @param id 为草稿本地id
   * @return {Promise<any>}
   */
  selectFileDetail (cxt, flowid) {
    $sqlite.openOrgetDatabase('meicloud')
    return $sqlite.selectData('filetable', 'formid=?', [formid], ['id',  'uid', 'time', 'formid', 'content', 'filetype', 'video', 'src', 'duration', 'filesize', 'filefolder'])
  },
  /**
   * 删除 流程草稿 审批通过或者
   * @param flowid 流程id
   * @return {Promise<any>}
   */
  delfile (cxt, id) {
    $sqlite.openOrgetDatabase('meicloud')
    return $sqlite.deleteData('filetable', 'id=?', [id])
  },

  /**
   * 清空数据
   * @return {Promise<any>}
   */
  cleanFileTable () {
    $sqlite.openOrgetDatabase('meicloud')
    let sqlList = [
      'DELETE from filetable',
      ['UPDATE sqlite_sequence SET seq = 0 where name=?', ['filetable']]
    ]
    return $sqlite.sqlBatch(sqlList)
  },
}

export default {
  state: _state,
  getters: _getters,
  mutations: _mutations,
  actions: _actions
}
