<template>
  <a-card :bordered="false" class="card-area" v-if="$route.path === '/system/reservoir/user'">
    <div>
      <!-- 搜索区域 -->
      <a-form layout="horizontal">
        <a-row>
          <div class="fold">
            <a-col :md="12" :sm="24">
              <a-form-item label="水库" :labelCol="{span: 4}" :wrapperCol="{span: 18, offset: 1}">
                <a-select
                  placeholder="选择水库"
                  show-search
                  allowClear
                  :disabled="disabledFlag"
                  v-model="reservoirName"
                  :filterOption="filterOption"
                  @change="setReservoir"
                >
                  <a-select-option v-for="(item,index) in reservoirList" :key="'reservoirId' + index" :value="item.reservoirId">
                    {{ item.reservoirName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="用户名称" :labelCol="{span: 4}" :wrapperCol="{span: 18, offset: 2}">
                <a-input v-model="queryParams.userName" placeholder="请输入" />
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
    <div>
      <!-- 表格区域 -->
      <a-table ref="TableInfo" :rowKey="(record,index)=>{return index}" :columns="columns" :dataSource="dataSource"
               :pagination="pagination" :loading="loading" :scroll="{ x: 900 }" @change="handleTableChange">
      </a-table>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'user',
  data () {
    return {
      queryParams: {},
      loading: false,
      dataSource: [],
      paginationInfo: null,
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      reservoirId: '',
      reservoirList: [],
      reservoirName: '',
      disabledFlag: false
    }
  },
  computed: {
    columns () {
      return [{
        title: '序号',
        customRender: (text, record, index) => `${index + 1}`
      }, {
        title: '姓名',
        dataIndex: 'userName'
      }, {
        title: '手机号',
        dataIndex: 'mobile'
      }, {
        title: '用户角色',
        dataIndex: 'roleName'
      },
      {
        title: '最近登录时间',
        dataIndex: 'loginTime'
      }
      ]
    }
  },
  beforeRouteEnter (to, from, next) {
    // 项目列表迁移时，设置默认值
    next(vm => {
      vm.init()
    })
  },
  methods: {
    init () {
      this.reservoirId = this.$route.query.reservoirId
      if (this.reservoirId) {
        this.queryParams.reservoirId = this.reservoirId
        this.disabledFlag = true
      }
      this.$get('web/hidden/getReservoirList').then((r) => {
        this.reservoirList = r.data.data
        if (this.reservoirList && this.reservoirId) {
          for (let i = 0; i < this.reservoirList.length; i++) {
            let currentProj = this.reservoirList[i]
            if (currentProj.reservoirId.toString() === this.reservoirId) {
              this.reservoirName = currentProj.reservoirName
              break
            }
          }
        }
        this.search()
      })
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    setReservoir (value) {
      if (value) {
        this.queryParams.reservoirId = value
      } else {
        delete this.queryParams.reservoirId
      }
      this.search()
    },
    search () {
      // 重置分页
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
      if (this.paginationInfo) {
        this.paginationInfo.current = this.pagination.defaultCurrent
        this.paginationInfo.pageSize = this.pagination.defaultPageSize
      }
      this.fetch({
        ...this.queryParams
      })
    },
    reset () {
      // 重置分页
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
      if (this.paginationInfo) {
        this.paginationInfo.current = this.pagination.defaultCurrent
        this.paginationInfo.pageSize = this.pagination.defaultPageSize
      }
      // 重置查询参数
      this.queryParams = {}
    },
    handleTableChange (pagination) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.fetch({
        ...this.queryParams
      })
    },
    fetch (params = {}) {
      // 显示loading
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
      params.reservoirId = this.reservoirId
      this.$get('web/reservoirAdmin/findUserOfReservoir', {
        ...params
      }).then((r) => {
        let data = r.data.data
        const pagination = { ...this.pagination }
        pagination.total = data.total
        this.dataSource = data.records
        this.pagination = pagination
        // 数据加载完毕，关闭loading
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../../../static/less/Common";
</style>
