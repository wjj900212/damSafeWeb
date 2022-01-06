<template>
  <!-- 监测场景 scene -->
  <a-card :bordered="false" class="card-area" v-if="$route.path === '/system/reservoir/scene'">
    <div>
      <!-- 搜索区域 -->
      <a-form layout="horizontal">
        <a-row>
          <div class="fold">
            <a-col :md="8" :sm="20">
              <a-form-item label="场景名称" :labelCol="{span: 5}" :wrapperCol="{span: 16, offset: 0}">
                <a-input v-model="queryParams.name" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="20">
              <a-form-item label="所在地区" :labelCol="{span: 5}" :wrapperCol="{span: 16, offset: 0}">
                <a-input v-model="queryParams.area" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="20">
              <a-form-item label="测站编码" :labelCol="{span: 5}" :wrapperCol="{span: 16}">
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
        <a-button type="primary" @click="$router.push('/system/reservoir/scene/scene_add')">添加</a-button>
      </div>
      <!-- 表格区域 -->
      <a-table ref="TableInfo" :rowKey="(record,index)=>{return index}" :columns="columns" :dataSource="dataSource"
        :pagination="pagination" :loading="loading" :scroll="{ x: 900 }">
        <template slot="operation" slot-scope="text, record">
          <div class="icons-list">
            <a-icon type="setting" theme="twoTone" twoToneColor="#4a9ff5" title="编辑"
              @click="$router.push('/system/reservoir/scene/scene_edit')"></a-icon>
            <a-icon type="eye" theme="twoTone" twoToneColor="#4a9ff5" title="2D" @click="visualVisible=true"></a-icon>
            <a-icon type="delete" theme="twoTone" twoToneColor="#4a9ff5" @click="userDelete(record)" title="删除">
            </a-icon>
          </div>
        </template>
      </a-table>
      <sceneVisual :visible="visualVisible" @close="()=>{ visualVisible=false }"/>
    </div>
  </a-card>
  <router-view v-else />
</template>

<script>
  import {mapState} from 'vuex'
  import sceneVisual from "./scene2D.vue"
  export default {
    name: 'reservoir',
    components: {sceneVisual},
    data() {
      return {
        queryParams: {
          name: '',
          area: ''
        },
        loading: false,
        dataSource: [{
          name: '121',
          roleId: 1
        }],
        pagination: {
          pageSizeOptions: ['10', '20', '30', '40', '100'],
          defaultCurrent: 1,
          defaultPageSize: 10,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
        },
        visualVisible:false,//二维可视化弹框
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
            customRender: (text, record, index) => `${index + 1}`
          }, {
            title: '场景名称',
            dataIndex: 'name'
          }, {
            title: '类型',
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
          }, 
          // {
          //   title: '测站编码',
          //   dataIndex: 'name'
          // }, {
          //   title: '所在地区',
          //   dataIndex: 'name'
          // }, {
          //   title: '经纬度',
          //   dataIndex: 'name'
          // }, {
          //   title: '实景图',
          //   dataIndex: 'name'
          // },
          // {
          //   title: '建设时间',
          //   dataIndex: 'name'
          // }, 
          {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: {
              customRender: 'operation'
            }
          }
        ]
      }
    },
    mounted() {},
    methods: {
      userDelete(record) {
        let that = this
        this.$confirm({
          title: '确定删除该用户?',
          content: '当您点击确定按钮后，这个用户将会被彻底删除',
          centered: true,
          onOk() {
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
          onCancel() {
            that.selectedRowKeys = []
          }
        })
      },
    }
  }

</script>
<style lang="less" scoped>
  @import "../../../../static/less/Common";

  .icons-list /deep/ .anticon {
    margin-right: 1rem;
    font-size: 1.8rem;
  }

</style>
