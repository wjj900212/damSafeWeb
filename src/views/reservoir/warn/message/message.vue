<!--suppress ALL -->
<template>
  <div class="standardList">
    <!-- 搜索区域 -->
    <a-card :bordered="false" class="card-area">
      <div style="border-bottom:1px solid rgba(24, 144, 255, 0.2)" :class="advanced ? 'search' : null">
        <a-form layout="horizontal">
          <a-row >
            <div :class="advanced ? null: 'fold'">
              <a-col :md="8" :sm="24" >
                <a-form-item
                  label="关键字"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input placeholder="水库、场景名称、监测点名称" v-model="queryParams.keyword"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24" >
                <a-form-item
                  label="预警级别"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                   <a-select
                     :allowClear="true"
                     v-model="queryParams.warnLevel"
                     style="width: 100%"
                     placeholder="请选择"
                     @change="handleWarnChange">
                     <a-select-option v-for="g in warnLevelList" :key="(g.id).toString()">{{g.label}}</a-select-option>
                   </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24" >
                <a-form-item
                  label="处置状态"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-select
                    :allowClear="true"
                    v-model="queryParams.dealWith"
                    style="width: 100%"
                    placeholder="请选择"
                    @change="handleWarnChange">
                    <a-select-option v-for="g in disposalList" :key="(g.id).toString()">{{g.label}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </div>
            <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="search">
              查询<img src="/static/img/查询 拷贝 3.png" style="margin-left:8px;">
            </a-button>
            <a-button  style="margin-left: 8px;border: 1px solid #188FFF;background: #188fff1a;color: #1890FF;" @click="reset">
              重置<img src="/static/img/重置.png" style="margin-left:8px;">
            </a-button>
          </span>
          </a-row>
          <a-row >
            <div :class="advanced ? null: 'fold'">
              <a-col :md="8" :sm="24" >
                <a-form-item
                  label="设备ID"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input placeholder="请输入" v-model="queryParams.devCode"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24" >
                <a-form-item
                  label="预警信息"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input placeholder="请输入" v-model="queryParams.warnInfo"/>
                </a-form-item>
              </a-col>
            </div>
          </a-row>
        </a-form>
      </div>
    <!--</a-card>
    <a-card :bordered="false" class="card-area" style="margin-top:10px;">-->
      <div style="display: flex;justify-content: space-between;align-content: space-between;margin-top:1rem;margin-bottom:2rem;">
        <div style="font-size: 1.6rem;font-family: Source Han Sans CN;font-weight: 400;flex: 1;">
          <span style="color:#FE5C3D;">红色预警：{{statisData.red}}</span>
          <span style="color:#FF9500;">橙色预警：{{statisData.orange}}</span>
          <span style="color:#FBDB05;">黄色预警：{{statisData.yellow}}</span>
          <span style="color:#1890FF;">蓝色预警：{{statisData.blue}}</span>
        </div>
        <div style="display: flex;width:50%;">
          <a-select
            v-model="tabPane"
            style="width: 100%;margin-right:1rem;"
            placeholder="请选择"
            @change="handleTypeChange">
            <a-select-option v-for="g in tabPaneList" :key="g.key">{{g.tab}}</a-select-option>
          </a-select>
          <a-range-picker @change="onChange" :style="{width:'100%',marginRight:'1rem'}"/>
          <a-select
            v-model="flagTime"
            :style="{width: '100%',marginRight:'1rem'}"
            placeholder="请选择"
            @change="handleRadioChange">
            <a-select-option v-for="g in tagList" :key="g.id">{{g.name}}</a-select-option>
          </a-select>
          <a-button type="primary" @click="portData">
            数据导出
          </a-button>
        </div>
      </div>
      <div>
        <a-table ref="TableMessInfo"
                 :columns="columns"
                 :dataSource="dataSource"
                 :pagination="pagination"
                 :loading="loading"
                 @change="handleTableChange">

          <template v-if="tabPane === '1' || tabPane === '2'" slot="operation" slot-scope="text, record">
            <a @click = "warnInfo(record)">详情</a>
          </template>
        </a-table>
      </div>
    </a-card>
    <!--设备预警详情-->
    <equipment-warning-info
      :visible="isShowDevWarning"
      :warnDetailData="warnDetailData"
      :cur="tabPane"
      :warnId="warnId"
      @onClose="()=>{isShowDevWarning=false}"
    ></equipment-warning-info>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
import EquipmentWarningInfo from './model/equipmentWarningInfo'
import moment from 'moment'
export default {
  name: 'message',
  components: {
    EquipmentWarningInfo
  },
  data () {
    return {
      advanced: false,
      queryParams: {
        startTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      warnLevelList: [{id: 1, label: '蓝色预警'}, {id: 2, label: '黄色预警'}, {id: 3, label: '橙色预警'}, {id: 4, label: '红色预警'}],
      disposalList: [{id: 0, label: '未处置'}, {id: 1, label: '已处置'}, {id: 2, label: '不予处置'}],
      tagList: [{id: 0, name: '今日'}, {id: 1, name: '近三天'}, {id: 2, name: '近一周'}, {id: 3, name: '近一月'}],
      flagTime: 0,
      searchTime: [],
      paginationInfo: null,
      dataSource: [],
      tabPane: '1',
      tabPaneList: [{key: '1', tab: '设备预警'}, {key: '2', tab: '安全预警'}, {key: '5', tab: '模型预警'}],
      loading: false,
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      isShowDevWarning: false,
      warnDetailData: {},
      statisData: {},
      warnId: 0
    }
  },
  computed: {
    ...mapState({
      reservoirId: state => state.account.reservoirId
    }),
    columns () {
      return [{
        title: '预警级别',
        dataIndex: 'warnLevel',
        customRender: (text) => {
          switch (text) {
            case '4':
              return <span style="color:#FE5C3D;">红色预警</span>
            case '3':
              return  <span style="color:#FF9500;">橙色预警</span>
            case '2':
              return <span style="color:#FBDB05;">黄色预警</span>
            case '1':
              return <span style="color:#1890FF;">蓝色预警</span>
          }
        }
      }, {
        title: '预警指标',
        dataIndex: 'devValueMark',
        width: '8%',
        ellipsis: true
      }, {
        title: '预警信息',
        dataIndex: 'warnInfo',
        width: '10%',
        ellipsis: true
      }, {
        title: '处置状态',
        dataIndex: 'handle',
        customRender: (text) => {
          switch (text){
            case '0':
              return <a-tag color="#42B982">未处置</a-tag>
            case '1':
              return <a-tag color="#CCCCCC">已处置</a-tag>
            case '2':
              return <a-tag color="#899DCC">不予处置</a-tag>
          }
        }
      }, {
        title: '水库',
        dataIndex: 'reservoirName',
        width: '10%',
        ellipsis: true
      }, {
        title: '监测场景',
        dataIndex: 'hiddenName'
      }, {
        title: '监测点',
        dataIndex: 'projPnName',
        width: '10%',
        ellipsis: true
      }, {
        title: '设备ID',
        dataIndex: 'devCode'
      }, {
        title: '设备类型',
        dataIndex: 'devModelName',
        width: '10%',
        ellipsis: true
      }, {
        title: '预警时间',
        dataIndex: 'warnTime',
        width: '10%',
        ellipsis: true
      }, {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: {
          customRender: 'operation'
        }
      }]
    }
  },
  watch: {
    reservoirId (val) {
      if(val){
        this.fetch()
        this.groupStatistics()
      }
    }
  },
  mounted () {
    this.fetch()
    this.groupStatistics()
  },
  methods: {
    moment,
    fetch (params = {}) {
      // 显示loading
      this.loading = true
      if (this.paginationInfo) {
        console.log('切换页数', this.paginationInfo)
        // 如果分页信息不为空，则设置表格当前第几页，每页条数，并设置查询分页参数
       /* this.$refs.TableMessInfo.pagination.current = this.paginationInfo.current
        this.$refs.TableMessInfo.pagination.pageSize = this.paginationInfo.pageSize*/
        params.pageSize = this.paginationInfo.pageSize
        params.pageNum = this.paginationInfo.current
      } else {
        // 如果分页信息为空，则设置为默认值
        params.pageSize = this.pagination.defaultPageSize
        params.pageNum = this.pagination.defaultCurrent
      }
      params.type = this.tabPane
      params.flag = this.flagTime
      params.reservoirId = this.reservoirId
      this.$get('web/earlyWarningBasic/getEarlyWarningList', {
        ...params
      }).then((r) => {
        if (r.data.code === 1) {
          let data = r.data.data
          const pagination = { ...this.pagination }
          pagination.total = data.total
          this.dataSource = data.records
          this.pagination = pagination
        } else {
          this.$message.error(r.data.msg)
        }
        // 数据加载完毕，关闭loading
        this.loading = false
      })
    },
    search () {
      this.resetCond()
      this.fetch({
        ...this.queryParams
      })
      this.groupStatistics({
        ...this.queryParams
      })
    },
    resetCond () {
      // 重置分页
     // this.$refs.TableMessInfo.pagination.current = this.pagination.defaultCurrent
      if (this.paginationInfo) {
        this.paginationInfo.current = this.pagination.defaultCurrent
        this.paginationInfo.pageSize = this.pagination.defaultPageSize
      }
    },
    reset () {
      this.resetCond()
      this.queryParams = {}
      this.fetch()
    },
    handleWarnChange (value) {
      if (value) {
        this.queryParams.warnLevel = value
      } else {
        delete this.queryParams.warnLevel
      }
    },
    handleTableChange (pagination) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.fetch({
        ...this.queryParams
      })
    },
    callback (key) {
      this.tabPane = key
      this.fetch({
        ...this.queryParams
      })
      console.log(key)
    },
    warnInfo (record) {
      console.log('预警详情', record)
      this.viewWarnDetail(record.id)
      this.isShowDevWarning = true
    },
    // 设备预警详情 和 安全预警
    viewWarnDetail(id){
      let url = ''
      if(this.tabPane === '1'){
        url = 'web/earlyWarningBasic/viewWarnDetail'
      }else if(this.tabPane === '2'){
        url = 'web/earlyWarningBasic/viewSafeWarnDetail'
      }
      this.$get(url, {
        id:id
      }).then((r) => {
        if (r.data.code === 1) {
          this.warnDetailData = r.data.data
        } else {
          this.$message.error(r.data.msg)
        }
      })
    },
    handleRadioChange (value) {
      this.flagTime = value
      this.dateChange()
      console.log('获取时间', value)
    },
    handleTypeChange(value){
      console.log('获取类型', value)
      this.tabPane = value
      this.search()
    },
    onChange (date, dateString) {
      this.queryParams.startTime = dateString[0] ? dateString[0] + ' 00:00:00' : ''
      this.queryParams.endTime = dateString[1] ? dateString[1] + ' 59:59:59' : ''
      this.search()
    },
    // 快捷选择时间
    dateChange() {
      if (this.flagTime == 0) {
        this.searchTime = [
          this.moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          this.moment().format('YYYY-MM-DD HH:mm:ss')
        ]
      } else if (this.flagTime == 1) {
        this.searchTime = [
          this.moment().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
          this.moment().format('YYYY-MM-DD HH:mm:ss')
        ]
      } else if (this.flagTime == 2) {
        this.searchTime = [
          this.moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss'),
          this.moment().format('YYYY-MM-DD HH:mm:ss')
        ]
      } else if (this.flagTime == 3) {
        this.searchTime = [
          this.moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss'),
          this.moment().format('YYYY-MM-DD HH:mm:ss')
        ]
      }

      this.queryParams.startTime = this.searchTime[0]
      this.queryParams.endTime = this.searchTime[1]
      this.search()
    },
    //各等级预警数量
    groupStatistics(params = {}){
      params.flag = this.flagTime
      this.$get('web/earlyWarningBasic/groupStatistics', {
        ...params
      }).then((r) => {
        if (r.data.code === 1) {
          this.statisData = r.data.data
        } else {
          this.$message.error(r.data.msg)
        }
        // 数据加载完毕，关闭loading
        this.loading = false
      })
    },
    portData () {
      this.$export('web/earlyWarningBasic/exportEarlyWarningList', {...this.queryParams,reservoirId:this.reservoirId})
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../../../../static/less/Common";
.standardList{
  width:100%;
}
  .tagActive{

  }
</style>
