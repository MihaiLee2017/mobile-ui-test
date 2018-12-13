<template>
  <div class="page-close">
    <slot>

    </slot>
  </div>
</template>
<style>
</style>
<script>
  import store from '../../store/index'
  export default{
    mounted(){
      store.commit('addPage', this)
    }
  }
</script>
