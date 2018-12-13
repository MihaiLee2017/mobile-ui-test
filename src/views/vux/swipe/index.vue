<template>
  <div class="swiper">
   <div class="swiper-demo">
      <swiper :aspect-ratio="300/800">
        <swiper-item class="swiper-demo-img" v-for="(item, index) in baseList" :key="index"><img :src="item">
        </swiper-item>
      </swiper>
   </div>
  </div>
</template><script>
import { Swiper,SwiperItem } from 'vux'
export default {
  data() {
    return {
      index:0,
      baseList : [ 
        'https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg',
        'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg',
        'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg'
        ]
    }
  },
  components: {
    Swiper,
    SwiperItem
  }
}
</script>
<style lang="less">
.swiper-demo-img img {
  width: 100%;
}
</style>



