<template>
  <!-- 雨水情监测 -->
  <div class="rainWaterMonitor">
    <borderCom titTxt="雨水情监测" />
    <div class="arrBox" v-if="!reservoirId">
      <template v-for="v,i in allData">
        <div class="item" :key="i">
          <div class="imgIcon">
            <img src="/static/img/u454.png" alt="">
          </div>
          <div class="msg">
            <p>{{v.reservoirName | ellipsis(6)}}</p>
            <p>库水位：<span class="val">{{v.waterLevel}}</span></p>
            <p>降水量：<span class="val">{{v.rainfall}}</span></p>
          </div>
        </div>
      </template>
    </div>
    <div id="chartRainWater" v-show="reservoirId"></div>
  </div>
</template>

<script>
  import borderCom from "./border.vue"
  import Bus from "../../utils/bus"
  export default {
    components: {
      borderCom
    },
    data() {
      return {
        allData: [],
        reservoirId: '',
        chartTU: ''
      };
    },
    methods: {
      getData() {
        this.$get("/web/onePicture/rainWaterMonitor").then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return false
          }
          this.allData = rr.data
        })
      },
      drawChart() {
        if (!this.chartTU) {
          var chartDom = document.getElementById('chartRainWater');
          this.chartTU = this.$echarts.init(chartDom);
        }
        this.chartTU.clear()
        var option = {
          grid: [{
            left: 50,
            right: 50,
            top: 40,
            bottom: 30,
          }],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          legend: {
            data: ['库水位', '降水量']
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
              name: '库水位/m',
              // nameLocation: 'start',
              // inverse: true,
              position: 'left',
              axisLine: {
                show: true,
              },
            },
            {
              type: 'value',
              name: '降水量/mm',
              position: 'right',
              nameLocation: 'start',
              inverse: true,
              min: 0,
              max: 30,
              axisLine: {
                show: true,
                // lineStyle: {
                //     color: '#5470C6',
                // }
              },
            },
          ],
          series: [{
              name: '库水位',
              type: 'line',
              yAxisIndex: 0,
              data: [2, 4, 3, 1, 0, 0, 0, 0, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0, 0, 0.5, 0, 1, 0, 0, 0],
            },
            {
              name: '降水量',
              type: 'bar',
              yAxisIndex: 1,
              data: [2, 6, 9, 10, 10, 10, 10, 10, 10, 10.5, 10.5, 11, 11, 11, 11.5, 11.5, 11.5, 12, 12, 13, 13, 13,
                13
              ],
              itemStyle: {
                normal: {
                  color: "#c5595a"
                }
              },
            },
          ]
        };
          this.chartTU.setOption(option, true)
      }
    },
    mounted() {
      this.getData()
      // 点击左侧水库概览列表水库时显示该水库雨水情监测
      Bus.$on('reservoirId', (reservoirId) => {
        // console.log("组件收到bus消息：", reservoirId);
        this.reservoirId = reservoirId
        if (reservoirId){
          setTimeout(() => {
             this.drawChart()
          }, 300);
        }
      });
    },
    filters: {
      // 名称过长时用...代替
      ellipsis(value, num) {
        if (!value) {
          return ''
        }
        if (value.length > num) {
          return value.slice(0, num) + '...'
        }
        return value
      }
    }
  }

</script>
<style scoped>
  .rainWaterMonitor {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .arrBox {
    padding: 1rem;
    margin-top: 2.8rem;
    color: #fff;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    max-height: calc(100% - 4rem);
    overflow: auto;
    position: relative;
    z-index: 2;
  }

  #chartRainWater {
    /* padding: 1rem; */
    margin-top: 2.8rem;
    width: 100%;
    height: calc(100% - 4rem);
    position: relative;
    z-index: 2;
    float: left;
  }

  .item {
    width: 50%;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    white-space: nowrap;
  }

  .imgIcon {
    width: 7rem;
  }

  .imgIcon img {
    width: 100%;
    height: 100%;
    float: left;
  }

  .msg p {
    margin-bottom: 0;
  }

  .val {
    display: inline-block;
    min-width: 5rem;
  }

</style>
