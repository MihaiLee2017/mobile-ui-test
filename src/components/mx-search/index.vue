<template>
  <div class="weui-search-bar"><!-- :class="{'weui-search-bar_focusing': !isCancel || currentValue}" -->
    <!-- 初始的样式 -->
    <div
      class="weui-search-bar__label"
      @click.stop.prevent="onFocus">
      <i class="weui-icon-search"></i>
      <span>{{ placeholder }}</span>
    </div>

    <!-- 激活选中样式 -->
    <transition name="fade">
      <div class="search-activate" v-show="isFocus || currentValue">
        <div class="search-head">
          <form class="weui-search-bar__form" @submit.prevent="emitCompate('on-submit', currentValue)" action=".">
            <label
              :for="`search_input_${uuid}`"
              class="vux-search-mask"
              @click="touch"></label>
            <div class="weui-search-bar__box">
              <i class="weui-icon-search"></i>
              <input
                v-model="currentValue"
                ref="input"
                type="search"
                autocomplete="off"
                class="weui-search-bar__input"
                :id="`search_input_${uuid}`"
                :placeholder="placeholder"
                @focus="onFocus"
                @blur="onBlur"
                @compositionstart="onComposition($event, 'start')"
                @compositionend="onComposition($event, 'end')"
                @input="onComposition($event, 'input')"/> <!--@keyup.enter="emitCompate('on-submit', currentValue)"-->
              <a
                href="javascript:"
                class="weui-icon-clear"
                @click.stop="clear"
                v-show="currentValue"></a>
            </div>
          </form>
          <a
            href="javascript:"
            class="weui-search-bar__cancel-btn"
            @click.stop.prevent="cancel">{{$t('lan.cancel')}}
          </a>
        </div>
        <div class="search-content" v-show="!isCancel">
          <slot name="search"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
    export default {
      name: 'mx-search',
      props: {
        placeholder: {
          type: String,
          default: '搜索'
        }
      },
      data () {
        return {
          uuid: Math.random().toString(36).substring(3, 8),
          currentValue: '',
          isCancel: true,
          isFocus: false, // 输入 input 是否聚焦
          onInput: false, // 是否正在输入
        }
      },
      methods: {
        emitCompate (key, val) {
          this.$emit(key, val)
        },
        orgBack () {
          this.emitCompate('input', false)
        },
        /**
         * 往上冒泡事件
         */
        emitEvent () {
          this.$nextTick(() => {
            this.emitCompate('on-change', this.currentValue)
          })
        },
        touch () {
          this.isCancel = false
          this.emitCompate('on-touch')
        },
        /**
         * 使输入框聚焦
         */
        setFocus () {
          this.$refs.input.focus()
        },
        /**
         * 使输入框失去焦点
         */
        setBlur () {
          this.$refs.input.blur()
        },
        /**
         * 输入框聚焦
         */
        onFocus () {
          this.isFocus = true
          this.isCancel = false
          this.emitCompate('on-focus')
          this.touch()
          // this.$nextTick(() => {
          //   this.$refs.input.focus()
          // })
        },
        /**
         * 输入框失去焦点
         */
        onBlur () {
          this.isFocus = false
          this.emitCompate('on-blur')
        },
        /**
         * 事件触发于一段文字的输入之前、之后 （类似于 keydown 事件，但是该事件仅在若干可见字符的输入之前)
         * @param $event
         * @param type
         */
        onComposition ($event, type) {
          if (type === 'start') {
            this.onInput = true
          }
          if (type === 'end') {
            this.onInput = false
            this.emitEvent()
          }
          if (type === 'input') {
            if (!this.onInput) {
              this.emitEvent()
            }
          }
        },
        /**
         * 删除输入框的内容
         */
        clear () {
          this.currentValue = ''
          this.isFocus = true
          this.setFocus()
        },
        cancel () {
          this.isCancel = true
          this.isFocus = false
          this.currentValue = ''
          this.emitCompate('on-cancel')
        }
      }
    }
</script>

<style lang="less" scoped>
  @keyframes pullUp {
    from {
      transform: translate3d(0, 100%, 0);
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    animation: pullUp .3s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
    animation: pullUp .3s reverse;
  }
  @import '~vux/src/styles/weui/icon/weui_icon_font.less';
  @import '~vux/src/styles/weui/widget/weui_searchbar/weui_searchbar';
  @import '~vux/src/styles/weui/widget/weui_cell/weui_cell_global';
  @import '~vux/src/styles/weui/widget/weui_cell/weui_access';
  .weui-search-bar {
    height: .48rem;
    padding: .06rem .1rem;
    background-color: #fff;
    box-sizing: border-box;
    &:after {
      border: none;
    }
    .weui-search-bar__cancel-btn {
      text-decoration: none;
    }
    .vux-search-mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 90%;
      height: 100%;
      z-index: 5;
    }
    span {
      font-size: .13rem;
      color: #7F8389;;
    }
    .weui-search-bar__form:after {
      border: none;
    }
    .weui-search-bar__label {
      display: flex;
      align-items: center;
      justify-content: center;
      top: .08rem;
      bottom: .08rem;
      left: .1rem;
      right: .1rem;
      border-radius: .23rem;
      background-color: #f4f4f4;
    }
    .search-activate {
      z-index: 2;
      position: fixed;
      display: flex;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      flex-direction: column;
      background-color: #f4f4f4;
      .search-head {
        display: flex;
        height: .48rem;
        padding: .06rem .1rem;
        box-sizing: border-box;
        align-items: center;
      }
      .search-content {
        overflow: auto;
        flex: 1;
        background-color: #fff;
      }
      .weui-search-bar__cancel-btn {
        display: block;
      }
    }
  }
</style>
