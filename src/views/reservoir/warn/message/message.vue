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
                  <a-input placeholder="水库、场景名称、监测点名称" v-model="queryParams.searchName"/>
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
                    v-model="queryParams.status"
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
                  <a-input placeholder="请输入" v-model="queryParams.searchName"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24" >
                <a-form-item
                  label="预警信息"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input placeholder="请输入" v-model="queryParams.searchName"/>
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
          <span>蓝色预警：80</span>
          <span>黄色预警：80</span>
          <span>橙色预警：80</span>
          <span>红色预警：80</span>
        </div>
        <div>
          <a-radio-group :defaultValue="selectId" button-style="solid">
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
          <a-tab-pane key="1" tab="设备预警">
            <table-list :columns="columns" :dataSource="dataSource" :loading='loading' :pagination="pagination"></table-list>
          </a-tab-pane>
          <a-tab-pane key="2" tab="安全预警">
            Content of Tab Pane 2
          </a-tab-pane>
          <a-tab-pane key="3" tab="模型预警">
            Content of Tab Pane 3
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
    <!--设备预警详情-->
    <dev-warning
      :visible="isShowDevWarning"
      :warnDetailData="warnDetailData"
      @onClose="()=>{isShowDevWarning=false}"
    ></dev-warning>
  </div>
</template>

<script>
import TableList from '@/components/table/TableList'
import DevWarning from './model/devWarningInfo'
export default {
  name: 'message',
  components: {
    TableList,
    DevWarning
  },
  data () {
    return {
      advanced: false,
      queryParams: {},
      warnLevelList: [{id: 0, label: '蓝色预警'}, {id: 1, label: '黄色预警'}, {id: 2, label: '橙色预警'}, {id: 3, label: '红色预警'}],
      disposalList: [{id: 0, label: '已处置'}, {id: 1, label: '未处置'}],
      tagList: [{id: 0, name: '今日'}, {id: 1, name: '近三天'}, {id: 2, name: '近一周'}, {id: 3, name: '近一月'}],
      selectId: 0,
      paginationInfo: null,
      dataSource: [
        {devCode: '1', devStatus: '库水位', devModelName: '库水位超出以及警戒线', secureKey: '0', devOnline: '密云水库', projBasicName: '场景一', itemNum: '监测点一', installTime: '202100101234', itemNum1: '位移微芯桩', installTime1: '2021-09-26 08:05:08'},
        {devCode: '3', devStatus: '库水位', devModelName: '库水位超出以及警戒线', secureKey: '1', devOnline: '密云水库1', projBasicName: '场景二', itemNum: '监测点二', installTime: '202100101235', itemNum1: '位移微芯桩', installTime1: '2021-09-27 08:05:08'},
        {devCode: '2', devStatus: '库水位', devModelName: '库水位超出以及警戒线', secureKey: '0', devOnline: '密云水库2', projBasicName: '场景三', itemNum: '监测点三', installTime: '202100101236', itemNum1: '位移微芯桩', installTime1: '2021-09-28 08:05:08'}
      ],
      loading: false,
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      warnDetailData: {}
    }
  },
  computed: {
    columns () {
      return [{
        title: '预警级别',
        dataIndex: 'devCode',
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
        dataIndex: 'devStatus'
      }, {
        title: '预警信息',
        dataIndex: 'devModelName',
        width: '15%',
        ellipsis: true
      }, {
        title: '处置状态',
        dataIndex: 'secureKey',
        customRender: (text) => text === '0' ? <a-tag color="#42B982">已处置</a-tag> : <a-tag color="#CCCCCC">未处置</a-tag>
      }, {
        title: '水库',
        dataIndex: 'devOnline'
      }, {
        title: '监测场景',
        dataIndex: 'projBasicName'
      }, {
        title: '监测点',
        dataIndex: 'itemNum'
      }, {
        title: '设备ID',
        dataIndex: 'installTime'
      }, {
        title: '设备类型',
        dataIndex: 'itemNum1'
      }, {
        title: '预警时间',
        dataIndex: 'installTime1'
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
  methods: {
    fetch (params = {}) {

    },
    search () {

    },
    resetCond () {
      // 取消选中
      this.selectedRowKeys = []
      // 重置分页
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
      if (this.paginationInfo) {
        this.paginationInfo.current = this.pagination.defaultCurrent
        this.paginationInfo.pageSize = this.pagination.defaultPageSize
      }
      // 重置列过滤器规则
      this.filteredInfo = null
      // 重置列排序规则
      this.sortedInfo = null
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
    handleTagChange (checked) {
      console.log(checked)
    },
    callback (key) {
      console.log(key)
    },
    warnInfo (record) {
      this.warnDetailData = record
      this.isShowDevWarning = true
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
