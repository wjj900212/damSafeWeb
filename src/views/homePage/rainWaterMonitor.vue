<template>
  <!-- 雨水情监测 -->
  <div class="rainWaterMonitor">
    <borderCom titTxt="雨水情监测" />
    <div class="arrWarp" v-if="!reservoirId">
      <horn />
      <div class="arrBox">
        <template v-for="v,i in allData">
          <div class="item" :key="i">
            <div class="imgIcon">
              <img src="static/img/组 981.png" alt="">
              <span class="waterLevelRate">{{v.waterLevelRate}}</span>
            </div>
            <div class="msg">
              <p class="rName">{{v.reservoirName | ellipsis(6)}}</p>
              <p>库水位：<span class="val">{{v.waterLevel}}</span></p>
              <p>降水量：<span class="val">{{v.rainfall}}</span></p>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="timeBox" v-show="reservoirId">
      <div class="timeItem" :class="timeAct==1?'act':''" @click="timeChange(1)">今日</div>
      <div class="timeItem timeItem2" :class="timeAct==2?'act':''" @click="timeChange(2)">近3天</div>
      <div class="timeItem" :class="timeAct==3?'act':''" @click="timeChange(3)">近7天</div>
    </div>
    <div class="arrWarp" v-show="reservoirId">
      <horn />
      <div id="chartRainWater"></div>
    </div>
  </div>
</template>

<script>
  import borderCom from "./border.vue"
  import horn from "./horn.vue"
  import Bus from "../../utils/bus"
  export default {
    components: {
      borderCom,
      horn
    },
    data() {
      return {
        allData: [],
        reservoirId: '',
        chartTU: '',
        timeAct: ''
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
      // 单个水库雨水情监测
      getReservoirData() {
        let o = {
          reservoirId: this.reservoirId,
          dateType: this.timeAct
        }
        this.$get('/web/onePicture/rainWaterMonitorDataList', o).then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return false
          }
          this.drawChart(rr.data)
        })
      },
      drawChart(chartData) {
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
            confine: true, //避免溢出显示不全
            trigger: 'axis',
          },
          legend: {
            textStyle: {
              color: '#fff'
            },
            data: ['库水位', '降水量'],

          },
          xAxis: [{
            type: 'time',
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#fff',
              }
            },
            // data: ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
          }],
          yAxis: [{
              type: 'value',
              name: '库水位/m',
              nameTextStyle: {
                color: "#fff",
              },
              position: 'left',
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#fff'
                }
              },
              axisLine: {
                show: false,
              },
              splitLine: { //网格线
                show: false
              }
            },
            {
              type: 'value',
              name: '降水量/mm',
              nameTextStyle: {
                color: "#fff",
              },
              position: 'right',
              nameLocation: 'start',
              inverse: true,
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#fff'
                }
              },
              axisLine: {
                show: false,
                // lineStyle: {
                //     color: '#5470C6',
                // }
              },
              splitLine: { //网格线
                show: false
              }
            },
          ],
          series: [{
              name: '库水位',
              type: 'line',
              yAxisIndex: 0,
              data: chartData.waterData.map(v => {
                return [v.time, v.value]
              }),
              lineStyle: {
                color: '#1DD682' //改变折线颜色
              },
              smooth: true,
              itemStyle: {
                normal: {
                  areaStyle: {
                    type: 'default'
                  },
                  color: new this.$echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [{
                      offset: 0,
                      color: 'rgba(0, 255, 222, 0.34)'
                    }, ]
                  ),
                }
              },
            },
            {
              name: '降水量',
              type: 'bar',
              yAxisIndex: 1,
              data: chartData.rainData.map(v => {
                return [v.time, v.value]
              }),
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: "#06E1FC" // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: "#02A3FD" // 100% 处的颜色
                  }], false)
                }
              },
            },
          ]
        };
        this.chartTU.setOption(option, true)
      },
      timeChange(i) {
        if (i == this.timeAct) return false
        this.timeAct = i
        this.getReservoirData()
      }
    },
    mounted() {
      this.getData()
      // 点击左侧水库概览列表水库时显示该水库雨水情监测
      Bus.$on('reservoirId', (reservoirId) => {
        // console.log("组件收到bus消息：", reservoirId);
        if (reservoirId != this.reservoirId) this.timeAct = ''
        this.reservoirId = reservoirId
        if (reservoirId) {
          setTimeout(() => {
            this.timeChange(1)
          }, 300);
        } else this.timeAct = ''
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
    width: calc(100% - 16px);
    height: 100%;
    position: absolute;
    margin: 0 8px;
  }

  .arrWarp {
    width: 99%;
    margin: 0 auto;
    padding: 1rem;
    height: calc(100% - 5rem);
    /* background: url('../../../static/img/model-bg.png') no-repeat;
    background-size: 100% 100%; */
    overflow: hidden;
    background: rgba(13, 76, 145, 0.4);
    box-shadow: 0px 0px 10px 0px rgba(17, 40, 255, 0.66) inset;
    border-radius: 3px;
    position: relative;
  }

  .arrBox {
    color: #fff;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    height: 100%;
    overflow: auto;
  }

  #chartRainWater {
    width: 100%;
    /* height: calc(100% - 4rem); */
    height: 100%;
    position: relative;
    z-index: 2;
    float: left;
  }

  .timeBox {
    position: absolute;
    top: 10px;
    right: 10px;
    line-height: 3rem;
    border: 1px solid rgba(0, 126, 253, .4);
    display: flex;
    align-items: center;
    color: #fff;
  }

  .timeItem {
    padding: 0 18px;
    cursor: pointer;
  }

  .timeItem2 {
    border-left: 1px solid rgba(0, 126, 253, .4);
    border-right: 1px solid rgba(0, 126, 253, .4);
  }

  .timeItem.act {
    background: url('../../../static/img/矩形.png') no-repeat;
    background-size: 100% 100%;
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
    width: 9rem;
    position: relative;
    color: #fff;
    margin-right: 8px;
  }

  .imgIcon img {
    width: 100%;
    height: 100%;
    float: left;
  }

  .waterLevelRate {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -80%);
    font-size: 1.6rem;
    font-weight: 500;
  }

  .msg p {
    margin-bottom: 0;
    color: rgba(119, 204, 255, 1);
    font-size: 1.2rem;
  }

  .msg .rName {
    margin-bottom: .6rem;
    color: #fff;
    font-size: 1.4rem;
  }

  .val {
    display: inline-block;
    min-width: 6rem;
  }

</style>
