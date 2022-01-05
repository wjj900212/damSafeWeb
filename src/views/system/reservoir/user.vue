<template>
  <a-card :bordered="false" class="card-area" v-if="$route.path === '/system/reservoir/user'">
    <div>
      <!-- 搜索区域 -->
      <a-form layout="horizontal">
        <a-row>
          <div class="fold">
            <a-col :md="12" :sm="24">
              <a-form-item label="用户名称" :labelCol="{span: 4}" :wrapperCol="{span: 18, offset: 2}">
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
      <!-- 表格区域 -->
      <a-table ref="TableInfo" :rowKey="(record,index)=>{return index}" :columns="columns" :dataSource="dataSource"
               :pagination="pagination" :loading="loading" :scroll="{ x: 900 }">
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
    columns () {
      return [{
        title: '序号',
        customRender: (text, record, index) => `${index + 1}`
      }, {
        title: '姓名',
        dataIndex: 'name'
      }, {
        title: '手机号',
        dataIndex: 'roleName3'
      }, {
        title: '用户角色',
        dataIndex: 'roleName2'
      },
      {
        title: '最近登录时间',
        dataIndex: 'lastLoginTime'
      }
      ]
    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
  @import "../../../../static/less/Common";
</style>
