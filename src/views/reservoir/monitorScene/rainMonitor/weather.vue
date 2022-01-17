<template>
  <!-- 气象数据 -->
  <div class="weather">
    <a-card title="气象数据">
      <a-card-grid style="width: 100%; text-align: center; padding: 5px">
        <div class="stateMsg">
          <div class="s_left">
            <div class="address">
              <span>所在位置: {{weatherMsg.address}}</span>
              <a-icon type="environment" class="addressIcon" theme="filled" />
            </div>
            <div class="wrap">
              <div class="weatherData">
                <div class="state">{{ weatherMsg.wether }}</div>
                <div>
                  <img :src="'static/img/weather/'+weatherMsg.code+'@2x.png'" />
                  <span style="font-size:2.4rem;">{{ weatherMsg.temp }}°C</span>
                </div>
              </div>
              <div class="basicD">
                <div class="item">
                  <img src="static/pic/形状 671 拷贝.png" alt="" />
                  <div>
                    <p class="state">温度</p>
                    <p class="val">{{ weatherMsg.humidity + "%RH" }}</p>
                  </div>
                </div>
                <div class="item">
                  <img src="static/pic/降雨量.png" alt="" />
                  <div>
                    <p class="state">降雨量</p>
                    <p class="val">
                      {{ weatherMsg.rain ? weatherMsg.rain + "mm" : "无" }}
                    </p>
                  </div>
                </div>
                <div class="item">
                  <img src="static/pic/形状 670 拷贝.png" alt="" />
                  <div>
                    <p class="state">风力</p>
                    <p class="val">{{ weatherMsg.windScale + "级" }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="early" v-if="weatherMsg.event">
              <a-icon type="warning" class="ico-horn" theme="filled" />
              <div class="e_val" ref="eVal">
                <span class="e_con" ref="eCon">{{ weatherMsg.event }} 事件预警：{{ weatherMsg.eventInfo }}</span>
              </div>
            </div>
          </div>
          <div class="s_center">
            <div>24小时天气</div>
            <div class="chartBox">
              <a-icon type="left" class="slipbtn" @click="turnleft" />
              <div class="chartWarp" ref="chartWarp">
                <div ref="weatherChart" class="chart"></div>
              </div>
              <a-icon type="right" class="slipbtn" @click="turnright" />
            </div>
          </div>
          <div class="s_right">
            <EchartsWeather :chartData="weather7DayMsg" class="futureChart"></EchartsWeather>
          </div>
        </div>
      </a-card-grid>
    </a-card>
  </div>
</template>

<script>
import {
  mapState
} from 'vuex'
import EchartsWeather from '@/components/echarts/EchartsWeather.vue'
var weaChartData
export default {
  name: 'weather',
  components: {
    EchartsWeather
  },
  props: {
    hiddenId: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      weatherMsg: {},
      weaChart: null,
      yAxisV: [],
      weather24Msg: [],
      weather7DayMsg: []
    }
  },
  computed: {
    ...mapState({
      cityCode: state => state.account.cityCode
    })
  },
  watch: {
    hiddenId (newVal) {
      if (newVal) {
        this.realTimeWeather()
        this.future24hWeather()
        this.getHiddenFutureWeather()
      }
    }
  },
  mounted () {
    // this.realTimeWeather()
    //  this.future24hWeather()
  },
  methods: {
    // 获取实时天气
    realTimeWeather () {
      this.$get('web/monitorScene/getWeatherData', {
        hiddenId: this.hiddenId
      }).then((res) => {
        if (res.data.code === 1) {
          this.weatherMsg = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 隐患点未来24小时天气
    future24hWeather () {
      this.$get('web/monitorScene/future24hWeather', {
        hiddenId: this.hiddenId
      }).then((res) => {
        console.log('未来24小时天气', res.data)
        let rr = res.data
        weaChartData = rr.reverse()
        let yAxisV = weaChartData.map(v => {
          return v.temp
        }).sort((a, b) => {
          return a - b
        })
        let max = Number(yAxisV[yAxisV.length - 1])
        let min = Number(yAxisV[0])
        let yy = Math.ceil(max / 4)
        this.yAxisV = [max, yy * 2 + min, yy + min, min]
        if (this.weaChart) this.weaChart.dispose()
        this.chartInit(rr)
      })
    },
    chartInit (data) {
      var chartDom = this.$refs.weatherChart
      this.weaChart = this.$echarts.init(chartDom)
      var richX = {}
      for (let i = 0; i < 38; i++) {
        richX['b' + i] = {
          backgroundColor: {
            image: `static/img/weather/${i}@2x.png`
          },
          height: 40,
          width: 40
        }
      }
      var option = {
        grid: {
          show: true,
          backgroundColor: 'transparent',
          opacity: 0.3,
          borderWidth: '0',
          top: '180',
          bottom: '0',
          left: '30',
          right: '30'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          show: false
        },
        xAxis: [
          // 时间
          {
            type: 'category',
            boundaryGap: false,
            position: 'top',
            offset: 130,
            zlevel: 100,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0,
              formatter: [
                '{a|{value}}'
              ].join('\n'),
              rich: {
                a: {
                  fontSize: 14
                }
              }
            },
            nameTextStyle: {},
            data: data.map((item) => {
              return item.time.split(' ')[1] + '时'
            })
          },
          // 天气
          {
            type: 'category',
            boundaryGap: false,
            position: 'top',
            offset: 80,
            zlevel: 100,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0,
              formatter: function (value, index) {
                // console.log('天气图片 ****** ', index + ' ' + value)
                console.log(data[index].code, value)
                // return '{' + index + '| }\n{b|' + value + '}'
                return `{b${data[index].code}|${value}}`
              },
              rich: richX
            },
            nameTextStyle: {
              fontWeight: 'bold',
              fontSize: 14
            },
            data: data.map((item) => {
              return item.wether
            })
          },
          // 天气图标
          {
            type: 'category',
            boundaryGap: false,
            position: 'top',
            offset: 50,
            zlevel: 100,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0,
              formatter: [
                '{a|{value}}'
              ].join('\n'),
              rich: {
                a: {
                  fontSize: 14
                }
              }
            },
            nameTextStyle: {
              fontWeight: 'bold',
              fontSize: 14
            },
            data: data.map((item) => {
              return item.temp + '℃'
            })
          }
        ],
        yAxis: {
          type: 'value',
          show: false,
          axisLabel: {
            formatter: '{value} °C',
            color: 'white'
          }
        },
        series: [{
          name: '温度',
          type: 'line',
          data: data.map((item) => {
            console.log(item)
            return item.temp
          }),
          symbol: 'emptyCircle',
          symbolSize: 10,
          showSymbol: true,
          smooth: true,
          itemStyle: {
            normal: {
              color: '#C95843'
            }
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c} °C'
          },
          lineStyle: {
            width: 1
          },
          areaStyle: {
            opacity: 1,
            color: 'transparent'
          }
        }]
      }

      option && this.weaChart.setOption(option)
    },
    turnleft () {
      let x = this.$refs.weatherChart.style.transform.match(/\d+(.\d+)?/g)
      let w = this.$refs.chartWarp.offsetWidth
      if (!Array.isArray(x)) x = [0]
      x = Number(x[0])
      if (x > 0) {
        this.$refs.weatherChart.style.transform = `translateX(-${x - w}px)`
      }
    },
    turnright () {
      let x = this.$refs.weatherChart.style.transform.match(/\d+(.\d+)?/g)
      let w = this.$refs.chartWarp.offsetWidth
      if (!Array.isArray(x)) x = [0]
      x = Number(x[0])
      if (x < w * 3) {
        this.$refs.weatherChart.style.transform = `translateX(-${x + w}px)`
      }
    },
    // 隐患点未来7天天气
    getHiddenFutureWeather () {
      let _this = this
      this.$get('web/monitorScene/getHiddenFutureWeather', {
        hiddenId: _this.hiddenId,
        count: 7
      }).then((res) => {
        if (res.data.code === 1) {
          _this.weather7DayMsg = res.data.data.data
        } else {
          _this.$message.error(res.data.msg)
        }
      })
    }
  }
}

</script>

<style lang="less" scoped>
  .stateMsg {
    display: flex;
    padding: 1rem 0;
    border-bottom: 1px solid #f2f2f2;
    font-size: 1.4rem;
  }

  .s_left,
  .s_right {
    flex: 1;
    padding: 1rem;
  }

  .s_center {
    width: 35%;
    border-right: 1px solid #f2f2f2;
    border-left: 1px solid #f2f2f2;
  }

  .weather /deep/ .ant-card-grid {
    text-align: left !important;
  }

  .addressIcon {
    font-size: 1.3rem;
    margin: 0 5px;
  }

  .address {
    height: 40px;
    display: flex;
    align-items: center;
    color: #333333;
    font-size: 1.2rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
  }

  .weatherData {
    margin: 10px 0;

    img {
      width: 57px;
      margin-right: 16px;
    }

    .temp {
      color: #333333;
      font-size: 2.8rem !important;
      font-family: Microsoft YaHei;
      font-weight: 400;
      margin-top: 5px;
      line-height: 3rem;
    }

    .state {
      font-size: 1.4rem !important;
      color: #333;
      font-family: Microsoft YaHei;
      font-weight: 400;
    }
  }

  .basicD {
    width: 100%;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;

    .item {
      display: flex;
      color: #333;
      align-items: center;

      img {
        width: 2.8rem;
        height: 100%;
        margin-right: 10px;
      }

      .state {
        font-size: 1.2rem !important;
        font-family: Microsoft YaHei;
        font-weight: 400;
        margin: 0;
      }

      .val {
        font-size: 1.2rem !important;
        // line-height: 1.5;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffd610;
        margin: 0;
      }
    }
  }

  .chartBox {
    width: 100%;
    height: 26rem;
    float: left;
    display: flex;
    align-items: center;
  }

  .slipbtn {
    cursor: pointer;
    color: #333;
    font-size: 1.5rem;
  }

  .yAxis {
    width: 3rem;
    margin: 0 0 0 8px;
    height: calc(26rem - 18px);
    align-self: flex-start;
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #333;
    font-size: 1.2rem;
    text-align: right;
    overflow: hidden;
  }

  .chartWarp {
    width: calc(100% - 3rem - 8px);
    height: 26rem;
    overflow: hidden;
  }

  .chart {
    width: 400%;
    height: 26rem;
    float: left;
    transition: all .3s ease;
    transform: translateX(0);
  }

</style>
