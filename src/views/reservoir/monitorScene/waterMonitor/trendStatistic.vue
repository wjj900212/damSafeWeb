<template>
  <!-- 库水位趋势统计 -->
  <div class="trendStatistic">
    <a-card :bodyStyle="{ padding: '10px' }">
      <div class="safetyPlan">
        <div class="card">
          <img src="static/img/超警水位统计.png">
          <span>库水位趋势统计</span>
        </div>
        <div>
          <a-select v-model="queryParams.pnId" style="width:18rem" @change="getWarnValue">
            <a-select-option v-for="v in pnList" :key="v.pnId" :value="v.pnId">{{v.pnName}}</a-select-option>
          </a-select>
          <a-range-picker style="width: 250px;" @change="onDateChange" />
          <a-select v-model="dateCurrent" @change="dateChange" style="width: 100px;">
            <a-select-option value="1">今日</a-select-option>
            <a-select-option value="2">近三天</a-select-option>
            <a-select-option value="3">近一周</a-select-option>
            <a-select-option value="4">近一月</a-select-option>
          </a-select>
          <a-button type="primary" @click="portData">数据导出</a-button>
        </div>
      </div>
      <div style="width: 100%; text-align: center; padding: 5px">
        <div style="display:flex;align-items: center;">
          <div class="wvBox" v-for="v,i in warnValue" :key="i" style="margin-top:1rem;margin-right:1rem;"
            :class="v.act?'act':''" @click="toggleMarkLine(v,i)">{{v.target}}</div>
        </div>
        <div class="trendCon">
          <div class="echartTU" ref="trendStatisticChart"></div>
          <div style="width:40%">
            <a-table :columns="columns" :data-source="tableData" :pagination="pagination" :customRow="customRow">
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
    components: {
      // chartTU
    },
    data() {
      return {
        dateCurrent: '1',
        columns: [],
        searchTime: [],
        pagination: {
          current: 1,
          pageSize: 5,
          total: 0,
          onChange: (cur, size) => {
            this.pagination.current = cur
            // this.getData()
          }
        },
        warnValue: [], // 水位警戒值
        queryParams: {
          pnId: '',
          pnStrId: '',
          starttime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          endtime: moment().format('YYYY-MM-DD HH:mm:ss'),
          pageNum: '',
          pageSize: ''
        },
        tableData: [],
        myChart: ''
      }
    },
    watch: {
      // hiddenId: {
      //   handler: function (n, o) {},
      //   immediate: true
      // },
      pnList: {
        handler: function (n, o) {
          if (!n || n.length == 0) {
            this.queryParams.pnId = ''
            this.tableData = []
            this.warnValue = []
            this.columns = [{
                title: '库水位',
                dataIndex: 'value',
                key: 'value'
              },
              {
                title: '时间',
                dataIndex: 'time',
                key: 'time'
              }
            ]
            setTimeout(() => {
              this.drawChart()
            }, 300)
            return
          }
          if (n.length > 0) {
            this.queryParams.pnId = n[0].pnId
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
        // this.queryParams.pageNum = this.pagination.current
        if (!this.queryParams.pnId) {
          this.$message.error('请选择监测点')
          return
        }
        // this.queryParams.pnStrId = this.queryParams.pnId + '_meas'
        this.queryParams.pnStrId = ''
        this.queryParams.type = 16
        this.$get('/web/monitorScene/monitorDataList', this.queryParams).then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return false
          }
          if (init) {
            let col = []
            var columns = [{
                title: '库水位',
                dataIndex: 'value',
                key: 'value'
              },
              {
                title: '时间',
                dataIndex: 'time',
                key: 'time'
              }
            ]
            this.warnValue.forEach(v => {
              col.push({
                title: v.target,
                // dataIndex: v.name,
                key: v.name,
                customRender: () => {
                  return v.value
                }
              })
            })
            col.unshift(1, 0)
            Array.prototype.splice.apply(columns, col)
            this.columns = columns
            // console.log(this.columns)
          }
          this.tableData = rr.data.list
          this.pagination.total = rr.data.total
          this.drawChart()
        })
      },
      onDateChange(date, dateString) {
        // console.log(date, dateString);
        this.queryParams.starttime = dateString[0] ? dateString[0] + ' 00:00:00' : ''
        this.queryParams.endtime = dateString[1] ? dateString[1] + ' 59:59:59' : ''
        this.getData()
      },
      // 快捷选择时间
      dateChange() {
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
      // 获取警戒水位值
      getWarnValue() {
        let o = {
          pnId: this.queryParams.pnId,
          mark: 'meas'
        }
        this.$get('/web/monitorScene/getWarnConfigByPnIdAndMark', o).then(res => {
          let rr = res.data
          if (rr.code != 1) {
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
          // toolbox: {
          //   feature: {
          //     dataView: {
          //       show: true,
          //       readOnly: false
          //     },
          //     magicType: {
          //       show: true,
          //       type: ['line', 'bar']
          //     },
          //     restore: {
          //       show: true
          //     },
          //     saveAsImage: {
          //       show: true
          //     }
          //   }
          // },
          tooltip: {
            trigger: 'axis'
          },
          dataZoom: [{
            type: 'slider'
            // height: 15,
            // bottom: 10,
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
            name: '水位(m)',
            // min: 150,
            // // max:300,
            // // scale:true,
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
      // 切换显示 markLine
      toggleMarkLine(v, i) {
        v.act = !v.act
        if (v.act) {
          option.series[0].markLine.data.splice(i, 0, {
            yAxis: v.value,
            lineStyle: {
              color: '#c5595a'
            },
            label: {
              formatter: v.target,
              position: 'middle'
            }
          })
        } else {
          option.series[0].markLine.data.splice(i, 1)
        }
        this.myChart.setOption(option, true)
      },
      portData() {
        if (!this.queryParams.pnId) {
          this.$message.error('请选择监测点')
          return
        }
        this.queryParams.pnStrId = this.queryParams.pnId + '_meas'
        this.$export('/web/monitorScene/exportMonitorData', this.queryParams)
      }
    }
  }

</script>
<style scoped>
  /* .trendStatistic{} */
  .tit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f2f2f2;
    padding-bottom: 1rem;
    margin-top: 1rem;
  }

  .tit>span {
    font-size: 1.6rem;
  }

  .trendCon {
    display: flex;
    justify-content: space-around;
    margin-top: 1rem;
    padding: 0 1rem;
  }

  .echartTU {
    width: 55%;
    height: 380px;
    margin: 0 1rem;
  }

  .wvBox {
    /* width: 100%; */
    border: 1px solid #1890FF;
    line-height: 3rem;
    text-align: center;
    border-radius: 5px;
    color: #1890FF;
  }

  .wvBox.act {
    background-color: #1890FF;
    color: #fff;
    cursor: pointer;
  }

  .trendCon>>>.ant-table-thead>tr>th {
    background-color: #188FFF;
    color: #fff;
    border-color: rgba(59, 173, 255, 0.12);
  }

  .trendCon>>>.ant-table-tbody>tr>td {
    border-color: rgba(59, 173, 255, 0.12);
  }

</style>
