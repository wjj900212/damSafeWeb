<!--suppress ALL -->
<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <!-- 搜索区域 -->
      <a-form layout="horizontal">
        <a-row >
        <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="用户名"
                :labelCol="{span: 4}"
                :wrapperCol="{span: 18, offset: 2}">
                <a-input v-model="queryParams.username" placeholder="请输入"/>
              </a-form-item>
            </a-col>
          <a-col :md="12" :sm="24" >
            <a-form-item
              label="水库"
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
    <!-- 用户信息查看 -->
    <user-info
      :userInfoData="userInfo.data"
      :userInfoVisiable="userInfo.visiable"
      @close="handleUserInfoClose">
    </user-info>
    <!-- 新增用户 -->
    <user-add
      @close="handleUserAddClose"
      @success="handleUserAddSuccess"
      :userAddVisiable="userAdd.visiable">
    </user-add>
    <!-- 修改用户 -->
    <user-edit
      ref="userEdit"
      @close="handleUserEditClose"
      @success="handleUserEditSuccess"
      :userEditVisiable="userEdit.visiable">
    </user-edit>
  </a-card>
</template>

<script>
import { mapState } from 'vuex'
import UserInfo from './UserInfo'
import RangeDate from '@/components/datetime/RangeDate'
import UserAdd from './UserAdd'
import UserEdit from './UserEdit'

export default {
  name: 'User',
  components: {UserInfo, UserAdd, UserEdit, RangeDate},
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
        title: '姓名',
        dataIndex: 'username',
        width: '10%'
      }, {
        title: '角色',
        dataIndex: 'roleId',
        width: '10%',
        customRender: (text) => {
          switch (text) {
            case '0':
              return '主管部门'
            case '1':
              return '水库管理员'
            case '2':
              return '运维人员'
          }
        },
        filters: [
          {
            text: '主管部门',
            value: '0'
          },
          {
            text: '水库管理员',
            value: '1'
          },
          {
            text: '运维人员',
            value: '2'
          }],
        filterMultiple: true,
        filteredValue: filteredInfo.roleId || null,
        onFilter: (value, record) => record.roleId.includes(value)
      }, {
        title: '职位',
        dataIndex: 'roleName',
        width: '20%'
      },
      {
        title: '水库权限',
        dataIndex: 'userProjCount',
        width: '10%'
      }, {
        title: '创建时间',
        width: '10%',
        dataIndex: 'userFollowCount'
      },
      {
        title: '最近登录时间',
        dataIndex: 'lastLoginTime',
        width: '17%'
      }, {
        title: '操作',
        dataIndex: 'operation',
        customRender: (text, record) => (
          <div>
            <a-icon type="setting" theme="twoTone" twoToneColor="#4a9ff5" class="icon-size" onClick={() => { this.edit(record) }} title="编辑"></a-icon>
            <a-icon type="delete" theme="twoTone" twoToneColor="#42b983" class="icon-size" onClick={() => { this.userDelete(record) }} title="删除"></a-icon>
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
</style>
