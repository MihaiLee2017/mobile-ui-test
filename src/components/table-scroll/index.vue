<template>
<div class="table-warp">
  <div class="left-table">
    <table>
        <tr>
          <th>{{tableDatas.th[0]}}</th>
        </tr>
        <tr v-for="item in tableDatas.list"  :key="item.id">
          <td>{{item[tableDatas.fieldList[0]]}}</td>
        </tr>
    </table>
    </div>
    <div class="right-table">
      <table :cell-bordered="false">
          <tr>
            <th v-for="item in tableDatas.th" :key="item.id">{{item}}</th>
          </tr>
          <tr v-for="item in tableDatas.list" :key="item.id">
            <td v-for="field in tableDatas.fieldList" :key="field.id">{{item[field]}}</td>
          </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { Scroller, XTable } from 'vux'

export default {
  components: {
    Scroller,
    XTable
  },
  name: 'mx-table',
  props: {
    tableData: {
      type: Object
    },
    tableWidth: {
      type: Number
    }
  },
  data() {
    return {
      scrollWidth:
        this.tableWidth && this.tableWidth > screen.availWidth
          ? this.tableWidth
          : screen.availWidth,
      tableDatas: this.tableData
    }
  },
  computed: {},
  methods: {},
  created() {},
  mounted() {},
  watch: {
    'tableData': {
      handler (newVal, oldVal) {
        this.tableDatas = newVal
      },
      deep: true
    }
  }
}
</script>

<style lang="less">
@import '../../assets/css/index.less';
.table-warp {
  position: relative;
  .theme-bg;
  .left-table {
    width: 121px;
    float: left;
    position: absolute;
    .theme-bg;
    th {
      display: block;
      height: 41px;
    }
    td {
      white-space: normal;
      min-height: 40px;
      display: block;
    }
    table {
      position: relative;
    }
  }
  .right-table {
    width: ~"calc(100% - 0px)";
    overflow-x: auto;
    td {
      &:first-child {
        white-space: normal;
        min-height: 40px;
        width: 106px;
        display: block;
        border-right-width: 0px;
      }
    }
    th {
      &:first-child {
        display: block;
      }
    }
  }
  table {
    empty-cells: show;
    border-collapse: collapse;
    margin: 0;
    line-height: 40px;
    border-color: @theme-border-color;
    tr {
      &:first-child {
        .theme-tfont;
        .theme-cbg;
      }
    }
    th,
    td {
      text-align: left;
      padding: 0 5px 0 10px;
      font-size: 13px;
      border-width: 0 1px 1px 0;
      border-style: solid;
      border-color: @theme-border-color;
      &:first-child:after {
        border-right-width: 0px;
        border-color: @theme-border-color;
      }
    }
    th {
      white-space: nowrap;
      &:first-child {
        width: 106px;
      }
    }
    td {
      white-space: nowrap;
      &:first-child {
        width: 106px;
      }
    }
  }
}
</style>