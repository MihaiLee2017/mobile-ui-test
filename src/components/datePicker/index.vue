<template>
  <div class="date-picker" @click="showDate">
    <div :class="computeClass" class="content">
      <div class="input">
        <input v-model="time" readonly/>
      </div>
      <div class="icon" v-if="!noIcon">
        <i aria-hidden="true"></i>
      </div>
    </div>
  </div>
</template>
<style>

</style>
<script>
  /*
   * h5日期组件（基于date-time-picker）
   * 参数：
   *    @type  控件类型{date:日期控件，fate-time:日期时间}
   *    v-model model值
   *    @picker-class 自定义样式class
   */


  /*
   * 使用示例
   *
   *    import datePicker from '../components/datePicker'
   *
   *    <date-picker
   *        v-model="date"
   *        type="date-time"
   *        picker-class="picker">
   *    </date-picker>
   *
   * */

  import datePicker from 'date-time-picker'
  import './css/index.less'
  export default{
    name: 'datePicker',
    props: {
      // 时间值
      value: {
        type: String,
        default: ''
      },
      // 是否需要icon
      noIcon: {
        type: Boolean,
        default: false
      },
      // 自定义样式class
      pickerClass: {
        type: String,
        default: ''
      },
      // 控件類型
      type: {
        type: String,
        default: 'date'// date,time
      },
      // 最小日期
      minDate: {
        type: String,
        default: ''
      },
      // 最大日期
      maxDate: {
        type: String,
        default: ''
      },
      // 最小时间
      minTime: {
        type: String,
        default: ''
      },
      // 最大时间
      maxTime: {
        type: String,
        default: ''
      }
    },
    data(){
      return {
        time: ''
      }
    },
    components: {},
    computed: {
      /**
       * 控件样式计算
       * @returns {string}
       */
      computeClass(){
        let className = ''
        if (this.type === 'date-time') {
          className += 'date-time'
        }
        if (this.pickerClass) {
          className += ' ' + this.pickerClass
        }
        if (this.noIcon) {
          className += ' no-icon'
        }

        return className
      }
    },
    watch: {
      value(val){
        this.time = this.getTime()
      }
    },
    mounted(){
      console.log(this.$tools)
      this.time = this.getTime()
    },
    methods: {
      /**
       * 时间格式及空值判断
       */
      getTime () {
        // 日期正则
        const regDate = /^((((1[6-9]|[2-9]\d)\d{2})(\/|\-)(0?[13578]|1[02])(\/|\-)(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})(\/|\-)(0?[13456789]|1[012])(\/|\-)(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})(\/|\-)0?2(\/|\-)(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))$/
        // 日期时间正则
        const regDateTime = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/

        // 正则申明
        const objExpDate = new RegExp(regDate)
        const objExpDateTime = new RegExp(regDateTime)
        // 判断model是否符合规则及type是否符合
        console.log(this.type)
        if ((this.type === 'date' && objExpDate.test(this.value)) || (this.type === 'date-time' &&
          objExpDateTime.test(this.value + ':00'))) {
          return this.value
        } else if (this.value.length === 0) {
          if (this.type === 'date') {
            return this.$tools.formatDate(new Date(), 'yyyy-MM-dd')
          } else if (this.type === 'date-time') {
            return this.$tools.formatDate(new Date(), 'yyyy-MM-dd hh:mm')
          } else {
            throw new Error('组件参数不对！type只有两种参数date和date-time')
          }
        } else if (this.type !== 'date' && this.type !== 'date-time') {
          throw new Error('组件参数不对！type只有两种参数date和date-time')
        } else {
          throw new Error('日期格式不正确！')
        }
      },
      /**
       * 显示时间框
       */
      showDate () {
        console.log('showDate')
        const self = this
        // 日期配置
        const optionDate = {
          lang: 'zh-CN',
          format: 'yyyy-MM-dd',
          default: self.time,
          min: this.minDate,
          max: this.maxDate
        }
        // 日期时间配置
        const optionDateTime = {
          lang: 'zh-CN',
          format: 'HH:mm',
          default: self.time,
          min: this.minTime,
          max: this.maxTime
        }
        const dP = new datePicker.Date(optionDate)
        dP.on('selected', (formatDate, nowDate) => {
          if (self.type === 'date') {// 时控件直接赋值
            self.time = formatDate
            // 改变model值
            this.$emit('input', self.time)
          } else {// 日期时间控件则弹出时间框
            const tp = new datePicker.Time(optionDateTime)
            tp.on('selected', (formatTime, nowTime) => {
              console.log(formatDate + ' ' + formatTime + ':00')
              self.time = formatDate + ' ' + formatTime
              // 改变model值
              this.$emit('input', self.time)
            })
          }
        })
      }
    },
  }
</script>
