<!--suppress ALL -->
<template>
  <a-card :bordered="false" class="card-area">
    <div>
      <!-- 搜索区域 -->
      <a-form layout="horizontal">
        <a-row>
          <a-col :md="6" :sm="20">
            <a-form-item label="用户名" :labelCol="{span: 4}" :wrapperCol="{span: 18, offset: 0}">
              <a-input v-model="queryParams.userName" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="20">
            <a-form-item label="水库" :labelCol="{span: 4}" :wrapperCol="{span: 18, offset: 0}">
              <a-input v-model="queryParams.reservoirName" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="search">查询
              <img src="static/img/查询 拷贝 3.png" style="margin-left:8px;"></a-button>
            <a-button style="margin-left: 8px;border: 1px solid #188FFF;background: #188fff1a;color: #1890FF;"
              @click="reset">重置
              <img src="static/img/重置.png" style="margin-left:8px;"></a-button>
            <a-button style="margin-left: 8px;border: 1px solid #188FFF;background: #188fff1a;color: #1890FF;"
              @click="add">添加
              <img src="static/img/添加.png" style="margin-left:8px;"></a-button>
          </span>
        </a-row>
      </a-form>
    </div>
    <div class="tableBox">
      <!-- 表格区域 -->
      <a-table ref="TableInfo" :rowKey="(record,index)=>{return index}" :columns="columns" :dataSource="dataSource"
        :pagination="pagination" :loading="loading" :scroll="{ x: 900 }" @change="handleTableChange">
        <template slot="operation" slot-scope="text, record">
          <div class="icons-list">
            <a href="javascript:;" @click="updatePassword(record)">修改密码</a>
            <a href="javascript:;" @click="edit(record)">编辑</a>
            <a href="javascript:;" @click="userDelete(record)">删除</a>
          </div>
        </template>
      </a-table>
    </div>
    <!-- 用户信息查看 -->
    <user-info :userInfoData="userInfo.data" :userInfoVisiable="userInfo.visiable" @close="handleUserInfoClose">
    </user-info>
    <!-- 新增用户 -->
    <user-add @close="handleUserAddClose" @success="handleUserAddSuccess" :userAddVisiable="userAdd.visiable">
    </user-add>
    <!-- 修改用户 -->
    <user-edit ref="userEdit" @close="handleUserEditClose" @success="handleUserEditSuccess"
      :userEditVisiable="userEdit.visiable">
    </user-edit>
    <!--修改密码-->
    <update-password @success="handleUpdate" @cancel="()=>{updatePasswordModelVisible=false}" :user="userInfo.data"
      :updatePasswordModelVisible="updatePasswordModelVisible">
    </update-password>
  </a-card>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  import UserInfo from './UserInfo'
  import RangeDate from '@/components/datetime/RangeDate'
  import UserAdd from './UserAdd'
  import UserEdit from './UserEdit'
  import UpdatePassword from './UpdatePassword'

  export default {
    name: 'User',
    components: {
      UserInfo,
      UserAdd,
      UserEdit,
      RangeDate,
      UpdatePassword
    },
    data() {
      return {
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
        loading: false,
        pagination: {
          pageSizeOptions: ['10', '20', '30', '40', '100'],
          defaultCurrent: 1,
          defaultPageSize: 10,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
        },
        updatePasswordModelVisible: false
      }
    },
    computed: {
      ...mapState({
        currentUser: state => state.account.user
      }),
      columns() {
        let {
          filteredInfo
        } = this
        filteredInfo = filteredInfo || {}
        return [{
            title: '序号',
            customRender: (text, record, index) => `${index + 1}`,
            width: 80
          }, {
            title: '姓名',
            dataIndex: 'userName'
          }, {
            title: '角色',
            dataIndex: 'roleId',
            customRender: (text) => {
              switch (text) {
                case '601':
                  return '水利主管部门'
                case '602':
                  return '水库管理员'
                case '603':
                  return '水库运维人员'
              }
            },
            filters: [{
                text: '水利主管部门',
                value: '601'
              },
              {
                text: '水库管理员',
                value: '602'
              },
              {
                text: '水库运维人员',
                value: '603'
              }
            ],
            filterMultiple: true,
            filteredValue: filteredInfo.roleId || null,
            onFilter: (value, record) => record.roleId.includes(value)
          }, {
            title: '手机号',
            dataIndex: 'mobile'
          }, {
            title: '水库权限',
            dataIndex: 'reservoirName',
            width: '20%'
          }, {
            title: '创建时间',
            dataIndex: 'createTime'
          },
          {
            title: '最近登录时间',
            dataIndex: 'loginTime'
          }, {
            title: '操作',
            dataIndex: 'operation',
            width: 180,
            scopedSlots: {
              customRender: 'operation'
            }
          }
        ]
      }
    },
    mounted() {
      this.fetch()
    },
    methods: {
      add() {
        this.userAdd.visiable = true
      },
      handleUserAddClose() {
        this.userAdd.visiable = false
      },
      handleUserAddSuccess() {
        this.userAdd.visiable = false
        this.$message.success('新增用户成功')
        this.search()
      },
      edit(record) {
        this.$refs.userEdit.setFormValues(record)
        this.userEdit.visiable = true
      },
      handleUserEditClose() {
        this.userEdit.visiable = false
      },
      handleUserEditSuccess() {
        this.userEdit.visiable = false
        this.$message.success('修改用户成功')
        this.search()
      },
      handleUserInfoClose() {
        this.userInfo.visiable = false
      },
      // 修改密码
      updatePassword(record) {
        this.userInfo.data = record
        this.updatePasswordModelVisible = true
      },
      handleUpdate() {
        this.updatePasswordModelVisible = false
        this.$message.success('更新密码成功')
      },
      // 重置密码
      resetPassword(record) {
        let that = this
        this.$confirm({
          title: '确定重置用户密码?',
          content: '当您点击确定按钮后，该用户的密码将会重置为手机号后6位',
          centered: true,
          onOk() {
            that.$post('web/user/resetPwd', {
              userId: record.userId
            }).then((r) => {
              if (r.data.code === 1) {
                that.$message.success('重置用户密码成功')
              } else {
                that.$message.error(r.data.msg)
              }
            })
          },
          onCancel() {

          }
        })
      },
      userDelete(record) {
        let that = this
        this.$confirm({
          title: '确定删除该用户?',
          content: '当您点击确定按钮后，这个用户将会被彻底删除',
          centered: true,
          onOk() {
            that.$post('web/user/deleteUser', {
              userId: record.userId
            }).then((r) => {
              if (r.data.code === 1) {
                that.$message.success('删除成功')
                that.search()
              } else {
                that.$message.error(r.data.msg)
              }
            })
          },
          onCancel() {

          }
        })
      },
      search() {
        let {
          filteredInfo
        } = this
        this.fetch({
          ...this.queryParams,
          ...filteredInfo
        })
      },
      reset() {
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
      handleTableChange(pagination, filters) {
        // 将这三个参数赋值给Vue data，用于后续使用
        this.paginationInfo = pagination
        this.filteredInfo = filters
        this.fetch({
          ...this.queryParams,
          ...filters
        })
      },
      fetch(params = {}) {
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
        this.$get('web/user/getUserList', {
          ...params
        }).then((r) => {
          if (r.data.code === 1) {
            let data = r.data.data
            const pagination = {
              ...this.pagination
            }
            pagination.total = data.total
            this.dataSource = data.records
            this.pagination = pagination
          } else {
            this.$message.error(r.data.msg)
          }
          // 数据加载完毕，关闭loading
          this.loading = false
        })
      }
    }
  }

</script>
<style lang="less" scoped>
  @import "../../../../static/less/Common";

  .icons-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

</style>
<style scoped>
  .tableBox {
    color: #242932;
  }

  .tableBox>>>.ant-table-thead>tr>th {
    background-color: #F7FAFF;
    border-color: rgba(59, 173, 255, 0.12);
  }

  .tableBox>>>.ant-table-tbody>tr>td {
    border-color: rgba(59, 173, 255, 0.12);
  }

</style>
