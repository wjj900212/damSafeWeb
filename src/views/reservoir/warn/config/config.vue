<template>
    <div class="standardList">
      <a-tabs border="1" type="card" v-model="tabPane" @change="callback">
        <a-tab-pane v-for="v in sceneTypeList" :key="v.ID" :tab="v.NAME">
          <a-button type="primary" style="margin-bottom:10px;" @click="addConfig">添加规则</a-button>
          <div class="operator">
            <a-table ref="TableInfo"
                     :columns="columns"
                     :dataSource="dataSource"
                     :pagination="pagination"
                     :loading="loading"
                     @change="handleTableChange">
            </a-table>
          </div>
        </a-tab-pane>
      </a-tabs>
      <!--添加预警规则-->
      <config-add
        :visible="isShowConfigAdd"
        :tabPane="tabPane"
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
import ConfigAdd from './configAdd'
import ConfigEdit from './configEdit'
export default {
  name: 'config',
  components: {
    ConfigAdd,
    ConfigEdit
  },
  data () {
    return {
      tabPane: -1,
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
      isShowConfigAdd: false,
      isShowConfigEdit: false,
      sceneTypeList: []
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
  mounted () {
    this.getHiddenDangerTypeList()
  },
  methods: {
    callback (key) {
      this.tabPane = key
      this.getWarnConfigList({
        type: key
      })
      console.log(key)
    },
    // 获取场景类型列表
    getHiddenDangerTypeList () {
      this.$get('web/hidden/getHiddenDangerTypeList').then((r) => {
        this.sceneTypeList = r.data.data
        this.tabPane = r.data.data[0].ID
        this.getWarnConfigList({
          type: r.data.data[0].ID
        })
      })
    },
    reset () {
      // 重置分页
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
      if (this.paginationInfo) {
        this.paginationInfo.current = this.pagination.defaultCurrent
        this.paginationInfo.pageSize = this.pagination.defaultPageSize
      }
    },
    // 预警配置列表
    getWarnConfigList (params = {}) {
      this.loading = true
      if (this.paginationInfo) {
        // 如果分页信息不为空，则设置表格当前第几页，每页条数，并设置查询分页参数
        this.$refs.TableInfo.pagination.current = this.paginationInfo.current
        this.$refs.TableInfo.pagination.pageSize = this.paginationInfo.pageSize
        params.pageSize = this.paginationInfo.pageSize
        params.pageNum = this.paginationInfo.current
      } else {
        // 如果分页信息为空，则设置为默认值
        params.pageSize = this.pagination.defaultPageSize
        params.pageNum = this.pagination.defaultCurrent
      }
      this.$get('web/warnConfig/getWarnConfigList', {
        ...params
      }).then((r) => {
        if (r.data.code === 1) {
          let data = r.data.data
          const pagination = { ...this.pagination }
          pagination.total = data.total
          this.dataSource = data.records
          this.pagination = pagination
        } else {
          this.$message.error(r.data.msg)
        }
        // 数据加载完毕，关闭loading
        this.loading = false
      })
    },
    handleTableChange (pagination) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.getWarnConfigList()
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
