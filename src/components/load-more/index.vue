<template>
  <div class="loadmore">
    <div class="list-content"  :style="{ 'transform': transform }">
      <slot name="top-warp">
        <div class="top" v-if="topMethod">
          <spinner v-if="topStatus === 'loading'"   type="ios"></spinner>
          <span class="text">{{ topText }}</span>
        </div>
      </slot>
      <div class="content-warp">
        <slot></slot>
      </div>
      <slot name="bottom-warp">
        <div class="bottom" v-if="bottomMethod">
          <spinner v-if="bottomStatus === 'loading'"  type="ios"></spinner>
          <span  class="text">{{ bottomText }}</span>
        </div>
      </slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
.loadmore {
  overflow: hidden;
  position: relative;

  .list-content {
    .is-dropped {
      transition: 0.2s;
    }
    .content-warp {
      position: relative;
      overflow: scroll;
    }
  }

  .top-warp,
  .bottom-warp {
    text-align: center;
    height: 50px;
    line-height: 50px;
  }

  .top {
    text-align: center;
    margin-top: -50px;
  }

  .bottom {
    text-align: center;
    margin-bottom: -50px;
  }


  .text {
    text-align: center;
    height: 50px;
    line-height: 50px;
    vertical-align: middle;
  }
}
</style>

<script type="text/babel">
import { Spinner } from 'vux'
export default {
  name: 'load-more',
  components: {
    Spinner
  },

  props: {
    height: {
      type: String,
      default: '100%'
    },
    maxDistance: {
      type: Number,
      default: 0
    },
    autoFill: {
      type: Boolean,
      default: true
    },
    distanceIndex: {
      type: Number,
      default: 2
    },
    topPullText: {
      type: String,
      default: ''
    },
    topDropText: {
      type: String,
      default: ''
    },
    topLoadingText: {
      type: String,
      default: ''
    },
    topDistance: {
      type: Number,
      default: 70
    },
    topMethod: {
      type: Function
    },
    bottomPullText: {
      type: String,
      default: ''
    },
    bottomDropText: {
      type: String,
      default: ''
    },
    bottomLoadingText: {
      type: String,
      default: ''
    },
    bottomDistance: {
      type: Number,
      default: 70
    },
    bottomMethod: {
      type: Function
    },
    bottomAllLoaded: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      translate: 0,
      scrollEventTarget: null,
      containerFilled: false,
      topText: '',
      topDropped: false,
      bottomText: '',
      bottomDropped: false,
      bottomReached: false,
      direction: '',
      startY: 0,
      startScrollTop: 0,
      currentY: 0,
      topStatus: '',
      bottomStatus: ''
    }
  },
  computed: {
    transform() {
      return this.translate === 0
        ? null
        : 'translate3d(0, ' + this.translate + 'px, 0)'
    }
  },
  watch: {
    topStatus(val) {
      this.$emit('top-status-change', val)
      switch (val) {
        case 'pull':
          this.topText = this.topPullText === '' ? this.$t('lan.pullUp') : this.bottomPullText
          break
        case 'drop':
          this.topText = this.topDropText === '' ? this.$t('lan.Release') : this.bottomPullText
          break
        case 'loading':
          this.topText = this.topLoadingText === '' ? this.$t('lan.loading') : this.bottomPullText
          break
      }
    },
    bottomStatus(val) {
      this.$emit('bottom-status-change', val)
      switch (val) {
        case 'pull':
          this.bottomText = this.bottomPullText === '' ? this.$t('lan.pullDown') : this.bottomPullText
          break
        case 'drop':
          this.bottomText = this.bottomDropText === '' ? this.$t('lan.Release') : this.bottomPullText
          break
        case 'loading':
          this.bottomText = this.bottomLoadingText === '' ? this.$t('lan.loading') : this.bottomPullText
          break
      }
    }
  },
  methods: {
    onTopLoaded() {
      this.translate = 0
      setTimeout(() => {
        this.topStatus = 'pull'
      }, 200)
    },
    onBottomLoaded() {
      this.bottomStatus = 'pull'
      this.bottomDropped = false
      this.$nextTick(() => {
        if (this.scrollEventTarget === window) {
          document.body.scrollTop += 50
        }
        // } else {
        //   // this.scrollEventTarget.scrollTop += 50
        // }
        this.translate = 0
      })
      if (!this.bottomAllLoaded && !this.containerFilled) {
        this.fillContainer()
      }
    },
    setContentHeight() {
      let parent = this.$el.parentNode

      if (this.height.includes('%')) {
        let reg = new RegExp('%', 'g')
        let height = parseInt(this.height.replace(reg, ''))
        while (parent.clientHeight === 0 || window.screen.height < parent.clientHeight) {
          parent = parent.parentNode
        }
        this.$el.getElementsByClassName(
          'list-content'
        )[0].children[1].style.height =
          parseInt(parent.clientHeight * height / 100) + 'px'
      } else {
        let height = this.height.includes('px')
          ? this.height
          : this.height + 'px'
        this.$el.getElementsByClassName(
          'list-content'
        )[0].children[1].style.height = height
      }
    },
    getScrollEventTarget(element) {
      let currentNode = element
      // while (
      //   currentNode &&
      //   currentNode.tagName !== 'HTML' &&
      //   currentNode.tagName !== 'BODY' &&
      //   currentNode.nodeType === 1
      // ) {
      //   let overflowY = document.defaultView.getComputedStyle(currentNode).overflowY
      //   if (overflowY === 'scroll' || overflowY === 'auto') {
      //     return currentNode
      //   }
      //   currentNode = currentNode.parentNode
      // }
      if (
        currentNode &&
        currentNode.tagName !== 'HTML' &&
        currentNode.tagName !== 'BODY' &&
        currentNode.nodeType === 1
      ) {
        return currentNode
      }
      return window
    },

    getScrollTop(element) {
      if (element === window) {
        return Math.max(
          window.pageYOffset || 0,
          document.documentElement.scrollTop
        )
      } else {
        return element.getElementsByClassName('list-content')[0].children[1]
          .scrollTop
      }
    },

    bindTouchEvents() {
      this.$el.addEventListener('touchstart', this.handleTouchStart)
      this.$el.addEventListener('touchmove', this.handleTouchMove)
      this.$el.addEventListener('touchend', this.handleTouchEnd)
    },

    init() {
      this.setContentHeight()
      this.topStatus = 'pull'
      this.bottomStatus = 'pull'
      this.topText = this.topPullText
      this.scrollEventTarget = this.getScrollEventTarget(this.$el)
      if (typeof this.bottomMethod === 'function') {
        this.fillContainer()
        this.bindTouchEvents()
      }
      if (typeof this.topMethod === 'function') {
        this.bindTouchEvents()
      }
    },

    fillContainer() {
      if (this.autoFill) {
        this.$nextTick(() => {
          if (this.scrollEventTarget === window) {
            this.containerFilled =
              this.$el.getBoundingClientRect().bottom >=
              document.documentElement.getBoundingClientRect().bottom
          } else {
            this.containerFilled =
              this.$el.getBoundingClientRect().bottom <=
              // this.scrollEventTarget.getBoundingClientRect().bottom
              this.scrollEventTarget.getElementsByClassName('list-content')[0]
                .children[1].scrollHeight
          }
          if (!this.containerFilled) {
            this.bottomStatus = 'loading'
            this.bottomMethod()
          }
        })
      }
    },

    checkBottomReached() {
      if (this.scrollEventTarget === window) {
        return (
          document.body.scrollTop + document.documentElement.clientHeight >=
          document.body.scrollHeight
        )
      } else {
        // if (
        //   this.$el.clientHeight ==
        //   this.scrollEventTarget.getElementsByClassName('list-content')[0]
        //     .children[1].scrollHeight
        // ) {
        // }
        return (
          this.$el.clientHeight >=
          // this.scrollEventTarget.getBoundingClientRect().bottom + 1
          this.scrollEventTarget.getElementsByClassName('list-content')[0]
            .children[1].scrollHeight -
            this.scrollEventTarget.getElementsByClassName('list-content')[0]
              .children[1].scrollTop
        )
      }
    },

    handleTouchStart(event) {
      this.startY = event.touches[0].clientY
      this.startScrollTop = this.getScrollTop(this.scrollEventTarget)
      this.bottomReached = false
      if (this.topStatus !== 'loading') {
        this.topStatus = 'pull'
        this.topDropped = false
      }
      if (this.bottomStatus !== 'loading') {
        this.bottomStatus = 'pull'
        this.bottomDropped = false
      }
    },

    handleTouchMove(event) {
      if (
        this.startY < this.$el.getBoundingClientRect().top &&
        this.startY > this.$el.getBoundingClientRect().bottom
      ) {
        event.preventDefault()
        event.stopPropagation()
        return
      }
      this.currentY = event.touches[0].clientY
      let distance = (this.currentY - this.startY) / this.distanceIndex
      this.direction = distance > 0 ? 'down' : 'up'
      if (
        typeof this.topMethod === 'function' &&
        this.direction === 'down' &&
        this.getScrollTop(this.scrollEventTarget) === 0 &&
        this.topStatus !== 'loading'
      ) {
        event.preventDefault()
        event.stopPropagation()
        if (this.maxDistance > 0) {
          this.translate =
            distance <= this.maxDistance
              ? distance - this.startScrollTop
              : this.translate
        } else {
          this.translate = distance - this.startScrollTop
        }
        if (this.translate < 0) {
          this.translate = 0
        }
        this.topStatus = this.translate >= this.topDistance ? 'drop' : 'pull'
      }

      if (this.direction === 'up') {
        this.bottomReached = this.bottomReached || this.checkBottomReached()
      }
      if (
        typeof this.bottomMethod === 'function' &&
        this.direction === 'up' &&
        this.bottomReached &&
        this.bottomStatus !== 'loading' &&
        !this.bottomAllLoaded
      ) {
        event.preventDefault()
        event.stopPropagation()
        if (this.maxDistance > 0) {
          this.translate =
            Math.abs(distance) <= this.maxDistance
              ? this.getScrollTop(this.scrollEventTarget) -
                this.startScrollTop +
                distance
              : this.translate
        } else {
          this.translate =
            this.getScrollTop(this.scrollEventTarget) -
            this.startScrollTop +
            distance
        }
        if (this.translate > 0) {
          this.translate = 0
        }
        this.bottomStatus =
          -this.translate >= this.bottomDistance ? 'drop' : 'pull'
      }
      this.$emit('translate-change', this.translate)
    },

    handleTouchEnd() {
      if (
        this.direction === 'down' &&
        this.getScrollTop(this.scrollEventTarget) === 0 &&
        this.translate > 0
      ) {
        this.topDropped = true
        if (this.topStatus === 'drop') {
          this.translate = '50'
          this.topStatus = 'loading'
          this.topMethod()
        } else {
          this.translate = '0'
          this.topStatus = 'pull'
        }
        event.preventDefault()
        event.stopPropagation()
      }
      if (this.direction === 'up' && this.bottomReached && this.translate < 0) {
        this.bottomDropped = true
        this.bottomReached = false
        if (this.bottomStatus === 'drop') {
          this.translate = '-50'
          this.bottomStatus = 'loading'
          this.bottomMethod()
        } else {
          this.translate = '0'
          this.bottomStatus = 'pull'
        }
        event.preventDefault()
        event.stopPropagation()
      }
      this.$emit('translate-change', this.translate)
      this.direction = ''
    }
  },
  mounted() {
    this.init()
  }
}
</script>
