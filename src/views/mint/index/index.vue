<template>
  <div v-show="show">
    <!-- <cell title="Toast" value="Toast demo" to="/vux/index" is-link></cell> -->
    <mt-cell v-for="(item) in cellList" :key="item.title" :title="item.title" :value="item.value" :to="item.toLink" is-link></mt-cell>
  </div>
</template><script>
// import { Cell } from 'mint-ui'
export default {
  data() {
    return {
      show: false,
      cellList: [
        {
          title: 'Toast',
          value: 'Toast Demo',
          toLink: '/mint/toast'
        },
        {
          title: 'Indicator',
          value: 'Indicator Demo',
          toLink: '/mint/indicator'
        },
        {
          title: 'LoadMore',
          value: 'LoadMore  Demo',
          toLink: '/mint/loadmore'
        },
        {
          title: 'Swipe',
          value: 'Swipe Demo',
          toLink: '/mint/swipe'
        }
      ]
    }
  },
  components: {
    // Cell
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


