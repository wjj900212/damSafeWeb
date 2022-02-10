<template>
  <!-- 降水量趋势统计 -->
  <div class="trendStatistic">
    <a-card :bodyStyle="{ padding: '10px' }">
      <div class="safetyPlan">
        <div class="card">
        <img src="static/img/渗流监测趋势统计.png">
        <span>渗流监测趋势统计</span>
      </div>
      <div>
        <a-select v-model="queryParams.pnId" :style="{width:'20rem'}" @change="handleTrendChange">
          <a-select-option v-for="pn in pnList" :key="pn.pnId.toString()">{{pn.pnName}}</a-select-option>
        </a-select>
        <a-range-picker @change="onDateChange" style="width:250px;" />
        <a-select v-model="dateCurrent" @change="dateChange" style="width:100px;" >
          <a-select-option value="1">今日</a-select-option>
          <a-select-option value="2">近三天</a-select-option>
          <a-select-option value="3">近一周</a-select-option>
          <a-select-option value="4">近一月</a-select-option>
        </a-select>
        <a-button type="primary" @click="portData">数据导出</a-button>
      </div>
      </div>
      <div style="width: 100%; padding: 5px">
        <div
          style="background: #F9FAFE;color:#5D6574;font-size:1.6rem;line-height:40px;width:calc(100% - 20px);margin:0 auto;padding:0 1rem;">
          当前： <span style="color:#007EFE;">{{pnName}}</span>
          <span style="margin-right:10px;;color:#007EFE;">{{devCode}}</span>
        </div>
        <div class="stateMsg">
          <div class="echartTU" ref="trendStatisticChart"></div>
          <div class="s_right">
            <!-- 表格区域 -->
            <a-table ref="TableInfo" :rowKey="(record,index)=>{return index}" :columns="columns" :dataSource="tableData"
              :pagination="pagination" :customRow="customRow">
            </a-table>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
  import moment from 'moment'
  var option
  export default {
    props: ['hiddenId', 'pnList'],
    data() {
      return {
        warnValue: [], // 水位警戒值
        columns: [],
        searchTime: [],
        queryParams: {
          pnId: '',
          pnStrId: '',
          starttime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          endtime: moment().format('YYYY-MM-DD HH:mm:ss'),
          pageNum: '',
          pageSize: ''
        },
        dateCurrent: '1',
        overViewData: {},
        tableData: [],
        pagination: {
          current: 1,
          pageSize: 5,
          total: 0,
          onChange: (cur, size) => {
            this.pagination.current = cur
          }
        },
        devCode: '',
        pnName: ''
      }
    },
    watch: {
      pnList: {
        handler: function (n, o) {
          if (!n || n.length === 0) {
            this.queryParams.pnId = ''
            this.pnName = ''
            this.tableData = []
            this.devCode = ''
            this.warnValue = []
            this.columns = [{
              title: '瞬时流程',
              dataIndex: 'value',
              key: 'value',
              width: '10%'
            }, {
              title: '时间',
              dataIndex: 'time',
              key: 'time',
              width: '10%'
            }]
            setTimeout(() => {
              this.drawChart()
            }, 300)
            return
          }
          if (n.length > 0) {
            this.queryParams.pnId = n[0].pnId.toString()
            this.pnName = n[0].pnName
            this.getWarnValue()
          }
        },
        immediate: true
      }
    },
    methods: {
      moment,
      //设置表格隔行变色
      customRow(record, index) {
        return {
          style: {
            // 字体颜色
            color: '#8E8E8E',
            // 行背景色
            'background-color': index % 2 == 1 ? '#F9FAFE' : '#fff'
          }
        }
      },
      getData(init) {
        if (!this.queryParams.pnId) {
          this.$message.error('请选择监测点')
          return
        }
        this.queryParams.type = 11
        this.$get('/web/monitorScene/monitorDataList', this.queryParams).then(res => {
          let rr = res.data
          if (rr.code !== 1) {
            this.$message.error(rr.msg)
            return false
          }
          if (init) {
            let col = []
            var columns = [{
              title: '瞬时流程',
              dataIndex: 'value',
              key: 'value',
              width: '10%'
            }, {
              title: '时间',
              dataIndex: 'time',
              key: 'time',
              width: '10%'
            }]
            this.warnValue.forEach(v => {
              col.push({
                title: v.target,
                key: v.name,
                width: '15%',
                ellipsis: true,
                customRender: () => {
                  return v.value
                }
              })
            })
            col.unshift(1, 0)
            Array.prototype.splice.apply(columns, col)
            this.columns = columns
          }
          this.tableData = rr.data.list
          this.devCode = rr.data.devCode
          this.pagination.total = rr.data.total
          this.drawChart()
        })
      },
      // 获取该监测场景下的监测列表
      getMonitorConditionRain() {
        let _this = this
        this.$get('web/monitorScene/monitorConditionRain', {
          hiddenId: _this.hiddenId
        }).then((res) => {
          if (res.data.code === 1) {
            if (res.data.data.pnList.length !== 0) {
              _this.pnList = res.data.data.pnList
              let pnId = _this.pnList[0].pnId.toString()
              _this.queryParams.pnId = pnId
              _this.devCode = _this.pnList[0].devBasicStrId
              _this.pnName = _this.pnList[0].pnName
              _this.getWarnValue()
            }
          } else {
            _this.$message.error(res.data.msg)
          }
        })
      },
      drawChart() {
        if (!this.myChart) {
          this.myChart = this.$echarts.init(this.$refs.trendStatisticChart)
          window.addEventListener('resize', () => {
            this.myChart.resize()
          })
        }
        option = {
          color: '#c5595a',
          grid: {
            right: 10,
            left: 80
          },
          tooltip: {
            trigger: 'axis'
          },
          dataZoom: [{
            type: 'slider'
          }, {
            type: 'inside'
          }],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.tableData.map(v => {
              return v.time
            })
          },
          yAxis: {
            type: 'value',
            name: '瞬时流量(m³/s)',
            axisLine: {
              show: true
            }
          },
          series: [{
            data: this.tableData.map(v => {
              return v.value
            }),
            type: 'line',
            smooth: true
          }]
        }
        if (this.warnValue.length > 0) {
          option.series[0].markLine = {
            silent: true,
            symbol: ['arrow', 'none'],
            data: this.warnValue.map(v => {
              return {
                yAxis: v.value,
                lineStyle: {
                  color: '#c5595a'
                },
                label: {
                  formatter: v.target,
                  position: 'middle'
                }
              }
            })
          }
        }
        this.myChart.setOption(option, true)
      },
      // 切换监测场景
      handleTrendChange(value) {
        this.queryParams.pnId = value
        this.getData()
      },
      // 获取警戒水位值
      getWarnValue() {
        let o = {
          pnId: this.queryParams.pnId,
          type: 11
        }
        this.$get('web/monitorScene/getWarnConfigByPnIdAndMark', o).then(res => {
          let rr = res.data
          if (rr.code !== 1) {
            this.$message.error(rr.msg)
            return false
          }
          rr.data.forEach((v, i) => {
            v.name = 'name' + i
            v.act = true
          })
          this.warnValue = rr.data
          this.getData('init')
        })
      },
      // 选择时间范围
      onDateChange(date, dateString) {
        this.queryParams.starttime = dateString[0] ? dateString[0] + ' 00:00:00' : ''
        this.queryParams.endtime = dateString[1] ? dateString[1] + ' 59:59:59' : ''
        this.getData()
      },
      // 快捷选择时间
      dateChange() {
        console.log('获取日期', this.dateCurrent)
        if (this.dateCurrent == 1) {
          this.searchTime = [
            this.moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            this.moment().format('YYYY-MM-DD HH:mm:ss')
          ]
        } else if (this.dateCurrent == 2) {
          this.searchTime = [
            this.moment().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
            this.moment().format('YYYY-MM-DD HH:mm:ss')
          ]
        } else if (this.dateCurrent == 3) {
          this.searchTime = [
            this.moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss'),
            this.moment().format('YYYY-MM-DD HH:mm:ss')
          ]
        } else if (this.dateCurrent == 4) {
          this.searchTime = [
            this.moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss'),
            this.moment().format('YYYY-MM-DD HH:mm:ss')
          ]
        }
        this.queryParams.starttime = this.searchTime[0]
        this.queryParams.endtime = this.searchTime[1]
        this.getData()
      },
      portData() {
        if (!this.queryParams.pnId) {
          this.$message.error('请选择监测点')
          return
        }
        this.queryParams.type = 11
        this.$export('/web/monitorScene/exportMonitorData', this.queryParams)
      }
    }
  }

</script>
<style scoped>
  .stateMsg {
    display: flex;
    justify-content: space-evenly;
    padding: 1rem 0;
    border-bottom: 1px solid #f2f2f2;
    font-size: 1.4rem;
  }

  .s_right {
    width: 48%;
  }

  .s_right>>>.ant-table-thead>tr>th {
    background-color: #188FFF;
    color: #fff;
    border-color: rgba(59, 173, 255, 0.12);
  }

  .s_right>>>.ant-table-tbody>tr>td {
    border-color: rgba(59, 173, 255, 0.12);
  }


  .echartTU {
    width: 50%;
    height: 380px;
    margin: 0 1rem;
  }

</style>
