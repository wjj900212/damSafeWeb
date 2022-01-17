<template>
    <div>
      <div class="box">
        <div class="block">已选中监测点：<a href="#">{{tagList.length}}个</a></div>
        <div class="block">设备类型：<a href="#">{{thresholdEditMoreObj.first.devModelName}}</a></div>
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
              :value="text === '9999.0' ? '' : text"
              @change="e => handleChange(e.target.value, record.sort, col)"
            />
            <template v-else>
              {{ text === '9999.0' ? '' : text }}
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
        <template slot="display" slot-scope="text, record">
          <a-checkbox v-if="text === '0'"  @change="onDisplayChange(record.sort,$event)"></a-checkbox>
          <a-checkbox v-else checked @change="onDisplayChange(record.sort,$event)"></a-checkbox>
        </template>
      </a-table>
      <!--警示信息-->
      <config-warn-msg
        :visible="isShowConfigMsg"
        @onClose="()=>{isShowConfigMsg=false}"
      ></config-warn-msg>
    </div>
</template>

<script>
  import ConfigWarnMsg from '../configWarnMsg'
export default {
  name: 'third',
  data () {
    return {
      loading: false,
      selectedRowKeys: [],
      pagination: false,
      dataSource: [],
      editable: false,
      flag: 0,
      isShowConfigMsg: false
    }
  },
  props: {
    thresholdEditMoreObj: {
      type: Object,
      default: () => {}
    },
    tagList: {
      type: Array,
      default: () => {
        return []
      }
    },
    data: {
      type: Object,
      default: () => {
      }
    }
  },
  components: {
    ConfigWarnMsg
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
        dataIndex: 'warnBlueMsg',
        width: '11%',
        customRender: (text, record) => (
          <div>
            <a-icon type="form" style="font-size:1.6rem;" onClick={() => this.addWarnMsg(record)}/>
          </div>
        )
      }, {
        title: '黄色预警阈值',
        dataIndex: 'warnYellow',
        width: '11%',
        scopedSlots: {customRender: 'warnYellow'}
      }, {
        title: '黄色警示信息',
        dataIndex: 'warnYellowMsg',
        width: '11%',
        customRender: (text, record) => (
          <div>
            <a-icon type="form" style="font-size:1.6rem;"/>
          </div>
        )
      }, {
        title: '橙色预警阈值',
        dataIndex: 'warnOrange',
        width: '11%',
        scopedSlots: {customRender: 'warnOrange'}
      }, {
        title: '橙色警示信息',
        dataIndex: 'warnOrangeMsg',
        width: '11%',
        customRender: (text, record) => (
          <div>
            <a-icon type="form" style="font-size:1.6rem;" />
          </div>
        )
      }, {
        title: '红色预警阈值',
        dataIndex: 'warnRed',
        width: '11%',
        scopedSlots: {customRender: 'warnRed'}
      }, {
        title: '红色警示信息',
        dataIndex: 'warnRedMsg',
        width: '11%',
        customRender: (text, record) => (
          <div>
            <a-icon type="form" style="font-size:1.6rem;" />
          </div>
        )
      }, {
        title: '操作',
        dataIndex: 'operation',
        width: '11%',
        scopedSlots: { customRender: 'operation' }
      }]
    }
  },
  mounted () {
    // this.dataSource = this.data.targetList
  },
  watch: {
    data (newVal) {
      this.dataSource = newVal
    }
  },
  methods: {
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
        this.flag = 1
        this.$emit('getFlag', this.flag)
      }
    },
    // 添加警示信息
    addWarnMsg(record){
      this.isShowConfigMsg = true
    },
    onDisplayChange (key, e) {
      const dataSource = [...this.dataSource]
      const target = dataSource.find(item => item.sort === key)
      if (target) {
        target.display = e.target.checked ? '1' : '0'
        this.dataSource = dataSource
        this.flag = 1
        this.$emit('getFlag', this.flag)
      }
    },
    editThreshold (key) {
      const newData = [...this.dataSource]
      const target = newData.filter(item => key === item.sort)[0]
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
        this.flag = 1
        this.$emit('getFlag', this.flag)
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
            params.modelId = that.data.devModel
            that.$post('admin/thresholdManage/getBasicThreshold', {...params}).then((r) => {
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
