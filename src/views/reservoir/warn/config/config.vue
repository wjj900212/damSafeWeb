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
      <!--编辑预警规则-->
      <config-edit
        :visible="isShowConfigEdit"
        @onClose="()=>{isShowConfigEdit=false}"
      ></config-edit>
    </div>
</template>

<script>
import TableList from '@/components/table/TableList'
import ConfigAdd from './configAdd'
import ConfigEdit from './configEdit'
export default {
  name: 'config',
  components: {
    TableList,
    ConfigAdd,
    ConfigEdit
  },
  data () {
    return {
      paginationInfo: null,
      dataSource: [
        {devCode: '雨情测报站-01', devStatus: '翻斗式雨量计-01', devModelName: '翻斗式雨量计', secureKey: '202101100045', devOnline: '0'},
        {devCode: '雨情测报站-02', devStatus: '翻斗式雨量计-02', devModelName: '翻斗式雨量计', secureKey: '202101100046', devOnline: '0'}
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
      isShowConfigAdd: false,
      isShowConfigEdit: false
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
        title: '设备类型',
        dataIndex: 'devModelName'
      }, {
        title: '设备ID',
        dataIndex: 'secureKey'
      }, {
        title: '预警规则',
        dataIndex: 'devOnline',
        customRender: (text, record) => (
          <div>
            <a>点击查看</a>
          </div>
        )
      }, {
        title: '操作',
        dataIndex: 'operation',
        customRender: (text, record) => (
          <div>
            <a-icon type="setting" theme="twoTone" twoToneColor="#4a9ff5" class="icon-size" onClick={() => { this.edit(record) }} title="编辑"></a-icon>
            <a-icon type="delete" theme="twoTone" twoToneColor="#4a9ff5" class="icon-size" onClick={() => { this.configDelete(record) }} title="删除"></a-icon>
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
    },
    edit (record) {
      this.isShowConfigEdit = true
      // this.getThresholdDetail(record.devCode)
    },
    configDelete () {

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
