<template>
  <a-card :bordered="false" class="card-area" v-if="$route.path === '/system/reservoir/reservoir'">
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
                <cascader @getDistData="getDistData" :updateOptions="optionCityInfo" :defaultValue="casdata"></cascader>
              </a-form-item>
            </a-col>
          </div>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="searchTable">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetFilter">重置</a-button>
          </span>
        </a-row>
      </a-form>
    </div>
    <div>
      <div class="operator">
        <a-button type="primary" @click="$router.push('/system/reservoir/reservoir_add')">添加</a-button>
      </div>
      <!-- 表格区域 -->
      <a-table ref="TableInfo" :rowKey="(record,index)=>{return index}" :columns="columns" :dataSource="dataSource"
        :pagination="pagination" :loading="loading" :scroll="{ x: 900 }" @change="handleTableChange">
        <template slot="operation" slot-scope="text, record">
          <div class="icons-list">
            <a-icon type="eye" theme="twoTone" twoToneColor="#4a9ff5" title="2D" @click="visualConfig(record)"></a-icon>
            <a-icon type="warning" theme="twoTone" twoToneColor="#4a9ff5" title="监测场景"
              @click="getScene(record)"></a-icon>
            <a-icon type="info-circle" theme="twoTone" twoToneColor="#4a9ff5" title="监测点"
              @click="goReservoirMonitoringPoint(record)"></a-icon>
            <a-icon type="user" title="用户" @click="goReservoirUser(record)"></a-icon>
            <a-icon type="setting" theme="twoTone" twoToneColor="#4a9ff5" title="编辑"
              @click="$router.push('/system/reservoir/reservoir_edit?reservoirId='+record.reservoirId)"></a-icon>
            <a-icon type="delete" theme="twoTone" twoToneColor="#4a9ff5" @click="reservoirDelete(record)" title="删除">
            </a-icon>
          </div>
        </template>
      </a-table>
    </div>
    <sceneVisual :visible="visualVisible" :id="reservoirId" :name="reservoirName" :sceneType="sceneType" @close="()=>{ visualVisible=false }"/>
  </a-card>
  <router-view v-else />
</template>

<script>
import {
  mapState
} from 'vuex'
import Cascader from '@/components/distselect/cascader.vue'
import sceneVisual from './scene2D.vue'
export default {
  name: 'reservoir',
  components: {
    Cascader,
    sceneVisual
  },
  data () {
    return {
      queryParams: {
        name: '',
        levelCode: '',
        reservoirStatus: '',
        scale: ''
      },
      areaList: [], // 城市列表
      loading: false,
      dataSource: [],
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        pageSize: 10,
        current: 1,
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
        // onChange: (cur, size) => this.pageChange(cur, size),
        // onShowSizeChange: (cur, size) => this.pageChange(cur, size),
      },
      optionCityInfo: [],
      casdata: [],
      reservoirId: 0,
      reservoirName: '',
      sceneType: 0, // 二维可视化类型 0 水库 1 监测场景
      visualVisible: false // 二维可视化弹框
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
      return [/* {
        title: '序号',
        customRender: (text, record, index) => `${index + 1}`
      }, */{
          title: '水库名称',
          dataIndex: 'reservoirName'
        }, {
          title: '地址',
          dataIndex: 'cityName'
        }, {
          title: '管理单位',
          dataIndex: 'managerUnit'
        }, {
          title: '安全状态',
          dataIndex: 'reservoirStatus',
          customRender: (text) => {
            switch (text) {
              case '0':
                return '正常'
              case '1':
                return '异常'
              case '2':
                return '险情'
            }
          },
          filters: [{
            text: '正常',
            value: '0'
          },
          {
            text: '异常',
            value: '1'
          },
          {
            text: '险情',
            value: '2'
          }
          ],
          filterMultiple: false
        }, {
          title: '监测场景',
          dataIndex: 'sceneCount'
        },
        {
          title: '水库规模',
          dataIndex: 'scale',
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
          filterMultiple: false
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
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
  methods: {
    // 获取子组件返回的cityCode和cityType
    getDistData (distData) {
      this.queryParams.levelCode = distData.cityCode
    },
    goReservoirUser (record) {
      this.$router.push('/system/reservoir/user?reservoirId=' + record.reservoirId)
    },
    getScene (record) {
      this.$router.push('/system/reservoir/scene?reservoirId=' + record.reservoirId)
    },
    goReservoirMonitoringPoint (record) {
      // console.log('跳转监测点水库信息', record)
      this.$router.push('/system/reservoir/monitoring_point?reservoirId=' + record.reservoirId)
    },
    reservoirDelete (record) {
      let that = this
      this.$confirm({
        title: '确定删除该水库?',
        content: '当您点击确定按钮后，这个水库将会被彻底删除',
        centered: true,
        onOk () {
          that.$post('/web/reservoirAdmin/deleteReservoir', {
            reservoirId: record.reservoirId
          }).then(() => {
            that.$message.success('删除成功')
            that.getReservoirList()
          })
        },
        onCancel () {
          that.selectedRowKeys = []
        }
      })
    },
    // 表格页码及size 表格筛选
    handleTableChange (pagination, filter) {
      // console.log(pagination,filter)
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getReservoirList({
        ...this.queryParams,
        ...filter
      })
    },
    // 获取水库列表
    getReservoirList (params = {}) {
      if (!params.name)params.name = ''
      if (!params.levelCode)params.levelCode = ''
      // 如果分页信息为空，则设置为默认值
      params.pageSize = this.pagination.pageSize
      params.pageNum = this.pagination.current
      if (params.reservoirStatus) params.reservoirStatus = params.reservoirStatus.join(',')
      if (params.scale) params.scale = params.scale.join(',')
      this.$get('/web/reservoirAdmin/reservoirList', params).then(res => {
        let rr = res.data
        let data = rr.data
        this.pagination.total = data.total
        this.dataSource = data.records
      })
    },
    searchTable () {
      this.getReservoirList({
        ...this.queryParams
      })
    },
    visualConfig (record) {
      // console.log('场景可视化列表信息', record)
      this.reservoirId = record.reservoirId
      this.reservoirName = record.reservoirName
      this.visualVisible = true
    }
  },
  mounted () {
    this.getReservoirList({
      ...this.queryParams
    })
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
