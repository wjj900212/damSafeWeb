<template>
  <a-modal
    title="添加预警规则"
    :visible="visible"
    width="1200px"
    @cancel="handleCancel"
  >
    <div class="steps-content">
      <!--:typeList="typeList"
        :devTypeList="devTypeList"-->
      <first
        :tabPane="tabPane"
        @updateThresholdDev="updateThresholdDev"
        :thresholdEditMoreObj="thresholdEditMoreObj"
        v-if="steps[current].index === '1'"></first>
      <second
        @updateThresholdTag="updateThresholdTag"
        :thresholdEditMoreObj="thresholdEditMoreObj"
        v-if="steps[current].index === '2'"></second>
      <third
        ref="thirdRef"
        @updateThresholdData="updateThresholdData"
        @getFlag="getFlag"
        @getEditable="getEditable"
        :thresholdEditMoreObj="thresholdEditMoreObj"
        :tagList="tagList"
        :data="thresholdEditData"
        v-if="steps[current].index === '3'"></third>
    </div>
    <template slot="footer">
      <div class="steps-action">
        <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">
          上一步
        </a-button>
        <a-button
          v-if="current == steps.length - 1"
          type="primary"
          @click="saveThrehold"
        >
          保存
        </a-button>
        <a-button v-if="current < steps.length - 1" type="primary" @click="next()">
          下一步
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
import First from './model/First'
import Second from './model/Second'
import Third from './model/Third'
export default {
  name: 'threshold-edit-more',
  components: {
    First,
    Second,
    Third
  },
  data () {
    return {
      current: 0,
      steps: [
        {
          index: '1',
          title: '设备类型',
          content: 'First-content'
        },
        {
          index: '2',
          title: '选择设备',
          content: 'Second-content'
        },
        {
          index: '3',
          title: '设置阈值',
          content: 'Last-content'
        }
      ],
      thresholdEditMoreObj: {
        first: {},
        second: {},
        third: {}
      },
      selectDev: {},
      tagList: [],
      thresholdEditData: [],
      editable: false,
      flag: 0
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tabPane: {
      type: Number,
      default: -1
    }
  },
  watch: {
    thresholdEditMoreObj (newVal) {
      this.thresholdEditMoreObj = newVal
    }
  },
  methods: {
    handleCancel () {
      this.thresholdEditMoreObj = {
        first: {},
        second: {},
        third: {}
      }
      this.current = 0
      this.$emit('search')
      this.$emit('onClose')
    },
    updateThresholdDev (dev) {
      this.thresholdEditMoreObj.first = dev
    },
    updateThresholdTag (secondParams, tagList) {
    //  console.log('选择设备编号', secondParams, tagList)
      this.thresholdEditMoreObj.second.secondParams = secondParams
      this.thresholdEditMoreObj.second.tagList = tagList
      this.tagList = tagList
    },
    updateThresholdData (dataSource) {
      // console.log('获取指标值', dataSource)
      this.thresholdEditMoreObj.third = dataSource
    },
    getFlag (flag) {
      this.flag = flag
    },
    getEditable (editable) {
      this.editable = editable
    },
    next () {
      if (this.current === 0) {
        if (JSON.stringify(this.thresholdEditMoreObj.first) !== '{}' && this.thresholdEditMoreObj.first.devModelId !== undefined) {
          this.current++
        } else {
          this.$message.warning('请先选择监测场景和设备类型')
        }
      } else if (this.current === 1) {
        if (this.thresholdEditMoreObj.second.tagList !== undefined) {
          this.current++
          this.getThresholdDetail(this.thresholdEditMoreObj.first.devModelId)
        } else {
          this.$message.warning('请先选择需要修改阈值的设备')
        }
      }
      console.log('当前thresholdEditMoreObj', this.thresholdEditMoreObj)
    },
    prev () {
      this.current--
      if (this.current === 1) {
        this.thresholdEditMoreObj.third = {}
      } else if (this.current === 0) {
        this.thresholdEditMoreObj.second = {}
      }
    },
    // 查看设备的指标阈值
    getThresholdDetail (devModelId) {
      let params = { devModelId: devModelId }
      this.$get('web/warnConfig/findDevValueList', {
        ...params
      }).then((r) => {
        let data = r.data.data
        this.thresholdEditData = data
      })
    },
    saveThrehold () {
      if (!this.editable) {
        let params = {}
        let dataSource = this.$refs.thirdRef.dataSource
        let devCode = []
        for (let i = 0; i < this.tagList.length; i++) {
          let rt = /(.+)?(?:\(|（)(.+)(?=\)|）)/.exec(this.tagList[i])
          devCode.push(rt[2])
        }
        params.devCodes = devCode.toString()
        params.list = dataSource
        console.log('规则dataSource', dataSource)
        console.log('修改指标阈值', params)
        this.$postDate('web/warnConfig/addWarnConfig', {...params}).then((r) => {
          if (r.data.code === 1) {
            this.$message.success('修改成功')
            this.current = 0
            this.thresholdEditMoreObj = {
              first: {},
              second: {},
              third: {}
            }
            this.$refs.thirdRef.warnMsgInfo = {}
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
  .steps-content {
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    min-height: 200px;
    padding:10px;
    /*padding-top: 80px;*/
  }

  .steps-action {
    margin-top: 24px;
  }
</style>
