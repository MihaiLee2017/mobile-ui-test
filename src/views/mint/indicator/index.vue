<template>
  <div>
    <mt-button type="default" @click="showIndicator('snake')">snake</mt-button>
    <mt-button type="default" @click="showIndicator('fading-circle')">fading-circle</mt-button>
    <mt-button type="default" @click="showIndicator('double-bounce')">double-bounce</mt-button>
    <mt-button type="default" @click="showIndicator('triple-bounce')">triple-bounce'</mt-button>
  </div>
</template><script>
import { Indicator } from 'mint-ui'
export default {
  data() {
    return {}
  },
  components: {
    Indicator
  },
  methods: {
    showIndicator(type, msg) {
      Indicator.open({
        text: type || 'Indicator test',
        spinnerType: type
      })
      setTimeout(() => {
        Indicator.close()
      }, 2000)
    }
  }
}
</script>
<style>
</style>


