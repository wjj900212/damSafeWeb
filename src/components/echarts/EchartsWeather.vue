<template>
  <div ref="echart" style="width:100%;height:26rem;" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'future-echarts',
  props: {
    chartData: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler (val) {
        this.setOptions(val)
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart () {
      this.chart = echarts.init(this.$refs.echart)
      this.setOptions(this.chartData)
    },
    setOptions (data) {
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
      let option = {
        grid: {
          show: true,
          backgroundColor: 'transparent',
          opacity: 0.3,
          borderWidth: '0',
          top: '180',
          bottom: '0'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          show: false
        },
        xAxis: [
          // 日期
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
            nameTextStyle: {
            },
            data: data.map((item) => {
              return item.week
            })
          },
          // 星期
          {
            type: 'category',
            boundaryGap: false,
            position: 'top',
            offset: 110,
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
              let time = item.date.split('-')
              return time[1] + '/' + time[2]
            })
          },
          // 天气图标
          {
            type: 'category',
            boundaryGap: false,
            position: 'top',
            offset: 60,
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
               // console.log(data[index].code, value)
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
        series: [
          {
            name: '最高气温',
            type: 'line',
            data: data.map((item) => {
              return item.high
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
          },
          {
            name: '最低气温',
            type: 'line',
            data: data.map((item) => {
              return item.low
            }),
            symbol: 'emptyCircle',
            symbolSize: 10,
            showSymbol: true,
            smooth: true,
            itemStyle: {
              normal: {
                color: 'blue'
              }
            },
            label: {
              show: true,
              position: 'bottom',
              formatter: '{c} °C'
            },
            lineStyle: {
              width: 1
            },
            areaStyle: {
              opacity: 1,
              color: 'transparent'
            }
          }
        ]
      }
      option && this.chart.setOption(option)
    }
  }
}
</script>

<style scoped>

</style>
