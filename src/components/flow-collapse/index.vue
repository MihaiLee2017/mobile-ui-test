<template>
  <div class="collapse">
    <!-- 头部 -->
    <div class="title" @click.stop.prevent="show=!show">
      <span class="triangle-down" :class="{'activate': show}"></span>
      <slot name="title"></slot>
    </div>
    <!-- 内容 -->
    <transition>
      <group v-show="show" class="group">
        <slot></slot>
      </group>
    </transition>
  </div>
</template>

<script>
    import { Group } from 'vux'
    export default {
      name: 'flow-collapse',
      props: {
        isOpen: { // 是否默认展开
          type: Boolean,
          default: false
        }
      },
      data () {
        return {
          show: this.isOpen
        }
      },
      components: {
        Group
      }
    }
</script>

<style lang="less" scoped>
  .collapse {
    overflow: hidden;
    position: relative;
    margin-bottom: .1rem;
    background-color: #fff;
    transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
    transition-delay: 0s;
    .title {
      position: relative;
      display: inline-flex;
      align-items: center;
      width: 100%;
      min-height: .5rem;
      padding-left: .3rem;
      color: #000;
      .triangle-down {
        position: absolute;
        left: .10rem;
        width: 0;
        height: 0;
        border-left: .06rem solid transparent;
        border-right: .07rem solid transparent;
        border-top: .14rem solid #AFAFAF;
        transform: scale(.5);
        transition: transform .3s ease-in-out;

        &.activate {
          transform: rotate(180deg) scale(.5);
        }
      }
    }
  }
</style>
