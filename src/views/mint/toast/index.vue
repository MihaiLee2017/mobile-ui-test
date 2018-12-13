<template>
  <div>
    <mt-button type="default" @click="showToast('default','middle')">default</mt-button>
    <mt-button type="primary" @click="showToast('primary','bottom')">primary</mt-button>
    <mt-button type="danger" @click="showToast('danger','top')">danger</mt-button>
  </div>
</template><script>
import { Toast } from 'mint-ui'
export default {
  data() {
    return {}
  },
  methods: {
    showToast(msg, postion) {
      Toast({
        message: msg || 'toast test',
        position: postion || 'middle',
        duration: 2000
      })
    }
  }
}
</script>
<style>
</style>