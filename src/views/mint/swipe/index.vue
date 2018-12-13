<template>
  <div class="swiper">
   <div class="swiper-demo">
      <mt-swipe :auto="4000">
      <mt-swipe-item><div class="item">1</div></mt-swipe-item>
      <mt-swipe-item><div class="item">2</div></mt-swipe-item>
      <mt-swipe-item><div class="item">3</div></mt-swipe-item>
    </mt-swipe> 
   </div>
  </div>
</template><script>
// import { Swipe, SwipeItem } from 'mint-ui'
export default {
  data() {
    return {
    }
  },
  components: {
    // Swipe, SwipeItem
  }
}
</script>
<style lang="less">
.swiper-demo{
  height: 200px;
  background-color: #ccc;
  .item{
    text-align: center;
    line-height: 200px;
    font-size: 22px;
  }
}
</style>



