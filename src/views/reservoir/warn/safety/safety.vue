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
    </div>
</template>

<script>
import SafetyAdd from './model/safetyAdd'
import TableList from '@/components/table/TableList'
export default {
  name: 'safety',
  components: {
    SafetyAdd,
    TableList
  },
  data () {
    return {
      advanced: false,
      queryParams: {},
      paginationInfo: null,
      dataSource: [],
      loading: false,
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      isShowSafetyAdd: false
    }
  },
  computed: {
    columns () {
      return [{
        title: '序号',
        dataIndex: 'devCode'
      }, {
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
        width: '15%',
        ellipsis: true
      }, {
        title: '创建时间',
        dataIndex: 'projBasicName'
      }, {
        title: '操作',
        fixed: 'right',
        dataIndex: 'operation',
        customRender: (text, record) => (
          <div>
            <a-icon type="setting" theme="twoTone" twoToneColor="#4a9ff5" onClick={() => { this.edit(record) }} title="编辑"></a-icon>
            <a-icon type="delete" theme="twoTone" twoToneColor="#4a9ff5" onClick={() => { this.userDelete(record) }} title="删除"></a-icon>
          </div>
        )
      }]
    }
  },
  methods: {
    addSafety () {
      this.isShowSafetyAdd = true
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
