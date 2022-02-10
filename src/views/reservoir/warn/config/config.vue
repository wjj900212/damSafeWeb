<template>
    <div class="standardList">
      <a-tabs v-model="tabPane" @change="callback">
        <a-tab-pane v-for="v in sceneTypeList" :key="v.ID" :tab="v.NAME">
          <a-button  style="margin-bottom: 1rem;border: 1px solid #188FFF;background: #188fff1a;color: #1890FF;"  @click="addConfig">
            添加规则
          </a-button>
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
        @search="getWarnConfigList"
        @onClose="()=>{isShowConfigAdd=false}"
      ></config-add>
      <!--编辑预警规则-->
      <config-edit
        :visible="isShowConfigEdit"
        :warnRule="warnRule"
        :tabPane="tabPane"
        @search="getWarnConfigList"
        :thresholdEditData="thresholdEditData"
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
      sceneTypeList: [],
      warnRule: {},
      thresholdEditData: []
    }
  },
  computed: {
    columns () {
      return [{
        title: '监测场景',
        dataIndex: 'hiddenName'
      }, {
        title: '监测点',
        dataIndex: 'projPnName'
      }, {
        title: '设备类型',
        dataIndex: 'devModelName'
      }, {
        title: '设备ID',
        dataIndex: 'devCode'
      }, /* {
        title: '预警规则',
        dataIndex: 'warnRule',
        customRender: (text, record) => (
          <div>
            <a>点击查看</a>
          </div>
        )
      }, */ {
        title: '操作',
        dataIndex: 'operation',
        customRender: (text, record) => (
          <div>
            <a onClick={() => { this.edit(record) }} style="margin-right:1rem;">编辑</a>
            <a onClick={() => { this.configDelete(record) }}>删除</a>
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
      this.getWarnConfigList(key)
      console.log(key)
    },
    // 获取场景类型列表
    getHiddenDangerTypeList () {
      this.$get('web/hidden/getHiddenDangerTypeList').then((r) => {
        this.sceneTypeList = r.data.data
        this.tabPane = r.data.data[0].ID
        this.getWarnConfigList(r.data.data[0].ID)
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
    getWarnConfigList (tabPane) {
      this.loading = true
      let params = {}
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
      params.type = tabPane
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
      this.warnRule = record
      this.isShowConfigEdit = true
      console.log('修改预警规则信息', record)
      this.getThresholdDetail(record.devCode)
    },
    configDelete (record) {
      let that = this
      this.$confirm({
        title: '确定删除该预警规则?',
        content: '当您点击确定按钮后，这个预警规则将会被彻底删除',
        centered: true,
        onOk () {
          that.$post('web/warnConfig/deleteWarnConfig', {
            warnId: record.warnId
          }).then((r) => {
            if (r.data.code === 1) {
              that.$message.success('删除成功')
              this.getWarnConfigList(this.tabPane)
            } else {
              that.$message.error(r.data.msg)
            }
          })
        },
        onCancel () {}
      })
    },
    // 查看设备的指标阈值
    getThresholdDetail (devCode) {
      let params = { devCode: devCode }
      this.$get('web/warnConfig/viewWarnConfig', {
        ...params
      }).then((r) => {
        if (r.data.code === 1) {
          let data = r.data.data
          this.thresholdEditData = data
        } else {
          this.$message.error(r.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../../../../static/less/Common";
  .standardList{
    width:100%;
    background-color: #FFFFFF;
    padding:1rem;
    min-height: 70rem;
  }
</style>
