<template>
    <div class="standardList">
      <a-card :bordered="false" class="card-area">
        <div :class="advanced ? 'search' : null">
          <a-form layout="horizontal">
            <a-row >
              <div :class="advanced ? null: 'fold'">
                <a-col :md="8" :sm="24" >
                  <a-form-item
                    label="关键字"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 18, offset: 1}">
                    <a-input placeholder="请输入" v-model="queryParams.searchName"/>
                  </a-form-item>
                </a-col>
              </div>
              <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          </span>
            </a-row>
          </a-form>
        </div>
      </a-card>
      <a-card :bordered="false" class="card-area" style="margin-top:10px;">
        <div class="operator">
          <a-button type="primary" @click="addSafety">
            添加
          </a-button>
        </div>
        <div>
          <table-list :columns="columns" :dataSource="dataSource" :loading='loading' :pagination="pagination"></table-list>
        </div>
      </a-card>
      <!--添加预案-->
      <safety-add
        :visible="isShowSafetyAdd"
        @onClose="()=>{isShowSafetyAdd=false}"
      ></safety-add>
      <!---->
      <safety-edit
        ref="safetyEdit"
        :visible="isShowSafetyEdit"
        @onClose="()=>{isShowSafetyEdit=false}"
      ></safety-edit>
    </div>
</template>

<script>
import SafetyAdd from './model/safetyAdd'
import SafetyEdit from './model/safetyEdit'
import TableList from '@/components/table/TableList'
export default {
  name: 'safety',
  components: {
    SafetyAdd,
    TableList,
    SafetyEdit
  },
  data () {
    return {
      advanced: false,
      queryParams: {},
      paginationInfo: null,
      dataSource: [
        {devStatus: '安全管理预案', devModelName:'综合预案', secureKey: '王伟', devOnline:'土石坝安全管理可分为日常巡检、技术处理和应急处置三个层面的工作',projBasicName:'2021-12-21 18:24:21'},
        {devStatus: '日常巡检预案', devModelName:'综合预案', secureKey: '王伟', devOnline:'日常巡检：根据《土石坝安全监测技术规范》（SL551-2012）要求',projBasicName:'2021-12-21 18:24:21'},
        {devStatus: '技术处理预案', devModelName:'综合预案', secureKey: '王伟', devOnline:'当安全风险监测发出异常预警后，或遇到大洪水、大暴雨、地震、高水位运行等工况下，需对可能出现险情的部位和工况进行连续监测，对于可能出现的险情要制定针对性的技术方案。',projBasicName:'2021-12-21 18:24:21'},
        {devStatus: '应急处置预案', devModelName:'综合预案', secureKey: '王伟', devOnline:'当安全风险监测发出险情预警后，或土石坝遭遇强降雨、漫坝等极端工况下，坝体存在溃坝风险，需建立对应的应急处置机制，一方面从监测系统中要实时掌握气象数据、坝体工情数据 ...',projBasicName:'2021-12-21 18:24:21'},
        {devStatus: '防汛预案', devModelName:'雨情监测预案', secureKey: '王伟', devOnline:'降水量、库水位测报频次原则上每日不少于1次，当出现强降雨、库水位明显变化，或遭遇大洪水、强地震、工程异常等特殊情况时，增加测报频次。',projBasicName:'2021-12-21 18:24:21'},
      ],
      loading: false,
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      isShowSafetyAdd: false,
      isShowSafetyEdit: false
    }
  },
  computed: {
    columns () {
      return [{
        title: '预案名称',
        dataIndex: 'devStatus'
      }, {
        title: '适用监测场景',
        dataIndex: 'devModelName'
      }, {
        title: '创建人',
        dataIndex: 'secureKey'
      }, {
        title: '描述',
        dataIndex: 'devOnline',
        width: '25%',
        ellipsis: true
      }, {
        title: '创建时间',
        dataIndex: 'projBasicName'
      }, {
        title: '操作',
        dataIndex: 'operation',
        customRender: (text, record) => (
          <div>
            <a-icon type="setting" theme="twoTone" twoToneColor="#4a9ff5" style="font-size:1.6rem;" onClick={() => { this.edit(record) }} title="编辑"></a-icon>
            <a-icon type="delete" theme="twoTone" twoToneColor="#4a9ff5" style="font-size:1.6rem;" onClick={() => { this.safetyDelete(record) }} title="删除"></a-icon>
          </div>
        )
      }]
    }
  },
  methods: {
    addSafety () {
      this.isShowSafetyAdd = true
    },
    edit (record) {
      this.$refs.safetyEdit.setFormValues(record)
      this.isShowSafetyEdit = true
    },
    safetyDelete () {

    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../../../../static/less/Common";
  .standardList{
    width:100%;
  }

</style>
