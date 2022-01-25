<template>
  <!-- 大坝安全监测 重点区域监控 -->
  <div class="safeAmonitor">
    <borderCom :titTxt="title" @toggle="titToggle" />
    <div class="conBox">
      <div id="safeChart" v-show="actInd===0&&!reservoirId"></div>
      <div v-show="actInd===1&&!reservoirId">
        暂无监控
      </div>
      <div id="safeChartR" v-show="reservoirId"></div>
    </div>
  </div>
</template>

<script>
  import borderCom from "./border.vue"
  import Bus from "../../utils/bus"
  var labelOption = {
    show: true,
    position: 'top',
    distance: 5,
    color: '#fff'
  }
  export default {
    components: {
      borderCom
    },
    data() {
      return {
        safeChart: '',
        safeChartR: '',
        actInd: 0,
        reservoirId: '',
        title: ['大坝安全监测', '重点区域监控']
      };
    },
    methods: {
      titToggle(ind) {
        // console.log(ind)
        this.actInd = ind
        if (ind === 0) this.getChartData()
      },
      getChartData() {
        if (!this.myChart) {
          var chartDom = document.getElementById('safeChart');
          this.safeChart = this.$echarts.init(chartDom);
        }
        this.safeChart.clear()
        this.$get("/web/onePicture/damSafetyMonitor").then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return false
          }
          var option = {
            grid: {
              left: 30,
              top: 20,
              bottom: 30,
              right: 10
            },
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              data: rr.data.map(v => {
                return v.reservoirName
              })
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              name: '渗流监测',
              label: labelOption,
              data: rr.data.map(v => {
                return v.sl
              }),
              type: 'bar'
            }, {
              name: '渗压监测',
              label: labelOption,
              data: rr.data.map(v => {
                return v.sy
              }),
              type: 'bar'
            }, {
              name: '变形监测',
              label: labelOption,
              data: rr.data.map(v => {
                return v.bx
              }),
              type: 'bar'
            }]
          };
          option && this.safeChart.setOption(option, true);
        })
      },
      drawRChart() {
        if (!this.safeChartR) {
          var chartDom = document.getElementById('safeChartR');
          this.safeChartR = this.$echarts.init(chartDom);
        }
        this.safeChartR.clear()
        var option = {
          grid: [{
            left: 50,
            right: 50,
            top: 40,
            bottom: 30,
          }],
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['渗流监测点1']
          },
          xAxis: [{
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            data: ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
          }],
          yAxis: [{
            type: 'value',
            name: '瞬时流量',
            axisLine: {
              show: true,
            },
          }],
          series: [{
            name: '渗流监测点1',
            type: 'line',
            yAxisIndex: 0,
            data: [2, 4, 3, 1, 0, 0, 0, 0, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0, 0, 0.5, 0, 1, 0, 0, 0],
          }, ]
        };
        this.safeChartR.setOption(option, true)
      }
    },
    mounted() {
      this.getChartData()
      // 点击左侧水库概览列表水库时显示该水库大坝安全监测
      Bus.$on('reservoirId', (reservoirId) => {
        // console.log("组件收到bus消息：", reservoirId);
        this.reservoirId = reservoirId
        if (reservoirId) {
          this.title = '大坝安全监测'
          setTimeout(() => {
            this.drawRChart()
          }, 300);
        } else this.title = ['大坝安全监测', '重点区域监控']
      });
    }
  }

</script>
<style scoped>
  .safeAmonitor {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .conBox {
    padding: 1rem;
    margin-top: 2.8rem;
    color: #fff;
    width: 100%;
    height: calc(100% - 3.5rem);
    position: relative;
    z-index: 2;
  }

  #safeChart,
  #safeChartR {
    width: 100%;
    height: 100%;
  }

</style>
