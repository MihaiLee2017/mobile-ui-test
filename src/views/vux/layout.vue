<template>
  <div id="indexApp">
    <mx-header>VUX DEMO</mx-header>
    <div class="content" ref="homeScroll">
      <transition :name="transitionName">
        <navigation>
          <router-view class="router-view">
          </router-view>
        </navigation>
      </transition>
    </div>
  </div>
</template>
<style lang="less" scoped>
</style>
<script>
import MxHeader from '../../components/mx-header'
export default {
  data() {
    return {
      exclude: '',
      transitionName: 'pop-' + (this.direction === 'reverse' ? 'out' : 'in')
    }
  },
  components: {
    MxHeader
  },
  mounted() {},
  computed: {
    ...mapGetters({
      loading: 'getLoading',
      direction: 'getDirection',
      getHomePos: 'getHomePos' //vuex中的存放的滚动条的位置
    })
  },
  methods: {
    ...mapActions(['getLogin']),
    recordScrollPosition(e) {
      this.$store.dispatch('updateHomePos', e.target.scrollTop) //实时存入到vuex中
    }
  },
  activated() {
    //滚动条位置的监听放到activated是因为此页面被keep-alive缓存了
    this.$refs.homeScroll.scrollTop = this.getHomePos //this.$refs.scroll拿到滚动的dom，即scrollContainer，this.home_list_top是存入到vuex里的值
    this.$refs.homeScroll.addEventListener('scroll', this.recordScrollPosition) //添加绑定事件
  },
  deactivated() {
    //keep-alive 的页面跳转时，移除scroll事件
    this.$refs.homeScroll.removeEventListener(
      'scroll',
      this.recordScrollPosition
    ) //清除绑定的scroll事件
  },
  watch: {
    direction(val) {
      if (val === 'forward') {
        this.transitionName = 'pop-in'
      } else {
        this.transitionName = 'pop-out'
      }
    }
  }
}
</script>
