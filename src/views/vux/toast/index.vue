<template>
  <div>
    <x-button type="primary" @click.native="showToast('success','primary','bottom')">primary</x-button>
    <x-button type="default" @click.native="showToast('warn','default','middle')">default</x-button>
    <x-button type="danger" @click.native="showToast('cancel','danger','top')">danger</x-button>
  </div>
</template><script>
import { XButton,Toast  } from 'vux'
export default {
  data() {
    return {}
  },
  components:{
    XButton,Toast 
  },
  methods: {
    showToast(type,msg, postion) {
      this.$vux.toast.show({
        type:type||"success",
        text: msg||'Loading',
        position:postion||'middle',
      })
    }
  }
}
</script>
<style>
</style>


