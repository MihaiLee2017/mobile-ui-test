<template>
  <div class="none-tip">
    <img src="./assets/none.svg" alt="">
    <slot><div class="default">{{$t('lan.noneTip')}}</div></slot>
  </div>
</template>
<script>
  /**
   * none-tip.vue
   * @authors zhaolun.he@meicloud.com
   */
  export default {
    name: 'none-tip',
    components: {
    },
    props: {
    },
    data () {
      return {
      }
    },
    computed: {

    },
    methods: {
    }
  }
</script>
<style lang="less">
  .none-tip {
    flex: 1;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #666;
    font-size: .14rem;
    img {
      width: 30%;
    }
    div {
      color: #999;
      text-align: center;
    }
    .default {
      margin-top: .2rem;
      color: #999;
    }
  }
</style>
