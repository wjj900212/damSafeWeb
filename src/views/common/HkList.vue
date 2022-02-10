<template>
  <a-drawer title="回款明细" :maskClosable="false" width=75% placement="right" :closable="false"
     :visible="hkListVisiable"  style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-card :bordered="false"  class="card-area">
      <div :class="advanced ? 'search' : null">
        <!-- 搜索区域 -->
        <!-- <a-form layout="horizontal">
          <a-row >
          <div :class="advanced ? null: 'fold'">
              <a-col :md="18" :sm="24" >
                <a-form-item
                  label="关键字搜索："
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 15, offset: 1}">
                  <a-input placeholder="项目编号/合同编号" @keyup.enter="search" v-model="queryParams.requestName"/>
                </a-form-item>
              </a-col>
          </div>
            <span style="float: right; margin-top: 3px;">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            </span>
          </a-row>
        </a-form> -->
      </div>
      <div>
        <!-- 表格区域 -->
        <a-table ref="TableInfo"
                 :columns="columns"
                 :dataSource="dataSource"
                 :pagination="pagination"
                 :loading="loading"
                 @change="handleTableChange">
          <template slot="operation" slot-scope="text, record">
            <a-icon v-hasPermission="'projFollow:delete'" type="delete" theme="twoTone" twoToneColor="#4a9ff5" @click="del(record)" title="取消关注"></a-icon>

            <a-badge v-hasNoPermission="'proj:update','proj:view'" status="warning" text="无权限"></a-badge>
          </template>
        </a-table>
      </div>
    </a-card>
    <div class="drawer-bootom-button">
      <!-- <a-popconfirm title="确定放弃编辑？" @confirm="onClose" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm> -->
      <a-button @click="exportExcel" type="primary" :loading="funloading">导出Excel</a-button>
      <a-button @click="onClose" type="primary">取消</a-button>
    </div>
  </a-drawer>
</template>

<script>
export default {
  name: 'HkList',
  props: {
    hkListVisiable: {
      default: false
    },
    dataSource: {
      default: []
    }
  },
  data () {
    return {
      advanced: false,
      projBasicId: null,
      queryParams: {},
      paginationInfo: null,
      loading: false,
      funloading: false,
      selectedRowKeys: [],
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 5,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      }
    }
  },
  computed: {
    columns () {
      return [{
        title: '付款单位名称',
        dataIndex: 'ProjName',
        width: '20%'
      }, {
        title: '收款日期',
        dataIndex: 'DateTime',
        width: '15%',
        sorter: (a, b) => {
          let ta = new Date(a.DateTime)
          let tb = new Date(b.DateTime)
          return ta.getTime() - tb.getTime()
        }
      }, {
        title: '金额',
        dataIndex: 'Amount',
        width: '10%'
      }, {
        title: '项目编号',
        dataIndex: 'XMBH',
        width: '10%'
      }, {
        title: '合同编号',
        dataIndex: 'HTBH',
        width: '10%'
      }, {
        title: '确认人',
        dataIndex: 'SKQRR',
        width: '10%'
      },
      {
        title: '收款部门',
        dataIndex: 'BuMen',
        width: '15%'
      }, {
        title: '流程号',
        dataIndex: 'SM',
        width: '10%'
      }]
    }
  },
  mounted () {

  },
  methods: {
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    exportExcel () {
      this.$emit('exportExcel', 'hk')
    },
    onClose () {
      this.loading = false
      this.$emit('close', 'HK')
    },
    handleSubmit () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择要导入的流程')
        return
      }
      let flowIds = []
      for (let key of this.selectedRowKeys) {
        flowIds.push(this.dataSource[key].ID)
      }
      let projId = this.projId
      let type = this.type
      this.$post('server/proj.php', {
        projId: projId,
        type: type,
        flowIds: flowIds.join(','),
        action: 'relateProj'
      }).then(() => {
        this.selectedRowKeys = []
        this.$message.success('导入成功')
        this.$emit('fresh')
        this.$emit('close', 'HK')
      })
    },
    // 删除
    del (record) {
      let that = this
      that.$confirm({
        title: '取消关注',
        content: '确定取消关注?',
        onOk () {
          that.$delete('admin/projFollow/' + record.projFollowId).then(() => {
            that.$message.success('取消关注成功')
            that.search()
          })
        },
        onCancel () {}
      })
    },
    search () {
      // let {sortedInfo, filteredInfo} = this
      // let sortField, sortOrder
      // // 获取当前列的排序和列的过滤规则
      // if (sortedInfo) {
      //   sortField = sortedInfo.field
      //   sortOrder = sortedInfo.order
      // }
      this.fetch({
        // sortField: sortField,
        // sortOrder: sortOrder,
        ...this.queryParams
      })
    },
    reset () {
      this.queryParams.requestName = ''
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter

      // this.projInfo.visiable = false
      this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...this.queryParams,
        ...filters
      })
    },
    fetch (params = {}) {
      // 显示loading
      // this.loading = true
      // if (this.paginationInfo) {
      //   // 如果分页信息不为空，则设置表格当前第几页，每页条数，并设置查询分页参数
      //   this.$refs.TableInfo.pagination.current = this.paginationInfo.current
      //   this.$refs.TableInfo.pagination.pageSize = this.paginationInfo.pageSize
      //   params.pageSize = this.paginationInfo.pageSize
      //   params.pageNum = this.paginationInfo.current
      // } else {
      //   // 如果分页信息为空，则设置为默认值
      //   params.pageSize = this.pagination.defaultPageSize
      //   params.pageNum = this.pagination.defaultCurrent
      // }
      // params.type = this.type
      // this.$get('server/proj.php', {
      //   action: 'getWorkFlow',
      //   ...params
      // }).then((r) => {
      //   let data = r.data
      //   const pagination = { ...this.pagination }
      //   pagination.total = data.total
      //   this.dataSource = data.records
      //   this.pagination = pagination
      //   // 数据加载完毕，关闭loading
      //   this.loading = false
      //   this.selectedRowKeys = []
      // })
    }
  },
  watch: {
    hkListVisiable () {
      // if (this.hkListVisiable) {
      //   this.fetch()
      // }
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../static/less/Common";
</style>
