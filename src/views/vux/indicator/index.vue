<template>
  <div>
    <x-button type="primary" @click.native="showIndicator('primary')">primary</x-button>
  </div>
</template>
<script>
import { XButton  } from 'vux'
export default {
  data() {
    return {}
  },
  components: {
    XButton 
  },
  methods: {
    showIndicator(msg) {
     this.$vux.loading.show({
        text:'Loading'
    })
    
        console.log('hide')
      setTimeout(()=>{
        this.$vux.loading.hide()
      },2000)
    }
  }
}
</script>
<style>
</style>


