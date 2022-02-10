<template>
  <!-- 水位库容曲线 -->
  <div class="storageCapacity">
    <a-card :bodyStyle="{ padding: '10px' }">
      <div class="safetyPlan">
        <div class="card">
          <img src="static/img/水位库容曲线.png">
          <span>水位库容曲线</span>
        </div>
      </div>
      <div style="width: 100%; text-align: center; padding: 5px">
        <div class="trendCon">
          <div class="echartTU" ref="storageChart"></div>
          <div style="width:30%">
            <a-table :columns="columns" :data-source="tableData" :pagination="pagination" :customRow="customRow">
            </a-table>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
  // import chartTU from "../echarts/EchartsArrLine.vue"
  import {
    mapState
  } from 'vuex'
  import moment from 'moment'
  const columns = [{
      title: '库水位(m)',
      dataIndex: 'depth',
      key: 'depth'
    },
    {
      title: '库容(亿m³)',
      dataIndex: 'capacity',
      key: 'capacity'
    }
  ]
  var option
  export default {
    props: ['waterValue'],
    components: {
      // chartTU
    },
    data() {
      return {
        tableData: [],
        columns,
        myChart: '',
        pagination: {
          current: 1,
          pageSize: 5,
          total: 0,
          onChange: (cur, size) => {
            this.pagination.current = cur
          }
        },
        waterLevel: ''
      }
    },
    computed: {
      ...mapState({
        reservoirId: state => state.account.reservoirId
      })
    },
    watch: {
      waterValue: {
        handler: function (n, o) {
          if (n.waterState && n.waterState.waterLevel) {
            this.waterLevel = n.waterState.waterLevel
            if (this.myChart) {
              option.series[0].markLine = {
                silent: true,
                data: [{
                  yAxis: this.waterLevel,
                  lineStyle: {
                    color: '#c5595a'
                  },
                  label: {
                    formatter: '当前水位' + this.waterLevel,
                    position: 'middle'
                  }
                }]
              }
              this.myChart.setOption(option, true)
            }
          }
        },
        immediate: true
      },
      reservoirId(n) {
        this.getData()
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
      onChange(date, dateString) {
        console.log(date, dateString)
      },
      getData() {
        this.$get('/web/monitorScene/getCapacityCurveByReserveId?reserveId=' + this.reservoirId).then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return
          }
          this.tableData = rr.data
          this.drawChart()
        })
      },

      drawChart() {
        if (!this.myChart) {
          this.myChart = this.$echarts.init(this.$refs.storageChart)
          window.addEventListener('resize', () => {
            this.myChart.resize()
          })
        }
        option = {
          color: '#c5595a',
          grid: {
            right: 20,
            left: 50,
            bottom: 90,
            top: 50
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
            name: '库容(亿m³)',
            nameLocation: 'middle',
            nameGap: 25,
            type: 'category',
            boundaryGap: false,
            data: this.tableData.map(v => {
              return v.capacity
            })
          },
          yAxis: {
            type: 'value',
            name: '水位(m)',
            axisLine: {
              show: true
            }
          },
          series: [{
            data: this.tableData.map(v => {
              return v.depth
            }),
            type: 'line',
            smooth: true
          }]
        }
        if (this.waterLevel) {
          option.series[0].markLine = {
            silent: true,
            data: [{
              yAxis: this.waterLevel,
              lineStyle: {
                color: '#c5595a'
              },
              label: {
                formatter: '当前水位' + this.waterLevel,
                position: 'middle'
              }
            }]
          }
        }
        this.myChart.setOption(option, true)
      }
    },
    mounted() {
      this.getData()
    }
  }

</script>
<style scoped>
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
  }

  .echartTU {
    width: 60%;
    height: 380px;
    /* margin: 0 1rem; */
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
