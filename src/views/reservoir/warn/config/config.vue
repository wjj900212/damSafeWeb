<template>
    <div class="standardList">
      <a-tabs border="1" type="card" @change="callback">
        <a-tab-pane key="1" tab="雨情监测">
          <a-button type="primary" style="margin-bottom:10px;" @click="addConfig">添加规则</a-button>
          <div class="operator">
            <table-list :columns="columns" :dataSource="dataSource" :loading='loading' :pagination="pagination"></table-list>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="水情监测">
          <a-button type="primary" style="margin-bottom:10px;">添加规则</a-button>
          <div class="operator">
            <table-list :columns="columns" :dataSource="dataSource" :loading='loading' :pagination="pagination"></table-list>
          </div>
        </a-tab-pane>
        <a-tab-pane key="3" tab="渗压监测">
          <a-button type="primary" style="margin-bottom:10px;">添加规则</a-button>
          <div class="operator">
            <table-list :columns="columns" :dataSource="dataSource" :loading='loading' :pagination="pagination"></table-list>
          </div>
        </a-tab-pane>
        <a-tab-pane key="4" tab="渗流监测">
          <a-button type="primary" style="margin-bottom:10px;">添加规则</a-button>
          <div class="operator">
            <table-list :columns="columns" :dataSource="dataSource" :loading='loading' :pagination="pagination"></table-list>
          </div>
        </a-tab-pane>
        <a-tab-pane key="5" tab="变形监测">
          <a-button type="primary" style="margin-bottom:10px;">添加规则</a-button>
          <div class="operator">
            <table-list :columns="columns" :dataSource="dataSource" :loading='loading' :pagination="pagination"></table-list>
          </div>
        </a-tab-pane>
      </a-tabs>
      <!--添加预警规则-->
      <config-add
        :visible="isShowConfigAdd"
        @onClose="()=>{isShowConfigAdd=false}"
      ></config-add>
    </div>
</template>

<script>
import TableList from '@/components/table/TableList'
import ConfigAdd from './configAdd'
export default {
  name: 'config',
  components: {
    TableList,
    ConfigAdd
  },
  data () {
    return {
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
      isShowConfigAdd: false
    }
  },
  computed: {
    columns () {
      return [{
        title: '监测场景',
        dataIndex: 'devCode'
      }, {
        title: '监测点',
        dataIndex: 'devStatus'
      }, {
        title: '设备ID',
        dataIndex: 'devModelName'
      }, {
        title: '预警等级',
        dataIndex: 'secureKey'
      }, {
        title: '指标',
        dataIndex: 'devOnline'
      }, {
        title: '阈值',
        dataIndex: 'projBasicName'
      }, {
        title: '警示信息',
        dataIndex: 'itemNum',
        width: '25%',
        ellipsis: true
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
    callback (key) {
      console.log(key)
    },
    addConfig () {
      this.isShowConfigAdd = true
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
