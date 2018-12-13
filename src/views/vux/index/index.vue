<template>
  <div v-show="show">
    <!-- <cell title="Toast" value="Toast demo" to="/vux/index" is-link></cell> -->
    <cell v-for="(item) in cellList" :key="item.title" :title="item.title" :value="item.value" :link="item.toLink" is-link></cell>
  </div>
</template><script>
import { Cell } from 'vux'
export default {
  data() {
    return {
      show: false,
      cellList: [
        {
          title: 'Toast',
          value: 'Toast Demo',
          toLink: '/vux/toast'
        },
        {
          title: 'Indicator',
          value: 'Indicator Demo',
          toLink: '/vux/indicator'
        },
        {
          title: 'LoadMore',
          value: 'LoadMore  Demo',
          toLink: '/vux/loadmore'
        },
        {
          title: 'Swipe',
          value: 'Swipe Demo',
          toLink: '/vux/swipe'
        }
      ]
    }
  },
  components: {
    Cell
  },
  mounted() {
    setTimeout(() => {
      this.show = true
    }, 500)
  }
}
</script>
<style>
</style>


