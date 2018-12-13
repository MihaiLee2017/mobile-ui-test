<template>
  <div class="vux-header">
    <div class="vux-header-left">
      <slot name="overwrite-left">
        <transition :name="transition">
          <a class="vux-header-back" @click.preventDefault v-show="_leftOptions.showBack" @click="onClickBack">{{ typeof _leftOptions.backText === 'undefined' ? $t('lan.back_text') : _leftOptions.backText}}</a>
        </transition>
        <transition :name="transition">
          <div class="left-arrow" @click="onClickBack" v-show="_leftOptions.showBack"></div>
        </transition>
      </slot>
      <slot name="left"></slot>
    </div>
    <h1 class="vux-header-title" @click="$emit('on-click-title')" v-if="!shouldOverWriteTitle">
      <slot>
        <transition :name="transition">
          <span v-show="title">{{title}}</span>
        </transition>
      </slot>
    </h1>
    <div class="vux-header-title-area" v-if="shouldOverWriteTitle">
      <slot name="overwrite-title"></slot>
    </div>
    <div class="vux-header-right">
      <a class="vux-header-more" @click.preventDefault @click="$emit('on-click-more')" v-if="rightOptions.showMore"></a>
      <slot name="right"></slot>
    </div>
  </div>
</template>



<script>
export default {
  name: 'mxHeader',
  props: {
    leftOptions: Object,
    title: String,
    transition: String,
    rightOptions: {
      type: Object,
      default () {
        return {
          showMore: false
        }
      }
    }
  },
  beforeMount () {
    if (this.$slots['overwrite-title']) {
      this.shouldOverWriteTitle = true
    }
  },
  computed: {
    _leftOptions () {
      return Object.assign({
        showBack: true,
        preventGoBack: false
      }, this.leftOptions || {})
    }
  },
  methods: {
    onClickBack () {
      if (this._leftOptions.preventGoBack) {
        this.$emit('on-click-back')
      } else {
        // this.$router ? this.$router.back() : window.history.back()
        this.$root.goBack()
      }
    }
  },
  data () {
    return {
      shouldOverWriteTitle: false
    }
  }
}
</script>

<style lang="less">
@import '../../assets/css/base/variable.less';
.vux-header {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 0 0;
  box-sizing: border-box;
  background-color: @theme-color;
}
.vux-header .vux-header-title {
  line-height: 44px;
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  color: @theme-font-color;
}
.vux-header-title-area, .vux-header .vux-header-title {
  margin: 0 88px;
  height: 44px;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.vux-header .vux-header-title > span {
  display: inline-block;
}
.vux-header .vux-header-left,.vux-header .vux-header-right {
  position: absolute;
  top: 14px;
  display: block;
  font-size: 14px;
  line-height: 20px;
  color: @theme-font-color;
}
.vux-header .vux-header-left a,.vux-header .vux-header-left button,.vux-header .vux-header-right a,.vux-header .vux-header-right button {
  float: left;
  margin-right: 8px;
  color: @theme-font-color;
}
.vux-header .vux-header-left a:active,.vux-header .vux-header-left button:active,.vux-header .vux-header-right a:active,.vux-header .vux-header-right button:active {
  opacity: .5
}
.vux-header .vux-header-left {
  left: 18px
}
.vux-header .vux-header-left .vux-header-back {
  padding-left: 16px
}
.vux-header .vux-header-left .left-arrow {
  position: absolute;
  width: 30px;
  height: 30px;
  top: -5px;
  left: -5px;
  &:before {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border: 1px solid @theme-font-color;
    border-width: 2px 0 0 2px;
    transform: rotate(315deg);
    top: 8px;
    left: 7px;
  }
}
.vux-header .vux-header-right {
  right: 15px
}
.vux-header .vux-header-right a,.vux-header .vux-header-right button {
  margin-left: 8px;
  margin-right: 0
}
.vux-header .vux-header-right .vux-header-more:after {
  content: "\2022\0020\2022\0020\2022\0020";
  font-size: 16px;
}
.vux-header-fade-in-right-enter-active {
  animation: fadeinR .5s;
}
.vux-header-fade-in-left-enter-active {
  animation: fadeinL .5s;
}
@keyframes fadeinR {
  0% {
    opacity: 0;
    transform: translateX(150px);
  }
  100% {
    opacity:1;
    transform:translateX(0);
  }
}
@keyframes fadeinL{
  0% {
    opacity: 0;
    transform: translateX(-150px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>