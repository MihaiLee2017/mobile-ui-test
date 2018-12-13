<template>
  <div class="search-box " :class="{'search-box-full':full}" :style="{background:background}">
    <div class="keyword">
      <input v-if="full" placeholder="" v-model="query.keyword" :id="keywordId" @keyup="search()">
      <input v-else placeholder="搜索" v-model="query.keyword">
      <div v-if="placeholder&&query.keyword.trim().length===0&&full" @click="focus()" class="placeholder">搜索
      </div>
    </div>
    <div v-if="query.keyword.trim().length>0" class="clear-icon " @click="clearKeyword()"></div>
    <div v-if="!full" class="search-icon" @click="search()">
    </div>
  </div>

</template>
<style lang="less" scoped>
  @border-color: #e3e3e3;
  .search-box {
    position: relative;
    width: 100%;
    padding: 0 10px 0 15px;
    background: #fff;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;

    &.search-box-full {
      content: '';
      .keyword {
        input {

        }
        .placeholder {
          background: url(../../assets/img/search.png) no-repeat center;
          background-size: 16px;
          position: absolute;
          background-position-x: ~'calc(50% - 20px)';
          width: ~'calc(100% - 26px)';
          height: 30px;
          line-height: 30px;
          left: 15px;
          top: 5px;
          font-size: 12px;
          color: #9c9fa4;
        }
      }

      .clear-icon {
        right: 15px;
      }
    }
    .keyword {
      flex: 1;
      input {
        width: 100%;
        height: 30px;
        margin-top: 5px;
        line-height: 30px;
        box-sizing: border-box;
        border: 1px solid @border-color;
        border-radius: 20px;
        text-align: center;
        outline: none;
        padding: 0 30px 0 15px;
      }
    }

    .search-icon {
      width: 30px;
      height: 30px;
      margin: 5px 0 0 5px;
      line-height: 30px;
      text-align: center;
      background: url(../../assets/img/search.png) no-repeat center;
      background-size: 20px;
    }

    .clear-icon {
      position: absolute;
      top: 6px;
      right: 50px;
      width: 26px;
      height: 26px;
      background: url(../../assets/img/clear.png) no-repeat center;
      background-size: 15px;
    }
  }
</style>
<script>
  /**
   * 搜索框
   *
   * props{
   *  full:Bollean是否为全宽搜索
   * }
   *
   * events{
   *    search:搜索事件,
   *    clearKeyword:clearKeyword
   * }
   *
   *使用方式
   import searchBox from '../../components/search-box/index.vue'
     export default{
      data(){
        return {
        }
      },
      components: {searchBox},
      methods: {
        //搜索事件
        search(keyword){
        },
        //清空文字事件
        clearKeyword(keyword){
        }
      }
    }
   <template>
     <search-box :full="true" @search="search" @clear-keyword="clearKeyword">

     </search-box>
   </template>
   */

  export default{
    data(){
      return {
        placeholder: true,
        keywordId: `keyword${new Date() * 1}`,
        homeTitle: '消息',//新闻标题
        query: {
          keyword: ''
        }
      }
    },
    props: {
      full: {
        type: Boolean,
        defaults: false
      },
      background: {
        type: String,
        defaults: "#fff"
      }
    },
    components: {},
    mounted(){

    },
    methods: {
      focus(){
        // this.placeholder = false
        $(`#${this.keywordId}`).focus()
      },
      clearKeyword(){
        console.log('clear-keyword')
        this.query.keyword = ''
        this.$emit('clear-keyword', this.query.keyword)
      },
      search(){
        console.log('search')
        this.$emit('search', this.query.keyword)
      },
    }
  }
</script>
