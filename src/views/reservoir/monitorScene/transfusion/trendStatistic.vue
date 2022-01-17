<template>
  <!-- 降水量趋势统计 -->
  <div class="trendStatistic">
    <a-card title="渗流监测趋势统计">
      <template slot="extra">
        <a-select v-model="queryParams.pnId" :style="{width:'20rem'}" @change="handleTrendChange">
          <a-select-option v-for="pn in overViewData.pnList" :key="pn.pnId.toString()">{{pn.pnName}}</a-select-option>
        </a-select>
        <a-select v-model="queryParams.pnStrId" style="width:18rem" @change="handleIndexChange">
          <a-select-option v-for="v in pnList" :key="v.pnStrId" :value="v.pnStrId">{{v.target}}</a-select-option>
        </a-select>
        <a-range-picker @change="onDateChange" style="width:250px;"/>
        <a-select v-model="currentDay" @change="dateChange">
          <a-select-option value="1">今日</a-select-option>
          <a-select-option value="2">近三天</a-select-option>
          <a-select-option value="3">近一周</a-select-option>
          <a-select-option value="4">近一月</a-select-option>
        </a-select>
        <a-button type="primary">数据导出</a-button>
      </template>
      <a-card-grid style="width: 100%; padding: 5px">
        <div class="stateMsg">
          <div class="s_left">
            <div>
              <div>当前 {{pnName}}</div>
              <div style="margin: 1rem 0;">
                <span class="cricle"></span>
                <span>{{devCode}}</span>
              </div>
            </div>
            <div class="transEchart" ref="transChart"></div>
          </div>
          <div class="s_right">
            <!-- 表格区域 -->
            <a-table ref="TableInfo"
                     :rowKey="(record,index)=>{return index}"
                     :columns="columns"
                     :dataSource="tableData"
                     :pagination="pagination"
                     @change="handleTableChange">
            </a-table>
          </div>
        </div>

      </a-card-grid>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: ['hiddenId'],
  data () {
    return {
      queryParams: {
        starttime: moment().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
        endtime: moment().format("YYYY-MM-DD HH:mm:ss")
      },
      pnList: [],
      currentDay: '1',
      overViewData: {},
      tableData: [],
      paginationInfo: null,
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 10
      },
      devCode: '',
      pnName: ''
    }
  },
  computed: {
    columns () {
      return [{
        title: '瞬时流程',
        dataIndex: 'userName1'
      }, {
        title: '预警流量',
        dataIndex: 'userName2'
      }, {
        title: '时间',
        dataIndex: 'userName3'
      }]
    }
  },
  watch: {
    hiddenId: {
      handler: function (n, o) {
        this.getMonitorConditionRain()
      },
      immediate: true
    }
  },
  methods: {
    moment,
    // 获取该监测场景下的监测列表
    getMonitorConditionRain () {
      let _this = this
      this.$get('web/monitorScene/monitorConditionRain', {
        hiddenId: _this.hiddenId
      }).then((res) => {
        if (res.data.code === 1) {
          let pnId = res.data.data.pnList[0].pnId.toString()
          _this.queryParams.pnId = pnId
          _this.devCode = res.data.data.pnList[0].devBasicStrId
          _this.pnName = res.data.data.pnList[0].pnName
          _this.getMonitorPnDataVadose(pnId)
          _this.overViewData = res.data.data
          _this.getMonitorDataList({
            ..._this.queryParams
          })
        } else {
          _this.$message.error(res.data.msg)
        }
      })
    },
    // 监测点指标列表
    getMonitorPnDataVadose (pnId) {
      let _this = this
      this.$get('web/monitorScene/monitorPnDataVadose', {
        pnId: pnId
      }).then((res) => {
        if (res.data.code === 1) {
          _this.pnList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 渗流监测趋势统计
    getMonitorDataList (params = {}) {
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
      this.$get('web/monitorScene/monitorDataList', {...params}).then((res) => {
        if (res.data.code === 1) {
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    handleTableChange (pagination) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.getMonitorDataList({
        ...this.queryParams
      })
    },
    // 切换监测场景
    handleTrendChange (value) {
      this.getMonitorPnDataVadose(value)
    },
    // 切换指标
    handleIndexChange (value) {
      this.getMonitorDataList()
    },
    onDateChange (date, dateString) {
      // console.log(date, dateString);
      this.queryParams.starttime = dateString[0] ? dateString[0] + ' 00:00:00' : ''
      this.queryParams.endtime = dateString[1] ? dateString[1] + ' 59:59:59' : ''
      this.getMonitorDataList()
    },
    // 快捷选择时间
    dateChange () {
      if (this.dateCurrent === 1) {
        this.searchTime = [
          this.moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          this.moment().format('YYYY-MM-DD HH:mm:ss')
        ]
      } else if (this.dateCurrent === 2) {
        this.searchTime = [
          this.moment().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
          this.moment().format('YYYY-MM-DD HH:mm:ss')
        ]
      } else if (this.dateCurrent === 3) {
        this.searchTime = [
          this.moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss'),
          this.moment().format('YYYY-MM-DD HH:mm:ss')
        ]
      } else if (this.dateCurrent === 4) {
        this.searchTime = [
          this.moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss'),
          this.moment().format('YYYY-MM-DD HH:mm:ss')
        ]
      }

      this.queryParams.starttime = this.searchTime[0]
      this.queryParams.endtime = this.searchTime[1]
      this.getMonitorDataList({
        ...this.queryParams
      })
    },
    onChange (date, dateString) {
      console.log(date, dateString)
    }
  }
}

</script>
<style lang="less" scoped>
  .stateMsg {
    display: flex;
    align-items: left;
    padding: 1rem 0;
    border-bottom: 1px solid #f2f2f2;
    font-size: 1.4rem;
  }

  .s_left,
  .s_right {
    flex: 1;
  }
  .cricle {
    width: 9px;
    height: 9px;
    border-radius: 50%;
  }
</style>
