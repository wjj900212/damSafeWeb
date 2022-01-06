<template>
  <a-card :bordered="false" class="card-area">
    <div>
      <!-- 搜索区域 -->
      <a-form layout="horizontal">
        <a-row>
          <div class="fold">
            <a-col :md="12" :sm="24">
              <a-form-item label="水库名称" :labelCol="{span: 4}" :wrapperCol="{span: 18, offset: 2}">
                <a-input v-model="queryParams.name" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="所在地区" :labelCol="{span: 4}" :wrapperCol="{span: 18, offset: 2}">
                <a-input v-model="queryParams.area" placeholder="请输入" />
              </a-form-item>
            </a-col>
          </div>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary">查询</a-button>
            <a-button style="margin-left: 8px">重置</a-button>
          </span>
        </a-row>
      </a-form>
    </div>
    <div>
      <div class="operator">
        <a-button type="primary" @click="goAdd">添加</a-button>
      </div>
      <!-- 表格区域 -->
      <a-table ref="TableInfo" :rowKey="(record,index)=>{return index}" :columns="columns" :dataSource="dataSource"
        :pagination="pagination" :loading="loading" :scroll="{ x: 900 }">
        <template slot="operation" slot-scope="text, record">
          <div class="icons-list">
            <a-icon type="warning" theme="twoTone" twoToneColor="#4a9ff5" title="监测场景" @click="$router.push('/system/reservoir/reservoir/scene')"></a-icon>
            <a-icon type="info-circle" theme="twoTone" twoToneColor="#4a9ff5" title="监测点" @click="goReservoirMonitoringPoint(record)"></a-icon>
            <a-icon type="user" title="用户" @click="goReservoirUser"></a-icon>
            <a-icon type="setting" theme="twoTone" twoToneColor="#4a9ff5" title="编辑"></a-icon>
            <a-icon type="delete" theme="twoTone" twoToneColor="#4a9ff5" @click="userDelete(record)" title="删除">
            </a-icon>
          </div>
        </template>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import {
  mapState
} from 'vuex'
export default {
  name: 'reservoir',
  components: {},
  data () {
    return {
      queryParams: {
        name: '',
        area: ''
      },
      loading: false,
      dataSource: [{name: '121', roleId: 1}],
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
      let {
        filteredInfo
      } = this
      filteredInfo = filteredInfo || {}
      return [{
        title: '序号',
        customRender: (text, record, index) => `${index + 1}`
      }, {
        title: '水库名称',
        dataIndex: 'name'
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
        filters: [{
          text: '无风险',
          value: '0'
        },
        {
          text: '有风险',
          value: '1'
        }
        ],
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
        filters: [{
          text: '大(1)型',
          value: '0'
        },
        {
          text: '大(2)型',
          value: '1'
        },
        {
          text: '中型',
          value: '2'
        },
        {
          text: '小(1)型',
          value: '3'
        },
        {
          text: '小(2)型',
          value: '4'
        }
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
        scopedSlots: {
          customRender: 'operation'
        }
      }
      ]
    }
  },
  mounted () {},
  methods: {
    // 添加水库
    goAdd () {
      this.$router.push('/system/reservoir/reservoir_add')
    },
    goReservoirUser () {
      this.$router.push('/system/reservoir/user')
    },
    goReservoirMonitoringPoint (record) {
      this.$router.push('/system/reservoir/monitoring_point?reservoirName=' + record.name)
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
    }
  }
}

</script>
<style lang="less" scoped>
  @import "../../../../static/less/Common";

  .icons-list /deep/ .anticon {
    margin-right: 0.5rem;
    font-size: 1.6rem;
  }

</style>
