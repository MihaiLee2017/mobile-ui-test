<template>
  <div>
    <!-- <cell title="Toast" value="Toast demo" to="/vux/index" is-link></cell> -->
    <cell v-for="(item,index) in cellList" :key="index" :title="item.title" :value="item.value" :to="item.toLink" is-link></cell>
  </div>
</template><script>
import { Cell } from 'mint-ui'
export default {
  data() {
    return {
      cellList: [
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
    }
  },
  components: {
    Cell
  }
}
</script>
<style>
</style>


