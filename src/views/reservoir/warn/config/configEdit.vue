<template>
  <a-modal
    title="编辑预警规则"
    :visible="visible"
    width="1200px"
    @ok="saveThrehold"
    @cancel="handleCancel"
  >
    <div class="box">
      <div class="block">已选中监测点：<a href="#">1个</a></div>
      <div class="block">设备类型：<a href="#">{{warnRule.devModelName}}</a></div>
      <div style="margin-left:auto;"><a  @click="recoveryThreshold">恢复默认</a></div>
    </div>
    <a-table ref="TableEdit"
             :columns="columns"
             :dataSource="dataSource"
             :pagination="pagination"
             :loading="loading"
             bordered
             :scroll="{ y: 300 }"
    >
      <template
        v-for="col in ['warnBlue', 'warnYellow', 'warnOrange', 'warnRed']"
        :slot="col"
        slot-scope="text, record, index"
      >
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text === 9999 || text === '9999.0' ? '' : text"
            @change="e => handleChange(e.target.value, record.sort, col)"
          />
          <template v-else>
            {{ text === 9999 || text === '9999.0' ? '' : text }}
          </template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <div class="editable-row-operations">
      <span v-if="record.editable">
        <a @click="() => save(record.sort)">确定</a>
      </span>
          <span v-else>
        <a @click="() => editThreshold(record.sort)">编辑</a>
      </span>
        </div>
      </template>
      <template slot="alarmflag" slot-scope="text, record">
        <a-checkbox v-if="text === '0'"  @change="onChange(record.sort,$event)"></a-checkbox>
        <a-checkbox v-else checked @change="onChange(record.sort,$event)"></a-checkbox>
      </template>
    </a-table>
    <!--警示信息-->
    <config-warn-msg
      :visible="isShowConfigMsg"
      @getWarnMsg="getWarnMsg"
      :msgInfo="msgInfo"
      @onClose="()=>{isShowConfigMsg=false}"
    ></config-warn-msg>
  </a-modal>
</template>

<script>
import ConfigWarnMsg from './configWarnMsg'
export default {
  name: 'config-edit',
  components: {
    ConfigWarnMsg
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tabPane: {
      type: Number,
      default: -1
    },
    warnRule: {
      type: Object,
      default: () => {}
    },
    thresholdEditData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      loading: false,
      pagination: false,
      dataSource: [],
      editable: false,
      isShowConfigMsg: false,
      msgKey: -1,
      msgCol: '',
      msgInfo: {},
      warnMsgInfo: {}
    }
  },
  computed: {
    columns () {
      return [{
        title: '指标',
        dataIndex: 'targetName',
        width: '10%'
      }, {
        title: '蓝色预警阈值',
        dataIndex: 'warnBlue',
        width: '11%',
        scopedSlots: {customRender: 'warnBlue'}
      }, {
        title: '蓝色警示信息',
        dataIndex: 'blue',
        width: '8%',
        // scopedSlots: {customRender: 'blue'}
        customRender: (text, record) => (
          <div>
            <a-icon type="form" style="font-size:1.6rem;" onClick={() => this.addWarnMsg(record.warnInfo, record.sort, 'blue')}/>
          </div>
        )
      }, {
        title: '黄色预警阈值',
        dataIndex: 'warnYellow',
        width: '11%',
        scopedSlots: {customRender: 'warnYellow'}
      }, {
        title: '黄色警示信息',
        dataIndex: 'yellow',
        width: '8%',
        // scopedSlots: {customRender: 'yellow'}
        customRender: (text, record) => (
          <div>
            <a-icon type="form" style="font-size:1.6rem;" onClick={() => this.addWarnMsg(record.warnInfo, record.sort, 'yellow')}/>
          </div>
        )
      }, {
        title: '橙色预警阈值',
        dataIndex: 'warnOrange',
        width: '11%',
        scopedSlots: {customRender: 'warnOrange'}
      }, {
        title: '橙色警示信息',
        dataIndex: 'orange',
        width: '8%',
        // scopedSlots: {customRender: 'orange'}
        customRender: (text, record) => (
          <div>
            <a-icon type="form" style="font-size:1.6rem;" onClick={() => this.addWarnMsg(record.warnInfo, record.sort, 'orange')}/>
          </div>
        )
      }, {
        title: '红色预警阈值',
        dataIndex: 'warnRed',
        width: '11%',
        scopedSlots: {customRender: 'warnRed'}
      }, {
        title: '红色警示信息',
        dataIndex: 'red',
        width: '8%',
        //  scopedSlots: {customRender: 'red'}
        customRender: (text, record) => (
          <div>
            <a-icon type="form" style="font-size:1.6rem;" onClick={() => this.addWarnMsg(record.warnInfo, record.sort, 'red')} />
          </div>
        )
      }, {
        title: '是否警示',
        dataIndex: 'alarmflag',
        width: '8%',
        scopedSlots: {customRender: 'alarmflag'}
      }, {
        title: '操作',
        dataIndex: 'operation',
        width: '11%',
        scopedSlots: { customRender: 'operation' }
      }]
    }
  },
  watch: {
    thresholdEditData (newVal) {
      console.log('编辑信息', newVal)
      this.dataSource = newVal
    }/*,
    warnRule (newVal) {
      this.warnMsgInfo = JSON.parse(newVal.config).temp
      console.log('编辑预警规则预警警示信息', this.warnMsgInfo)
    } */
  },
  methods: {
    handleCancel () {
      this.$emit('onClose')
    },
    onChange (key, e) {
      const dataSource = [...this.dataSource]
      const target = dataSource.find(item => item.sort === key)
      if (target.warnBlue === 9999 && target.warnOrange === 9999 && target.warnRed === 9999 && target.warnYellow === 9999 || target.warnBlue === '' && target.warnOrange === '' && target.warnRed === '' && target.warnYellow === '') {
        this.$warning({
          title: '提示',
          content: '请先修改指标阈值...'
        })
        e.target.checked = false
        return
      }
      if (target) {
        target.alarmflag = e.target.checked ? '1' : '0'
        this.dataSource = dataSource
        /* this.flag = 1
        this.$emit('getFlag', this.flag) */
      }
    },
    // 添加警示信息
    addWarnMsg (warnInfo, key, col) {
      this.msgKey = key
      this.msgCol = col
      console.log('添加警示信息', warnInfo)
      if (warnInfo !== '') {
        let warnInfoObj = JSON.parse(warnInfo)
        for (let item in warnInfoObj) {
          if (item === col) {
            this.msgInfo = JSON.parse(warnInfo)[col]
          } else {
            this.msgInfo = {}
          }
        }
        this.warnMsgInfo = warnInfo
      }
      console.log('警示信息', this.warnMsgInfo, this.msgInfo, warnInfo, key, col)
      this.isShowConfigMsg = true
    },
    // 获取预警警示信息
    getWarnMsg (warnMsg) {
      const dataSource = [...this.dataSource]
      const target = dataSource.find(item => item.sort === this.msgKey)
      if (target) {
        /* let warnInfo = {}
        warnInfo[this.msgCol] = warnMsg
        target.warnInfo = warnInfo */
        this.warnMsgInfo[this.msgCol] = warnMsg
        target.warnInfo = JSON.stringify(this.warnMsgInfo)
        this.dataSource = dataSource
        console.log('修改警示消息之后的内容', dataSource)
        /* this.flag = 1
        this.$emit('getFlag', this.flag) */
      }
    },
    editThreshold (key) {
      const newData = [...this.dataSource]
      const target = newData.filter(item => key === item.sort)[0]
      console.log('编辑指标阈值', target)
      if (target) {
        target.editable = true
        this.editable = true
        this.$emit('getEditable', this.editable)
        this.dataSource = newData
      }
    },
    handleChange (value, key, column) {
      const newData = [...this.dataSource]
      const target = newData.filter(item => key === item.sort)[0]
      if (target) {
        target[column] = value
        this.dataSource = newData
      }
    },
    save (key) {
      const newData = [...this.dataSource]
      const target = newData.filter(item => key === item.sort)[0]
      if (target) {
        if (target.warnBlue === '' && target.warnOrange === '' && target.warnRed === '' && target.warnYellow === '') {
          target.alarmflag = '0'
        }
        if (target.warnBlue === '' && target.warnOrange === '' && target.warnRed === '' && target.warnYellow === '') {
          target.alarmflag = '0'
        }
        if (target.warnBlue === '') {
          target.warnBlue = 9999
        }
        if (target.warnOrange === '') {
          target.warnOrange = 9999
        }
        if (target.warnRed === '') {
          target.warnRed = 9999
        }
        if (target.warnYellow === '') {
          target.warnYellow = 9999
        }
        delete target.editable
        this.editable = false
        this.$emit('getEditable', this.editable)
        this.dataSource = newData
        /* this.flag = 1
        this.$emit('getFlag', this.flag) */
        this.$emit('updateThresholdData', this.dataSource)
      }
    },
    // 恢复指标值
    recoveryThreshold () {
      if (!this.editable) {
        let that = this
        that.$confirm({
          title: '恢复默认',
          content: '确定要恢复指标的阈值？',
          okText: '确定',
          cancelText: '取消',
          onOk () {
            let params = {}
            params.devModelId = that.warnRule.devModelId
            that.$post('web/warnConfig/findDevValueList', {...params}).then((r) => {
              if (r.data.code === 1) {
                that.dataSource = r.data.data
                that.flag = 0
                that.$emit('getFlag', that.flag)
                that.$message.success('恢复成功')
              } else {
                that.$message.warning(r.data.msg)
              }
            })
          },
          onCancel () {
          }
        })
      } else {
        this.$message.warning('指标阈值还在编辑状态')
      }
    },
    saveThrehold () {
      if (!this.editable) {
        let params = {}
        params.devCodes = this.warnRule.devCode
        params.list = this.dataSource
        console.log('修改预警规则参数', params)
        this.$postDate('web/warnConfig/editWarnConfig', {...params}).then((r) => {
          if (r.data.code === 1) {
            this.$message.success('修改成功')
            this.$emit('search', this.tabPane)
            this.$emit('onClose')
          } else {
            this.$message.warning(r.data.msg)
          }
        })
      } else {
        this.$message.warning('指标阈值还在编辑状态')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .box{
    display: flex;
    justify-content: flex-start;
  }
  .block{
    width:230px;
    height:30px;
  }
</style>
