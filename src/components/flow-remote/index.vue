<template>
  <div class="flow-remote-wrapper">
   <popup v-model="show" position="right" width="100%" height="100%" :hide-on-deactivated="false">
     <mx-header :title="$t('lan.detail')" 
     :left-options="{preventGoBack: true}" 
     @on-click-back="show = false">
     </mx-header>
    <div class="popup-content">
      <iframe :src="remoteUrl" :height="frameHeight" width="100%"></iframe>
    </div>
    </popup>
  </div>
</template>

<script>
import { Popup } from 'vux'
import MxHeader from '../mx-header'
export default {
  name: 'flow-remote',
  props: {
    remoteUrl: { // 选择类型 单选 或者多选
      type: String,
      default: '',
      required: true
    },
    value: Boolean
  },
  data () {
    return {
      frameHeight: window.screen.availHeight - 44 + 'px',
      show: false
    }
  },
  components: {
    Popup, MxHeader
  },
  mounted () {
    if (this.value) {
      this.show = this.value
    }
  },
  created(){
  },
  computed: {
  },
  methods: {
    getOptionList () {
      let self = this
      if (this.optionList.length === 0) {
        if (this.optionUrl == '') {
          // 提示传入值
        } else {
          this.$request.getOptionsByUrl(this.optionUrl).then((res) => {
            self.optionList = res.data
          })
        }
      }
    },
  },
  watch: {
    value (val) {
      this.show = val
    },
    show (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="less" scoped>
.flow-remote-wrapper {
  display: flex;
  flex-direction: column;
  .header{
    flex: 1;
    .back-icon {
      width: 20px;
    }
  }
  .popup-content{
    display: flex;
    flex: 1
  }
}
</style>
