<template>
  <div class="org-select" v-show="value">
    <popup v-model="value" height="100%">
      <!-- 头部 -->
      <mx-header :left-options="{preventGoBack: true}" @on-click-back="orgBack">
        {{$t('lan.orgTitle')}}
      </mx-header>
      <!-- 搜素框 -->
      <div
        class="weui-search-bar"
        :class="{'weui-search-bar_focusing': !isCancel || currentValue}">
        <form class="weui-search-bar__form" @submit.prevent="emitCompate('on-submit', currentValue)" action=".">
          <label
            :for="`search_input_${uuid}`"
            class="vux-search-mask"
            @click="touch"></label>
          <div class="weui-search-bar__box">
            <i class="weui-icon-search"></i>
            <input
              v-model="currentValue"
              ref="input"
              type="search"
              autocomplete="off"
              class="weui-search-bar__input"
              :id="`search_input_${uuid}`"
              :placeholder="placeholder"
              @focus="onFocus"
              @blur="onBlur"
              @keyup.enter="searchEmployee"
              @compositionstart="onComposition($event, 'start')"
              @compositionend="onComposition($event, 'end')"
              @input="onComposition($event, 'input')"/>
            <a
              href="javascript:"
              class="weui-icon-clear"
              @click.stop="clear"
              v-show="currentValue"></a>
          </div>
          <label
            :for="`search_input_${uuid}`"
            class="weui-search-bar__label"
            v-show="!isFocus && !currentValue">
            <i class="weui-icon-search"></i>
            <span>{{ placeholder }}</span>
          </label>
        </form>
        <a
          href="javascript:"
          class="weui-search-bar__cancel-btn"
          @click="cancel">{{$t('lan.cancel')}}
        </a>
      </div>
      <!-- 页面内容 -->
      <div class="org-content">
        <!-- 选取组织架构的样式 -->
        <div class="org-static" v-show="isCancel">
          <!-- 已选中的组织展示 -->
          <div class="org-nav">
            <div class="nav" ref="orgNav">
              <div class="org-item" v-for="(org, index) in navList" :key="org.orgUnitId"
                   @click.stop="selectNav(index)" :id="org.orgUnitId">{{ org.orgUnitName }}</div>
            </div>
          </div>
          <!-- 组织架构默认带出的项 -->
          <div class="org-list">
            <group >
              <cell-box v-for="(item, index) in currentChildren" :key="index" @click.native="selectOrgOrEmployee(item)">
                <img class="avatar" src="./assets/user-img.png" v-if="item.hasOwnProperty('employeeId')"/>
                <x-icon type="android-menu" class="avatar" v-if="item.hasOwnProperty('orgUnitCode')"></x-icon>
                {{ item.hasOwnProperty('orgUnitCode') ? item.orgUnitName : `${item.employeeName}(${item.employeeCode})`}}
                <x-icon type="ios-circle-outline" class="no-select"
                        v-if="item.hasOwnProperty('employeeCode') && !employeeSelected.hasOwnProperty(item.employeeId)"></x-icon>
                <x-icon type="ios-checkmark" class="selected"
                        v-if="item.hasOwnProperty('employeeCode') && employeeSelected.hasOwnProperty(item.employeeId)"></x-icon>
              </cell-box>
            </group>
            <!-- 查询无数据 -->
            <none-tip v-show="currentChildren.length === 0">{{$t('lan.searchNoData')}}</none-tip>
          </div>
        </div>
        <!-- 搜索内容展示 -->
        <transition name="fade">
          <div class="org-search" v-show="!isCancel">
            <div
              class="weui-cell weui-cell_access"
              v-for="(item, index) in searchResults"
              @click="selectEmployee(item)">
              <div class="weui-cell__bd weui-cell_primary">
                <img class="avatar" src="./assets/user-img.png"/>
                <p>{{`${item.employeeName}(${item.employeeCode})`}}</p>
                <x-icon type="ios-circle-outline" class="no-select"
                        v-if="item.hasOwnProperty('employeeCode') && !employeeSelected.hasOwnProperty(item.employeeId)"></x-icon>
                <x-icon type="ios-checkmark" class="selected"
                        v-if="item.hasOwnProperty('employeeCode') && employeeSelected.hasOwnProperty(item.employeeId)"></x-icon>
              </div>
            </div>
            <!-- 查询无数据 -->
            <none-tip v-show="searchResults.length === 0">{{$t('lan.searchNoData')}}</none-tip>
          </div>
        </transition>
      </div>
      <!-- 选中的人 -->
      <div class="employee-selected" v-show="selectedCount > 0 && multi">
        <div class="org-nav">
          <!-- 选中人的区域 -->
          <div class="nav">
            <div class="org-item employee" v-for="(value, key) in employeeSelected" :key="key"
                 @click.stop="delEmployeeSelected(key)" :id="key">
              <div class="avatar">
                <img class="user" src="./assets/user-img.png"/>
                <img class="btn-del" src="./assets/delete-pic.png"/>
              </div>
              <div class="name">{{ value.employeeName }}</div>
            </div>
          </div>
        </div>
        <!-- 完成按钮区域 -->
        <div class="finish-selected">
          <span @click.stop="finishSelected">{{$t('lan.finish')}}({{selectedCount}})</span>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
  import { Popup, Group, CellBox } from 'vux'
  import MxHeader from '../../components/mx-header'
  import NoneTip from '../none-tip'
  export default {
    name: 'org-selection',
    props: {
      value: { // 组件是否展示
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: '搜索'
      },
      multi: { // 是否多选，默认单选，返回object，多选返回数组
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        uuid: Math.random().toString(36).substring(3, 8),
        currentValue: '',
        isCancel: true,
        isFocus: false, // 输入 input 是否聚焦
        onInput: false, // 是否正在输入
        navList: [], // 导航栏信息
        currentChildren: [], // 当前节点的部门信息
        searchResults: [], // 搜素的人员列表
        employeeSelected: {}, // 已选中的人员
        orgBaseNode: {}
      }
    },
    components: {
      NoneTip,
      Popup,
      Group,
      CellBox,
      MxHeader
    },
    computed: {
      /*
       * 是否有选中
       */
      selectedCount () {
        return Object.keys(this.employeeSelected).length
      }
    },
    watch: {
    },
    methods: {
      emitCompate (key, val) {
        this.$emit(key, val)
      },
      orgBack () {
        this.emitCompate('input', false)
      },
      /**
       * 往上冒泡事件
       */
      emitEvent () {
        this.$nextTick(() => {
          this.emitCompate('on-change', this.currentValue)
        })
      },
      touch () {
        this.isCancel = false
        this.emitCompate('on-touch')
      },
      /**
       * 使输入框聚焦
       */
      setFocus () {
        this.$refs.input.focus()
      },
      /**
       * 使输入框失去焦点
       */
      setBlur () {
        this.$refs.input.blur()
      },
      /**
       * 输入框聚焦
       */
      onFocus () {
        this.isFocus = true
        this.emitCompate('on-focus')
        this.touch()
      },
      /**
       * 输入框失去焦点
       */
      onBlur () {
        this.isFocus = false
        this.emitCompate('on-blur')
      },
      /**
       * 事件触发于一段文字的输入之前、之后 （类似于 keydown 事件，但是该事件仅在若干可见字符的输入之前)
       * @param $event
       * @param type
       */
      onComposition ($event, type) {
        if (type === 'start') {
          this.onInput = true
        }
        if (type === 'end') {
          this.onInput = false
          this.emitEvent()
        }
        if (type === 'input') {
          if (!this.onInput) {
            this.emitEvent()
          }
        }
      },
      /**
       * 删除输入框的内容
       */
      clear () {
        this.currentValue = ''
        this.isFocus = true
        this.setFocus()
      },
      cancel () {
        this.isCancel = true
        this.currentValue = ''
        this.emitCompate('on-cancel')
      },
      /**
       * 获取根节点信息
       */
      getOrg () {
        let _self = this
        // 是否已经请求过节点
        if (_self.orgBaseNode.hasOwnProperty('orgUnitId')) {
          // 页面内数据处理
          _self.navList = []
          _self.navList.push(_self.orgBaseNode)
          _self.getOrgAndEmployee(_self.orgBaseNode.orgUnitId)
        } else {
          // TODO: 此处是请求接口获取数据，获取根节点数据，下面给出一组示例，真是环境可根据具体的逻辑调整
          // Step1: 接口获取数据
          let rootNode = {
            orgUnitId: 'f07866b8737a42c697cf4bcace24e6ea', // 唯一标记
            orgUnitCode: '10000000', // 公司编码
            orgType: '1',
            parentId: '-1',
            path: null,
            orgPathName: 'xxx公司',
            orgShortName: 'xxx公司',
            orgUnitName: 'xxx公司', // 公司名称
            orgTier: 1,
            hiberarchy: '1',
            isParent: 1,
            effectiveDate: 631123200000,
            status: '1',
            childAndParent: null,
            createBy: null,
            createDate: null,
            lastUpdateBy: null,
            lastUpdateDate: null
          }

          // Step2: 页面内数据处理
          // 页面内数据处理
          _self.navList = []
          _self.navList.push(rootNode)
          // 获取节点下面的组织和人员
          _self.getOrgAndEmployee(rootNode.orgUnitId)
        }
      },
      /**
       * 保存 sessionStorage
       * @param orgUnitId 组织代码
       * @param type 组织或人员 org 或 employee
       * @param data 数据
       */
      saveTree (orgUnitId, type, data) {
        let treeMap = {}
        // 没数据时不继续操作
        if (data.length === 0) {
          return
        }

        // 有数据，继续后面的操作
        if (sessionStorage.hasOwnProperty('orgTree')) {
          treeMap = JSON.parse(sessionStorage.getItem('orgTree'))
          if (treeMap.hasOwnProperty(orgUnitId)) {
            // 已经存在项
            if (treeMap[orgUnitId].hasOwnProperty(type)) {
              treeMap[orgUnitId][type] = data
            } else {
              treeMap[orgUnitId][type] = data
            }
          } else {
            // 不存在项
            treeMap[orgUnitId] = {}
            treeMap[orgUnitId][type] = data
          }
        } else {
          // 首次保存组织架构树
          treeMap[orgUnitId] = {}
          treeMap[orgUnitId][type] = data
        }
        sessionStorage.setItem('orgTree', JSON.stringify(treeMap))
      },
      /**
       * 获取组织
       * @param orgUnitId
       * @returns {*}
       */
      getNodeOrg (orgUnitId) {
        let _self = this
        // TODO: 此函数是根据点解的组织，获取下次组织架构（部门），此给出demo的例子，函数按实际情况处理
        let nodeDemo = [
          {
            orgUnitId: 'de03bf3a49d24e6aa24d1668ff20890d',
            orgUnitCode: '10000001',
            orgType: '9',
            parentId: 'f07866b8737a42c697cf4bcace24e6ea',
            path: null,
            orgPathName: 'xxxx公司_公司总部',
            orgShortName: '公司总部',
            orgUnitName: '公司总部',
            orgTier: 2,
            hiberarchy: '1',
            isParent: 1,
            effectiveDate: 631123200000,
            status: '1',
            childAndParent: null,
            createBy: null,
            createDate: null,
            lastUpdateBy: null,
            lastUpdateDate: null
          },
          {
            orgUnitId: '457b4ca697f14c7fac8b49d284132c21',
            orgUnitCode: '14000000',
            orgType: '9',
            parentId: 'f07866b8737a42c697cf4bcace24e6ea',
            path: null,
            orgPathName: 'xxxx公司_安徽大区',
            orgShortName: '安徽大区',
            orgUnitName: '安徽大区',
            orgTier: 2,
            hiberarchy: '1',
            isParent: 1,
            effectiveDate: 1372608000000,
            status: '1',
            childAndParent: null,
            createBy: null,
            createDate: null,
            lastUpdateBy: null,
            lastUpdateDate: null
          },
          {
            orgUnitId: 'fe7455351d324de39533f45ec2c4194b',
            orgUnitCode: '17000000',
            orgType: '9',
            parentId: 'f07866b8737a42c697cf4bcace24e6ea',
            path: null,
            orgPathName: 'xxxx公司_分子公司',
            orgShortName: '分子公司',
            orgUnitName: '分子公司',
            orgTier: 2,
            hiberarchy: '1',
            isParent: 1,
            effectiveDate: 631123200000,
            status: '1',
            childAndParent: null,
            createBy: null,
            createDate: null,
            lastUpdateBy: null,
            lastUpdateDate: null
          },
          {
            orgUnitId: 'e647bf3318e44b50b5da16f90f8a9137',
            orgUnitCode: '50551782',
            orgType: '3',
            parentId: 'f07866b8737a42c697cf4bcace24e6ea',
            path: null,
            orgPathName: 'xxxx公司_第二业务集群',
            orgShortName: '第二业务集群',
            orgUnitName: '第二业务集群',
            orgTier: 2,
            hiberarchy: '1',
            isParent: 1,
            effectiveDate: 1438358400000,
            status: '1',
            childAndParent: null,
            createBy: null,
            createDate: null,
            lastUpdateBy: null,
            lastUpdateDate: null
          },
          {
            orgUnitId: '8879365233df40099f5a123e4564e1f1',
            orgUnitCode: '50587078',
            orgType: '3',
            parentId: 'f07866b8737a42c697cf4bcace24e6ea',
            path: null,
            orgPathName: 'xxxx公司_第一业务集群',
            orgShortName: '第一业务集群',
            orgUnitName: '第一业务集群',
            orgTier: 2,
            hiberarchy: '1',
            isParent: 1,
            effectiveDate: 1441036800000,
            status: '1',
            childAndParent: null,
            createBy: null,
            createDate: null,
            lastUpdateBy: null,
            lastUpdateDate: null
          },
          {
            orgUnitId: 'db05a6698fd24111bd05146d4f68ae13',
            orgUnitCode: '50676846',
            orgType: '3',
            parentId: 'f07866b8737a42c697cf4bcace24e6ea',
            path: null,
            orgPathName: 'xxxx公司_第三业务集群',
            orgShortName: '第三业务集群',
            orgUnitName: '第三业务集群',
            orgTier: 2,
            hiberarchy: '1',
            isParent: 1,
            effectiveDate: 1456761600000,
            status: '1',
            childAndParent: null,
            createBy: null,
            createDate: null,
            lastUpdateBy: null,
            lastUpdateDate: null
          },
          {
            orgUnitId: 'd956d7f9adb04914a0f5e42668a2a1d9',
            orgUnitCode: '50922255',
            orgType: '3',
            parentId: 'f07866b8737a42c697cf4bcace24e6ea',
            path: null,
            orgPathName: 'xxxx公司_云商',
            orgShortName: 'x商',
            orgUnitName: 'x商',
            orgTier: 2,
            hiberarchy: '1',
            isParent: 1,
            effectiveDate: 1504195200000,
            status: '1',
            childAndParent: null,
            createBy: null,
            createDate: null,
            lastUpdateBy: null,
            lastUpdateDate: null
          }
        ]

        if (_self.currentChildren.length > 0) {
          // 已经先请求了职工
          let org = nodeDemo || []
          org = org.concat(_self.currentChildren)
          _self.currentChildren = org
        } else {
          // 先返回组织
          _self.currentChildren = nodeDemo || []
        }
        _self.saveTree(orgUnitId, 'org', nodeDemo)
      },
      /**
       * 获取组织下面的员工
       * @param orgUnitId
       * @returns {*}
       */
      getNodeEmployee (orgUnitId) {
        let _self = this
        // TODO: 此根据节点获取节点下面的人员信息，具体函数以实际为准，下面给出了示例
        let people = [
          {
            employeeId: '2bde7b2bde264fad8ed2f0bf02375531',
            employeeName: '林小芳',
            employeeCode: '8000633',
            employeeStatus: '2',
            idNumber: null,
            unitId: 'f2aad3d065654c24af041a86ff873c45',
            unitName: 'xxxx公司',
            unitPathName: 'xxxx公司',
            positionId: '80006103',
            positionName: '合伙人成员',
            isActive: 'N'
          },
          {
            employeeId: '693bfbd98a37485f8094e4792c21cffd',
            employeeName: '王羚',
            employeeCode: '8000062',
            employeeStatus: '2',
            idNumber: null,
            unitId: 'f2aad3d065654c24af041a86ff873c45',
            unitName: 'xxxx公司',
            unitPathName: 'xxxx公司',
            positionId: '80006171',
            positionName: '合伙人队长',
            isActive: 'N'
          },
          {
            employeeId: '699cee4694af4bb98b6338a8daaac742',
            employeeName: '杨超',
            employeeCode: '8000136',
            employeeStatus: '2',
            idNumber: null,
            unitId: 'f2aad3d065654c24af041a86ff873c45',
            unitName: 'xxxx公司',
            unitPathName: 'xxxx公司',
            positionId: '80006103',
            positionName: '合伙人成员',
            isActive: 'N'
          },
          {
            employeeId: 'b6a935854a3f42c7bb389826b2231ce4',
            employeeName: '李大大',
            employeeCode: '8009304',
            employeeStatus: '2',
            idNumber: null,
            unitId: 'f2aad3d065654c24af041a86ff873c45',
            unitName: 'xxxx公司',
            unitPathName: 'xxxx公司',
            positionId: '80006443',
            positionName: '全职员工',
            isActive: 'N'
          },
          {
            employeeId: 'c8882956428a4681b9bcf567cd7c8ccc',
            employeeName: '林小小',
            employeeCode: '8068355',
            employeeStatus: '2',
            idNumber: null,
            unitId: 'f2aad3d065654c24af041a86ff873c45',
            unitName: 'xxxx公司',
            unitPathName: 'xxxx公司',
            positionId: '80006103',
            positionName: '合伙人成员',
            isActive: 'N'
          },
          {
            employeeId: 'd194e4b349374cf4b4adaa147a755a9a',
            employeeName: '林淼淼',
            employeeCode: '800002',
            employeeStatus: '2',
            idNumber: null,
            unitId: 'f2aad3d065654c24af041a86ff873c45',
            unitName: 'xxxx公司',
            unitPathName: 'xxxx公司',
            positionId: '8000613',
            positionName: '合伙人成员',
            isActive: 'N'
          }
        ]

        _self.currentChildren = _self.currentChildren.concat(people || [])
        _self.saveTree(orgUnitId, 'employee', people)
      },
      searchEmployee () {
        let _self = this
        // TODO: 此根据节点获取节点下面的人员信息，具体函数以实际为准，下面给出了示例
        let people = [
          {
            employeeId: '2bde7b2bde264fad8ed2f0bf02375531',
            employeeName: '林小芳',
            employeeCode: '8000633',
            employeeStatus: '2',
            idNumber: null,
            unitId: 'f2aad3d065654c24af041a86ff873c45',
            unitName: 'xxxx公司',
            unitPathName: 'xxxx公司',
            positionId: '80006103',
            positionName: '合伙人成员',
            isActive: 'N'
          },
          {
            employeeId: '693bfbd98a37485f8094e4792c21cffd',
            employeeName: '王羚',
            employeeCode: '8000062',
            employeeStatus: '2',
            idNumber: null,
            unitId: 'f2aad3d065654c24af041a86ff873c45',
            unitName: 'xxxx公司',
            unitPathName: 'xxxx公司',
            positionId: '80006171',
            positionName: '合伙人队长',
            isActive: 'N'
          },
          {
            employeeId: '699cee4694af4bb98b6338a8daaac742',
            employeeName: '杨超',
            employeeCode: '8000136',
            employeeStatus: '2',
            idNumber: null,
            unitId: 'f2aad3d065654c24af041a86ff873c45',
            unitName: 'xxxx公司',
            unitPathName: 'xxxx公司',
            positionId: '80006103',
            positionName: '合伙人成员',
            isActive: 'N'
          },
          {
            employeeId: 'b6a935854a3f42c7bb389826b2231ce4',
            employeeName: '李大大',
            employeeCode: '8009304',
            employeeStatus: '2',
            idNumber: null,
            unitId: 'f2aad3d065654c24af041a86ff873c45',
            unitName: 'xxxx公司',
            unitPathName: 'xxxx公司',
            positionId: '80006443',
            positionName: '全职员工',
            isActive: 'N'
          },
          {
            employeeId: 'c8882956428a4681b9bcf567cd7c8ccc',
            employeeName: '林小小',
            employeeCode: '8068355',
            employeeStatus: '2',
            idNumber: null,
            unitId: 'f2aad3d065654c24af041a86ff873c45',
            unitName: 'xxxx公司',
            unitPathName: 'xxxx公司',
            positionId: '80006103',
            positionName: '合伙人成员',
            isActive: 'N'
          },
          {
            employeeId: 'd194e4b349374cf4b4adaa147a755a9a',
            employeeName: '林淼淼',
            employeeCode: '800002',
            employeeStatus: '2',
            idNumber: null,
            unitId: 'f2aad3d065654c24af041a86ff873c45',
            unitName: 'xxxx公司',
            unitPathName: 'xxxx公司',
            positionId: '8000613',
            positionName: '合伙人成员',
            isActive: 'N'
          }
        ]
        _self.searchResults = people || []
      },
      /**
       * 根据节点信息获取节点下的组织和人员信息
       * @param orgUnitId
       * @returns {*}
       */
      getOrgAndEmployee (orgUnitId) {
        this.currentChildren = [] // 先清空当前页面内容
        let currentChildren = []
        if (sessionStorage.hasOwnProperty('orgTree')) {
          let orgTree = JSON.parse(sessionStorage.getItem('orgTree'))

          // 组织
          if (orgTree.hasOwnProperty(orgUnitId) && orgTree[orgUnitId].hasOwnProperty('org')) {
            currentChildren = orgTree[orgUnitId]['org']
          } else {
            this.getNodeOrg(orgUnitId)
          }

          // 员工
          if (orgTree.hasOwnProperty(orgUnitId) && orgTree[orgUnitId].hasOwnProperty('employee')) {
            currentChildren = currentChildren.concat(orgTree[orgUnitId]['employee'])
          } else {
            this.getNodeEmployee(orgUnitId)
          }

          if (currentChildren.length > 0) {
            this.currentChildren = currentChildren
          }
        } else {
          // 获取组织
          this.getNodeOrg(orgUnitId)
          // 获取人员
          this.getNodeEmployee(orgUnitId)
        }
      },
      /**
       * 选中人或组织
       * @param item
       */
      selectOrgOrEmployee (item) {
        if (item.hasOwnProperty('orgUnitCode')) {
          // 选组织，获取下一节点
          this.navList.push(item)
          this.$nextTick(() => {
            this.$refs.orgNav.scrollIntoView()
            document.getElementById(`${item.orgUnitId}`).scrollIntoView()
          })
          this.getOrgAndEmployee(item.orgUnitId)
        } else {
          // 点击选人
          this.selectEmployee(item)
        }
      },
      /**
       * 组织导航的点击逻辑，点击后请求选中节点数据，并删除后面节点
       * @param index
       */
      selectNav (index) {
        this.navList.splice(index + 1, this.navList.length - index)
        this.getOrgAndEmployee(this.navList[index].orgUnitId)
      },
      /**
       * 点击选人
       * @param employee
       */
      selectEmployee (employee) {
        if (!this.employeeSelected.hasOwnProperty(employee.employeeId)) {
          // 如果单选，则直接完成
          if (!this.multi) {
            // 单选，保存然后退出
            let keys = Object.keys(this.employeeSelected)
            keys.forEach((employeeId) => {
              this.$delete(this.employeeSelected, employeeId)
            })
            // 重新设值
            this.$set(this.employeeSelected, employee.employeeId, employee)
            this.finishSelected()
          } else {
            // 多选，直接赋值,继续取值
            this.$set(this.employeeSelected, employee.employeeId, employee)
            this.$nextTick(() => {
              document.getElementById(employee.employeeId).scrollIntoView()
            })
          }
        } else {
          // 已存在，则删除
          this.$delete(this.employeeSelected, employee.employeeId)
        }
      },
      /**
       * 删除选中的人员
       * @param key
       */
      delEmployeeSelected (key) {
        this.$delete(this.employeeSelected, key)
      },
      finishSelected () {
        // 隐藏
        this.orgBack()
        this.cancel()
        if (this.multi) {
          // 多选
          this.emitCompate('on-select', Object.values(this.employeeSelected))
        } else {
          // 单选
          let keys = Object.keys(this.employeeSelected)
          this.emitCompate('on-select', this.employeeSelected[keys[0]])
        }
      }
    },
    mounted () {
      this.getOrg()
    }
  }
</script>

<style lang="less">
  .org-select {
    overflow-x: scroll !important;
    .vux-popup-dialog {
      display: flex;
      flex-direction: column;
      background-color: #f2f2f2;
    }
    .weui-cells {
      margin-top: 0;
    }
    .org-list .vux-cell-box {
      position: relative;
      padding-right: 50px;
      padding-left: 55px;

      .avatar {
        position: absolute;
        left: 15px;
        width: 30px;
        border-radius: 50%;

        path {
          fill: #999;
        }
      }
    }
    .weui-search-bar__cancel-btn {
      text-decoration: none;
    }
    .org-search,
    .org-list {
      height: 100%;
      .none-tip {
        height: 100%;
        color: #999;
        img {
          margin-bottom: 15px;
        }
      }
    }
    .org-list .weui-cells:before {
      display: none;
    }
  }

</style>
<style scoped lang="less">
  @keyframes pullUp {
    from {
      transform: translate3d(0, 100%, 0);
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    animation: pullUp .5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
    animation: pullUp .5s reverse;
  }
  @import '~vux/src/styles/weui/icon/weui_icon_font';
  @import '~vux/src/styles/weui/widget/weui_searchbar/weui_searchbar';
  @import '~vux/src/styles/weui/widget/weui_cell/weui_cell_global';
  @import '~vux/src/styles/weui/widget/weui_cell/weui_access';

  .org-select {
    z-index: 501;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .org-content {
      overflow: hidden;
      width: 100%;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
      display: flex;
      flex-direction: column;

      .org-static,
      .org-search {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .org-search {
        // overflow: auto;
        .weui-cell {
          position: relative;
          display: initial;
          min-height: 44px;
          padding-right: 50px;
          padding-left: 55px;
          box-sizing: border-box;

          .avatar {
            position: absolute;
            top: 50%;
            left: 15px;
            width: 30px;
            margin-top: -15px;
            border-radius: 50%;

            path {
              fill: #999;
            }
          }
        }
      }
    }

    .org-nav {
      overflow-x: scroll;
      width: 100%;
      height: 40px;
      min-height: 40px;
      background-color: #fff;
      color: #666;
      border-bottom: 1px solid rgba(217,217,217,.5);
      &::-webkit-scrollbar {
        display: none;
      }
      .nav {
        display: -webkit-flex; /* Safari */
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        width: max-content;
        height: 100%;
        padding: 0 10px;

        .org-item {
          position: relative;
          padding-right: 20px;
          &:last-child:after {
            display: none;
          }
          &:after {
            content: " ";
            position: absolute;
            top: 50%;
            right: 6px;
            display: inline-block;
            height: 6px;
            width: 6px;
            margin-top: -4px;
            border-width: 2px 2px 0 0;
            border-color: #C8C8CD;
            border-style: solid;
            -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
            transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);

          }

          &.employee {
            padding-right: .2rem;
            text-align: center;

            .avatar {
              position: relative;
              width: 100%;

              .user {
                width: .3rem;
                border-radius: 50%;
              }
            }
            .name {
              line-height: 1;
              margin-top: -.06rem;
              font-size: .12rem;
            }
            &:after {
              display: none;
            }
            .btn-del {
              position: absolute;
              right: -.1rem;
              top: 50%;
              width: .2rem;
              height: .2rem;
              margin-top: -18px;
            }
          }
        }
      }
    }
    .employee-selected {
      display: inline-flex;
      border-top: 1px solid rgba(217,217,217,.3);
      .org-nav {
        height: auto;
        padding-top: .05rem;
        padding-bottom: .05rem;
        flex: 1;
      }
      .finish-selected {
        display: flex;
        align-items: center;
        padding: 0 .1rem;
        background-color: #fff;
        span {
          display: block;
          padding: .03rem .1rem;
          border-radius: 50px;
          font-size: .13rem;
          color: #fff;
          background-color: #3DA5FE;
        }
      }
    }
    .org-list {
      overflow: auto;
      width: 100%;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
    }
    .vux-search-mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 90%;
      height: 100%;
      z-index: 5;
    }

    .no-select,
    .selected {
      position: absolute;
      top: 50%;
      right: 15px;
      margin-top: -12px;
    }
    .no-select path {
      fill: #C9C9C9;
    }
    .selected path {
      fill: #3DA5FE;
    }

  }
</style>
