<template>
  <div class="loadmore">
    <!-- <cell v-for="(item,index) in cellList" :key="index" :title="item.title" :value="item.value" :to="item.toLink" is-link></cell> -->
    <mt-loadmore :autoFill="autoFill" :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
      <ul>
        <li v-for="(item,index) in cellList" :key="index">{{item.value}}</li>
      </ul>
    </mt-loadmore>
  </div>
</template><script>
// import { Loadmore  } from 'mint-ui'
let list = [
  {
    title: 'Toast',
    value: 'Toast Demo',
    toLink: '/vux/toast'
  },
  {
    title: 'Indicator ',
    value: 'Indicator  Demo',
    toLink: '/vux/indicator '
  },
  {
    title: 'LoadMore ',
    value: 'LoadMore  Demo',
    toLink: '/vux/loadmore '
  },
  {
    title: 'Swipe',
    value: 'Swipe Demo',
    toLink: '/vux/swipe'
  }
]
export default {
  data() {
    return {
      autoFill: true,
      isLoading: false,
      allLoaded: false,
      cellList: [...list]
    }
  },
  components: {
    // Loadmore
  },
  methods: {
    loadTop() {
      setTimeout(() => {
        this.cellList = [...list]
             setTimeout(()=>{
        this.$refs.loadmore.onTopLoaded()
        },60)
      }, 1500)
    },
    loadBottom() {
      setTimeout(() => {
        this.cellList = this.cellList.concat(list)
        if (this.cellList.length > 100) {
          this.allLoaded = true
        }
            setTimeout(()=>{
          this.$refs.loadmore.onBottomLoaded()
        },60)
        // this.$nextTick(()=>{
        // })
      }, 1500)
    }
  }
}
</script>
<style lang="less">
.loadmore {
  height: 100%;
  overflow:scroll;
  ul {
    padding: 0;
    margin: 0;
    li {
      line-height: 50px;
      text-align: center;
      border-bottom: 1px solid #ccc;
      background-color: #fff;
    }
  }
}
</style>


