<template>
  <!-- 监测场景 scene -->
  <a-card :bordered="false" class="card-area" v-if="$route.path === '/system/reservoir/scene'">
    <div>
      <!-- 搜索区域 -->
      <a-form layout="horizontal">
        <a-row>
          <div class="fold">
            <a-col :md="6" :sm="20">
              <a-form-item label="水库" :labelCol="{span: 4}" :wrapperCol="{span: 18, offset: 1}">
                <a-select placeholder="选择水库" show-search allowClear :disabled="disabledFlag" v-model="reservoirName"
                  :filterOption="filterOption" @change="setReservoir">
                  <a-select-option v-for="(item,index) in reservoirList" :key="'reservoirId' + index"
                    :value="item.reservoirId">
                    {{ item.reservoirName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="20">
              <a-form-item label="场景名称" :labelCol="{span: 5}" :wrapperCol="{span: 16, offset: 0}">
                <a-input v-model="queryParams.key" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="20">
              <a-form-item label="所在地区" :labelCol="{span: 5}" :wrapperCol="{span: 16, offset: 0}">
                <cascader @getDistData="getDistData" :updateOptions="optionCityInfo" :defaultValue="casdata"></cascader>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="20">
              <a-form-item label="测站编码" :labelCol="{span: 5}" :wrapperCol="{span: 16}">
                <a-input v-model="queryParams.stationCode" placeholder="请输入" />
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
        <a-button type="primary" @click="$router.push('/system/reservoir/scene/scene_add?reservoirId=' + reservoirId)">
          添加</a-button>
      </div>
      <!-- 表格区域 -->
      <a-table ref="TableInfo" :rowKey="(record,index)=>{return index}" :columns="columns" :dataSource="dataSource"
        :pagination="pagination" :loading="loading" :scroll="{ x: 900 }" @change="handleTableChange">
        <template slot="latitude" slot-scope="text, record">
          <span>{{record.longitude}},{{record.latitude}}</span>
        </template>
        <template slot="image" slot-scope="text">
          <img :src="text" style="width:3rem;height: 3rem;" />
        </template>
        <template slot="operation" slot-scope="text, record">
          <div class="icons-list">
            <a href="javascript:;" @click="goEdit(record)">编辑</a>
            <a href="javascript:;" v-if="record.hiddenType==12" @click="hiddenId=record.hiddenId;lineVisible=true">浸润线配置</a>
            <a href="javascript:;" v-else @click="visualConfig(record)">可视化配置</a>
            <a href="javascript:;" @click="hiddenDelete(record)">删除</a>
          </div>
        </template>
      </a-table>
      <!-- 可视化配置 -->
      <sceneVisual :visible="visualVisible" :id="hiddenId" :name="hiddenName" :hiddenType="hiddenType"
        :sceneType="sceneType" @close="()=>{ visualVisible=false }" />
        <!-- 浸润线配置 -->
        <phreaticLine :visible="lineVisible" :hiddenId="hiddenId"  @close="()=>{ lineVisible=false }"/>
    </div>
  </a-card>
  <router-view v-else />
</template>

<script>
import {
  mapState
} from 'vuex'
import sceneVisual from './scene2D.vue'
import Cascader from '@/components/distselect/cascader.vue'
export default {
  name: 'reservoir',
  components: {
    sceneVisual,
    Cascader
  },
  data () {
    return {
      reservoirId: '',
      queryParams: {},
      optionCityInfo: [], // 省市区筛选所传的值
      casdata: [],
      loading: false,
      dataSource: [],
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      visualVisible: false, // 二维可视化弹框
      hiddenPointSource: {},
      reservoirList: [],
      reservoirName: '',
      disabledFlag: false,
      hiddenId: 0,
      hiddenName: '',
      hiddenType: '',
      sceneType: 1
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
        title: '场景名称',
        dataIndex: 'hiddenName'
      }, {
        title: '类型',
        dataIndex: 'hiddenTypeName'
      },
      {
        title: '测站编码',
        dataIndex: 'stationCode'
      }, {
        title: '所在地区',
        dataIndex: 'cityName'
      }, {
        title: '经纬度',
        dataIndex: 'latitude',
        scopedSlots: {
          customRender: 'latitude'
        }
      }, {
        title: '实景图',
        dataIndex: 'image',
        scopedSlots: {
          customRender: 'image'
        }
      },
      {
        title: '建设时间',
        dataIndex: 'createTime'
      },
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
  beforeRouteEnter (to, from, next) {
    // 项目列表迁移时，设置默认值
    next(vm => {
      vm.init()
    })
  },
  watch: {
    '$route': function (to, from) {
      if (to.path === '/system/reservoir/scene') {
        this.init()
      }
    }
  },
  methods: {
    // 获取子组件返回的cityCode和cityType
    getDistData (distData) {
      this.queryParams.cityCode = distData.cityCode
    },
    init () {
      if (this.$route.query.reservoirId) {
        this.reservoirId = this.$route.query.reservoirId
      }
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
      })
      this.search()
    },
    visualConfig (record) {
      // console.log('场景可视化列表信息', record)
      // this.hiddenPointSource = record
      this.hiddenId = record.hiddenId
      this.hiddenName = record.hiddenName
      this.hiddenType = record.hiddenType
      this.visualVisible = true
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    setReservoir (value) {
      if (value) {
        this.queryParams.reservoirId = value
        this.reservoirId = value
      } else {
        delete this.queryParams.reservoirId
      }
      this.search()
    },
    // 点击查询
    search () {
      this.fetch({
        ...this.queryParams
      })
    },
    // 查询重置
    reset () {
      this.pagination.current = 1
      this.pagination.pageSize = 10
      // 重置查询参数
      this.queryParams = {}
      this.fetch({
        ...this.queryParams
      })
    },
    handleTableChange (pagination, filters) {
      // 将这三个参数赋值给Vue data，用于后续使用
      // this.paginationInfo = pagination
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.filteredInfo = filters
      this.fetch({
        ...this.queryParams,
        ...filters
      })
    },
    fetch (params = {}) {
      // 显示loading
      this.loading = true
      params.pageSize = this.pagination.pageSize
      params.pageNum = this.pagination.current
      params.reservoirId = this.reservoirId
      console.log(params)
      // return
      this.$get('web/hidden/getHiddenList', {
        ...params
      }).then((r) => {
        let data = r.data.data
        const pagination = {
          ...this.pagination
        }
        pagination.total = data.total
        this.dataSource = data.records
        this.pagination = pagination
        // 数据加载完毕，关闭loading
        this.loading = false
      })
    },
    hiddenDelete (record) {
      let that = this
      this.$confirm({
        title: '确定删除该监测场景?',
        content: '当您点击确定按钮后，这个监测场景将会被彻底删除',
        centered: true,
        onOk () {
          let hiddenIds = []
          hiddenIds.push(record.hiddenId)
          that.$post('web/hidden/deleteHiddenPoint', {
            ids: hiddenIds.join(',')
          }).then((r) => {
            if (r.data.code === 1) {
              that.$message.success('删除成功')
              that.search()
            } else {
              that.$message.error(r.data.msg)
            }
          })
        },
        onCancel () {}
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

  .icons-list /deep/ .anticon {
    margin-right: 1rem;
    font-size: 1.8rem;
  }

</style>
