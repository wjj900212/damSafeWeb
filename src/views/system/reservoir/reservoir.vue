<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <!-- 搜索区域 -->
      <a-form layout="horizontal">
        <a-row >
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="水库名称"
                :labelCol="{span: 4}"
                :wrapperCol="{span: 18, offset: 2}">
                <a-input v-model="queryParams.username" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="所在地区"
                :labelCol="{span: 4}"
                :wrapperCol="{span: 18, offset: 2}">
                <a-input v-model="queryParams.shuiku" placeholder="请输入"/>
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
      <div class="operator">
        <a-button type="primary" @click="add">添加</a-button>
      </div>
      <!-- 表格区域 -->
      <a-table ref="TableInfo"
               :rowKey="(record,index)=>{return index}"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :loading="loading"
               :scroll="{ x: 900 }"
               @change="handleTableChange">
      </a-table>
    </div>
  </a-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'reservoir',
  components: {},
  data () {
    return {
      advanced: false,
      userInfo: {
        visiable: false,
        data: {}
      },
      userAdd: {
        visiable: false
      },
      userEdit: {
        visiable: false
      },
      queryParams: {},
      filteredInfo: null,
      sortedInfo: null,
      paginationInfo: null,
      dataSource: [],
      selectedRowKeys: [],
      loading: false,
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      }
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.account.user
    }),
    columns () {
      let { filteredInfo } = this
      filteredInfo = filteredInfo || {}
      return [{
        title: '序号',
        customRender: (text, record, index) => `${index + 1}`
      }, {
        title: '水库名称',
        dataIndex: 'username'
      }, {
        title: '地址',
        dataIndex: 'roleName3'
      }, {
        title: '管理单位',
        dataIndex: 'roleName2'
      }, {
        title: '安全状态',
        dataIndex: 'roleId',
        customRender: (text) => {
          switch (text) {
            case '0':
              return '无风险'
            case '1':
              return '有风险'
          }
        },
        filters: [
          {
            text: '无风险',
            value: '0'
          },
          {
            text: '有风险',
            value: '1'
          }],
        filterMultiple: true,
        filteredValue: filteredInfo.roleId || null,
        onFilter: (value, record) => record.roleId.includes(value)
      }, {
        title: '监测场景',
        dataIndex: 'roleName1'
      },
      {
        title: '水库规模',
        dataIndex: 'userProjCount',
        customRender: (text) => {
          switch (text) {
            case '0':
              return '大(1)型'
            case '1':
              return '大(2)型'
            case '2':
              return '中型'
            case '3':
              return '小(1)型'
            case '4':
              return '小(2)型'
          }
        },
        filters: [
          {text: '大(1)型', value: '0'},
          {text: '大(2)型', value: '1'},
          {text: '中型', value: '2'},
          {text: '小(1)型', value: '3'},
          {text: '小(2)型', value: '4'}
        ],
        filterMultiple: true,
        filteredValue: filteredInfo.userProjCount || null,
        onFilter: (value, record) => record.userProjCount.includes(value)
      }, {
        title: '水库类型',
        dataIndex: 'userFollowCount'
      },
      {
        title: '创建时间',
        dataIndex: 'lastLoginTime'
      }, {
        title: '操作',
        dataIndex: 'operation',
        customRender: (text, record) => (
          <div class="icons-list">
            <a-icon type="warning" theme="twoTone" twoToneColor="#4a9ff5" onClick={() => { this.edit(record) }} title="监测场景"></a-icon>
            <a-icon type="info-circle" theme="twoTone" twoToneColor="#4a9ff5" onClick={() => { this.userDelete(record) }} title="监测点"></a-icon>
            <a-icon type="user" onClick={() => { this.userDelete(record) }} title="用户"></a-icon>
            <a-icon type="setting" theme="twoTone" twoToneColor="#4a9ff5" onClick={() => { this.edit(record) }} title="编辑"></a-icon>
            <a-icon type="delete" theme="twoTone" twoToneColor="#4a9ff5" onClick={() => { this.userDelete(record) }} title="删除"></a-icon>
          </div>
        )
      }]
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    add () {
      this.userAdd.visiable = true
    },
    handleUserAddClose () {
      this.userAdd.visiable = false
    },
    handleUserAddSuccess () {
      this.userAdd.visiable = false
      this.$message.success('新增用户成功，初始密码为1234qwer')
      this.search()
    },
    edit (record) {
      this.$refs.userEdit.setFormValues(record)
      this.userEdit.visiable = true
    },
    handleUserEditClose () {
      this.userEdit.visiable = false
    },
    handleUserEditSuccess () {
      this.userEdit.visiable = false
      this.$message.success('修改用户成功')
      this.search()
    },
    handleUserInfoClose () {
      this.userInfo.visiable = false
    },
    userDelete (record) {
      let that = this
      this.$confirm({
        title: '确定删除该用户?',
        content: '当您点击确定按钮后，这个用户将会被彻底删除',
        centered: true,
        onOk () {
          let userIds = []
          userIds.push(record.userId)
          that.$post('server/user.php', {
            userIds: userIds.join(','),
            action: 'deleteUsers'
          }).then(() => {
            that.$message.success('删除成功')
            that.selectedRowKeys = []
            that.search()
          })
        },
        onCancel () {
          that.selectedRowKeys = []
        }
      })
    },
    search () {
      let {filteredInfo} = this
      this.fetch({
        ...this.queryParams,
        ...filteredInfo
      })
    },
    reset () {
      // 重置分页
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
      if (this.paginationInfo) {
        this.paginationInfo.current = this.pagination.defaultCurrent
        this.paginationInfo.pageSize = this.pagination.defaultPageSize
      }
      // 重置列过滤器规则
      this.filteredInfo = null
      // 重置查询参数
      this.queryParams = {}
      this.fetch()
    },
    handleTableChange (pagination, filters) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.fetch({
        ...this.queryParams,
        ...filters
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
      if (this.currentUser.type === '1') {
        params.type = '1' // 项目管理员
      }
      this.$get('server/user.php', {
        action: 'finduserpage',
        ...params
      }).then((r) => {
        let data = r.data
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
  .icons-list /deep/ .anticon {
    margin-right: 10px;
    font-size: 18px;
  }
</style>
