<template>
  <!-- 水位库容曲线 -->
  <div class="storageCapacity">
    <div class="tit">
      <span>水位库容曲线</span>
    </div>
    <div class="trendCon">
      <div class="echartTU" ref="storageChart"></div>
      <div style="width:30%">
        <a-table :columns="columns" :data-source="tableData" :pagination="pagination">
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
  // import chartTU from "../echarts/EchartsArrLine.vue"
  import moment from 'moment';
  const columns = [{
      title: '库水位(m)',
      dataIndex: 'depth',
      key: 'depth'
    },
    {
      title: '库容(百万m³)',
      dataIndex: 'capacity',
      key: 'capacity',
    },
  ];
  var option
  export default {
    props: ["waterValue"],
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
            this.pagination.current = cur;
          }
        },
        waterLevel: ''
      };
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
                    color: "#c5595a"
                  },
                  label: {
                    formatter: '当前水位' + this.waterLevel,
                    position: 'middle'
                  }
                }]
              }
              this.myChart.setOption(option, true);
            }
          }
        },
        immediate: true
      }
    },
    methods: {
      moment,
      onChange(date, dateString) {
        console.log(date, dateString);
      },
      getData() {
        this.$get('/web/monitorScene/getCapacityCurveByReserveId?reserveId=' + 9).then(res => {
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
            this.myChart.resize();
          });
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
            trigger: 'axis',
          },
          dataZoom: [{
            type: 'slider',

          }, {
            type: 'inside'
          }],
          xAxis: {
            name: '库容(百万m³)',
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
              show: true,
            },
          },
          series: [{
            data: this.tableData.map(v => {
              return v.depth
            }),
            type: 'line',
            smooth: true,
          }]
        };
        if (this.waterLevel) {
          option.series[0].markLine = {
            silent: true,
            data: [{
              yAxis: this.waterLevel,
              lineStyle: {
                color: "#c5595a"
              },
              label: {
                formatter: '当前水位' + this.waterLevel,
                position: 'middle'
              }
            }]
          }
        }
        this.myChart.setOption(option, true);
      },
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

</style>
