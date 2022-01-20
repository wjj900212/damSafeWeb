<!--suppress ALL -->
<template>
  <div class="standardList">
    <!-- 搜索区域 -->
    <a-card :bordered="false" class="card-area" :style="{ height: '140px',border:'1px solid #e9e9e9' }">
      <div :class="advanced ? 'search' : null">
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
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
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
    </a-card>
    <a-card :bordered="false" class="card-area" style="margin-top:10px;">
      <div style="display: flex;justify-content: space-between;align-content: space-between;">
        <div>
          <span>蓝色预警：{{statisData.blue}}</span>
          <span>黄色预警：{{statisData.yellow}}</span>
          <span>橙色预警：{{statisData.orange}}</span>
          <span>红色预警：{{statisData.red}}</span>
        </div>
        <div>
          <a-radio-group :defaultValue="flagTime" button-style="solid" @change="handleRadioChange">
            <a-radio-button v-for="tag in tagList" :key="tag.id" :value="tag.id">
              {{tag.name}}
            </a-radio-button>
          </a-radio-group>
          <a-button type="primary">
            导出
          </a-button>
        </div>
      </div>
      <div>
        <a-tabs default-active-key="1" @change="callback">
          <a-tab-pane v-for="tab in tabPaneList" :key="tab.key" :tab="tab.tab">
            <!--<table-list :columns="columns" :dataSource="dataSource" :loading='loading' :pagination="pagination"></table-list>-->
            <a-table ref="TableMessInfo"
                     :columns="columns"
                     :dataSource="dataSource"
                     :pagination="pagination"
                     :loading="loading"
                     @change="handleTableChange">
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
    <!--设备预警详情-->
    <equipment-warning-info
      :visible="isShowDevWarning"
      :warnDetailData="warnDetailData"
      :cur="tabPane"
      :warnId="warnId"
      :ifdisposal="ifdisposal"
      @onClose="()=>{isShowDevWarning=false}"
    ></equipment-warning-info>
  </div>
</template>

<script>
import EquipmentWarningInfo from './model/equipmentWarningInfo'
export default {
  name: 'message',
  components: {
    EquipmentWarningInfo
  },
  data () {
    return {
      advanced: false,
      queryParams: {},
      warnLevelList: [{id: 1, label: '蓝色预警'}, {id: 2, label: '黄色预警'}, {id: 3, label: '橙色预警'}, {id: 4, label: '红色预警'}],
      disposalList: [{id: 0, label: '未处置'}, {id: 1, label: '已处置'}, {id: 2, label: '不予处置'}],
      tagList: [{id: 0, name: '今日'}, {id: 1, name: '近三天'}, {id: 2, name: '近一周'}, {id: 3, name: '近一月'}],
      flagTime: 3,
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
      warnId: 0,
      ifdisposal: '0' // 预警是否已处置
    }
  },
  computed: {
    columns () {
      return [{
        title: '预警级别',
        dataIndex: 'warnLevel',
        customRender: (text) => {
          switch (text) {
            case '0':
              return '蓝色预警'
            case '1':
              return '黄色预警'
            case '2':
              return '橙色预警'
            case '3':
              return '红色预警'
          }
        }
      }, {
        title: '预警指标',
        dataIndex: 'devValueMark'
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
        customRender: (text, record) => (
          <div>
            <a onClick={() => this.warnInfo(record)}>详情</a>
          </div>
        )
      }]
    }
  },
  mounted () {
    this.fetch()
    this.groupStatistics()
  },
  methods: {
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
    // 预警详情
    viewWarnDetail(id){
      this.$get('web/earlyWarningBasic/viewWarnDetail', {
        id:id
      }).then((r) => {
        if (r.data.code === 1) {
          this.warnDetailData = r.data.data
        } else {
          this.$message.error(r.data.msg)
        }
      })
    },
    handleRadioChange (e) {
      this.flagTime = e.target.value
      this.search()
      console.log('获取时间', e)
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
