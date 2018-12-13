<template>
  <div class="flow-select-wrapper">
  <div v-transfer-dom>
    <popup v-model="show" :position="position" width="100%" height="100%" v-if="!isActionSheet"  :hide-on-deactivated="false">
      <mx-header :title="title" 
      :left-options="{preventGoBack: true}" 
      @on-click-back="show = false">
      <a slot="right" v-if="selectType === 'checkbox'" @click="selectComfirm">{{$t('lan.comfirm')}}</a>
        </mx-header>
        <search v-if="!isActionSheet"
        @on-submit="getResult" 
        :auto-fixed="false" 
        v-model="searchText" 
        @on-cancel="onCancel">
        </search>
        <div class="popup-content">
          <group>
            <!-- <radio :options="selectCOpt" v-model="radio" v-if="selectType === 'radio' && !isActionSheet"></radio>
            <checklist ref="checkList" :options="selectCOpt" v-model="checkbox" v-if="selectType === 'checkbox'"></checklist> -->
            <checklist ref="checkList"
              :options="selectCOpt"
              :max="max"
              :label-position="max===1 ? 'left' : 'right'"
              @on-change="changeSelect"
              v-model="checkbox">
            </checklist>
          </group>
        </div>
      </popup>
    </div>

    <!--单选数量少的时候，采用actionsheet进行展示-->
    <actionsheet v-model="show" v-if="isActionSheet" :menus="selectAOpt" @on-click-menu="menuSelect" show-cancel></actionsheet>
  </div>
</template>

<script>
import {Group, Radio, Popup, Checklist, Actionsheet, Search, TransferDom } from 'vux'
import MxHeader from '../mx-header'
export default {
  name: 'flow-select',
  props: {
    selectType: { // 选择类型 单选 或者多选
      type: String,
      default: 'radio',
      required: true
    },
    optionList: { // 选择列表
      type: Array,
      default: function () {
        return []
      },
      required: false
    },
    optionUrl: {
      type: String,
      default: '',
      required: false
    },
    isUseActionSheet: { // 定义是否在单选的时候，选项数量少于maxSheetLen 的时候使用actionsheet展示选择
      type: Boolean,
      default: true,
      required: false
    },
    maxSheetLen: { // 定义使用actionsheet展示单选的最大选项数量，多了则用popup展示选择
      type: Number,
      default: 5,
      required: false
    },
    title: {
      type: String,
      default: '请选择',
      required: false
    },
    position: {
      type: String,
      default: 'right',
      required: false
    },
    value: Boolean
  },
  data () {
    return {
      radio: '',
      checkbox: [],
      show: false,
      optList: [],
      searchText: '',
      searchList: [],
    }
  },
  directives: {
    TransferDom
  },
  components: {
    Group, Radio, Checklist, Popup, Actionsheet, Search, MxHeader
  },
  mounted () {
    if (this.value) {
      this.show = this.value
    }
  },
  created(){
    this.getOptionList()
  },
  computed: {
    selectAOpt () { // actionsheet选项
      let list = []
      this.optList.forEach((item) => {
        list.push({
          value: item.key,
          label: item.value
        })
      })
      return list
    },
    selectCOpt () { // checkbox选项
      let list = []
      this.optList.forEach((item) => {
        if (this.searchText != '') {
          if (typeof(item.key) === 'string') {
            if (item.key.indexOf(this.searchText) >= 0 || item.value.indexOf(this.searchText) >= 0) {
              list.push(item)
            }
          } else {
            if (item.value.indexOf(this.searchText) >= 0) {
              list.push(item)
            }
          }
        } else {
          list.push(item)
        }
      })
      return list
    },
    isActionSheet () {
      if (this.isUseActionSheet) {
        if (this.selectType === 'radio' && this.optList.length < this.maxSheetLen) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    max () {
      if (this.selectType === 'radio') {
        return 1
      } else {
        return this.optList.length
      }
    }
  },
  methods: {
    async getOptionList () {
      let self = this
      if (this.optionList.length === 0) {
        if (this.optionUrl == '') {
          // 提示传入值
        } else {
          // 替换为请求optionURL的地址请求
          let res = await this.$store.dispatch('getDataDictionary', this.optionUrl)
          let list = []
            res.forEach((item) => {
              list.push({
                key: item.dictid,
                value: item.dictname
              })
            })
            this.optList = list
        }
      } else {
        let list = []
        this.optionList.forEach((item) => {
          list.push({
            key: item.code,
            value: item.name
          })
        })
        this.optList = list
      }
    },
    menuSelect (key, item) {
      let obj = ''
      if (item) {
        obj = {
          code: item.value,
          name: item.label
        }
        this.$emit('selectResult', obj)
      }
      this.show = !this.show
    },
    changeSelect (val, label) {
      // console.log('changeSelect', val, label)
      this.searchText = '' // 单选重置搜索条件
      if (this.selectType == 'radio' && val.length) {
        this.$emit('selectResult', {
          code: val[0],
          name: label[0]
        })
        this.show = !this.show
      }
    },
    selectComfirm () {
      if (this.selectType == 'radio') {
        let obj = ''
        this.optList.forEach((item) => {
          if (this.radio === item.key) {
            obj = {
              code: item.key,
              name: item.value
            }
          }
        })
        this.$emit('selectResult', obj)
        this.show = !this.show
      } else {
        let list = []
        let allSelect = this.$refs.checkList.getFullValue()
        if (allSelect.length) {
          allSelect.forEach((item) => {
            list.push({
              code: item.value,
              name: item.label
            })
          })
          this.$emit('selectResult', list)
          this.searchText = '' // 多选重置搜索条件
          this.show = !this.show
        } else {
          // 提示请选择
          this.$vux.toast.text(this.$t('lan.selectTip'), 'middle')
        }
      }
    },
    getResult (val) {
      console.log('getResult', val)
    },
    onCancel () {
      this.searchText = ''
    }
  },
  watch: {
    value (val) {
      this.show = val
    },
    show (val) {
      this.$emit('input', val)
    },
    radio (val) {
      this.selectComfirm()
    },
    optionList (val) {
      if (this.optionUrl === ''){
        this.getOptionList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.flow-select-wrapper {
  .vux-popup-dialog{
    display: flex;
    flex-direction: column;
  }
  .header{
    .back-icon {
      width: 20px;
    }
  }
  .popup-content{
    flex: 1;
    overflow: auto;
    flex-direction: column;
  }
}
</style>
