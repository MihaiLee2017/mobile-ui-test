<template>
  <div class="demo-template">
    <div class="show">
      <slot></slot>
    </div>
    <x-button  type="primary" @click.native="showmore()" >{{isShowMore ? '关闭详情': '显示详情'}}</x-button>
    <div class="more-wrapper" v-show="isShowMore">
      <p>调用示例:</p>
      <div class="input">
        <slot name="input"></slot>
      </div>
      <p>返回结果:</p>
      <div class="input">
        <slot name="output"></slot>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import '../../assets/css/index.less';
.demo-template {
  margin: 10px 0;
  padding: 5px;
  .theme-cbg;
  .show{
    padding: 10px;
    font-size: 18px;
  }
  .more-wrapper {
    width: 100%;
    margin-top: 10px;
    p{
        line-height: 26px;
        padding: 5px;
        overflow: auto;
        .theme-cfont;
      }
    .input {
      padding: 10px;
      font-size: 16px;
      .theme-cfont;
      .theme-bg;
    }
  }
}
</style>
<script>
import { XButton } from 'vux'
export default {
  data() {
    return {
      isShowMore: this.isOpen
    }
  },
  props: {
    isOpen: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  components: {
    XButton
  },
  mounted() {},
  methods: {
    showmore() {
      this.isShowMore = !this.isShowMore
    }
  }
}
</script>
