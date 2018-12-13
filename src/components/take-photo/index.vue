<template>
  <div>
    <actionsheet
      :menus="showMenus"
        @on-click-menu="clickMenus"
      v-model="sheetVisible" show-cancel>
    </actionsheet>
  </div>
</template>
<style>
</style>
<script>
import { Actionsheet } from 'vux'
  export default {
    name: 'takePhoto',
    props: {
      value: {
        type: Boolean,
        defaults: false
      },
      type: {
        type: Number,
        defaults: 2,
        required: false
      }
    }, // 接受图片地址
    data(){
      return {
        sheetVisible: false,
        // action sheet 选项内容
        base64Code: '',
        base64Url: ''
      }
    },
    components:{
      Actionsheet
    },
    computed: {
      showMenus () {
        if (this.type === 0) {
          return [{
              value: 0,
              label: this.$t('lan.photo')
            }]
        } else if (this.type === 1) {
          return [
            {
              value: 1,
              label: this.$t('lan.album')
            }]
        } else {
          return [{
              value: 0,
              label: this.$t('lan.photo')
            },
            {
              value: 1,
              label: this.$t('lan.album')
            }]
        }
      }
    },
    watch: {
      value(val){
        this.sheetVisible = val
      },
      sheetVisible (val) {
        this.$emit('input', val)
      }
    },
    mounted(){
      if (this.value) {
        this.sheetVisible = this.value
      }
    },
    methods: {
      clickMenus (index) {
        console.log('menus', index)
        if (index === 0) {
          this.getCamera()
        } else if (index === 1) {
          this.getLibrary()
        }
      },
      async getCamera(){
        const res = await this.$nativeApi.getPicture({sourceType: 1})
        this.base64Url = res.base64Url
        this.base64Code = res.base64Code
        this.getData()
      },
      async getLibrary(){
        const res = await this.$nativeApi.getPicture({sourceType: 0})
        this.base64Url = res.base64Url
        this.base64Code = res.base64Code
        this.getData()
      },
      async getData(){
        const data = {
          base64Url: this.base64Url,
          base64Code: this.base64Code
        }
        this.sheetVisible = false
        this.$emit('get-data', data)
        setTimeout(() => {
          this.$emit('input', false)
        }, 200)
      }
    }
  }
</script>
