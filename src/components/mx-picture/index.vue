<template>
  <div class="previewer">
    <div class="upload-img">
      <div class="img-size" v-for="(img, index) in imgList" :key="index" @click.stop.prevent="previewImg(index)">
        <img class="js-preview" :src="img.src"/>
        <img class="btn-del" src="./assets/delete-pic.png" @click.stop.prevent="delPic(index)"/>
      </div>
      <img class="img-size" src="./assets/btn_addpic.svg" v-show="showAdd"
           @click.stop.prevent="selectPic"/>
    </div>
    <div v-transfer-dom>
      <previewer :list.sync="imgList" ref="previewer" :options="options"></previewer>
    </div>

    <!-- 调用底座选图 -->
    <actionsheet v-model="showActionsheet" :menus="menus" @on-click-menu="clickMenu" show-cancel></actionsheet>
  </div>
</template>

<script>
  import { Previewer, TransferDom, Actionsheet } from 'vux'

  export default {
    name: 'mx-picture',
    props: {
      imgList: {
        type: Array,
        default: () => {
          return []
        }
      },
      maxPics: {  // 最大图片数
        type: Number,
        default: 5
      }
    },
    data () {
      return {
        showActionsheet: false, // 是否弹出actionsheet组件
        menus: {
          1: this.$t('lan.photo'),
          2: this.$t('lan.album')
        },
        options: {
          getThumbBoundsFn (index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll('.js-preview')[index]
            // get window scroll Y
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            // optionally get horizontal scroll
            // get position of element relative to viewport
            let rect = thumbnail.getBoundingClientRect()
            // w = width
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
            // Good guide on how to get element coordinates:
            // http://javascript.info/tutorial/coordinates
          }
        }
      }
    },
    directives: {
      TransferDom
    },
    components: {
      Previewer,
      Actionsheet
    },
    computed: {
      showAdd () {
        return this.imgList.length < this.maxPics
      }
    },
    methods: {
      /**
       * 预览图片
       * @param index
       */
      previewImg (index) {
        this.$refs.previewer.show(index)
      },
      /**
       * 点解选图，调用 actionSheet
       */
      selectPic () {
        this.showActionsheet = true
      },
      /**
       * 删除某选中图片
       * @param index 图片下标索引，并广播事件
       */
      delPic (index) {
        this.imgList.splice(index, 1)
        this.$emit('del-pic', index)
      },
      /**
       * 底座返回
       * @param pic Object
       */
      picSelected (pic) {
        this.imgList.push({
          w: 0,
          h: 0,
          src: pic.base64Url
        })
      },
      /**
       * actionsheet 的选中事件
       * @param key  1: '拍照', 2: '本地上传'
       */
      clickMenu (key) {
        this.$nativeApi.getPicture({
          sourceType: key // Camera.PictureSourceType 1:CAMERA 2:SAVEDPHOTOALBUM
        }).then((imgObj) => {
          this.picSelected(imgObj)
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .previewer {
    width: 100%;
  }
  .upload-img {
    display: -webkit-flex;
    display: flex;
    align-content: center;
    flex-wrap: wrap;
    width: 100%;
    min-height: .95rem;
    padding: .15rem .1rem .1rem .15rem;
    border-top: solid 1px rgba(217,217,217,.5);
    box-sizing: border-box;
    .img-size {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: .65rem;
      height: .65rem;
      margin-top: .05rem;
      margin-right: .05rem;
      margin-bottom: .05rem;
      border: solid 1px rgba(203,207,214,.6);
    }
    .js-preview {
      max-height: 100%;
      max-width: 100%;
    }
    .btn-del {
      position: absolute;
      top: -.1rem;
      right: 0;
      width: .2rem;
    }
  }
</style>
