<template>
  <div class="Echarts" style="width: 100%; height: 100%">
    <div :id="refid" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script>
export default {
  name: 'EchartsBarLine',
  props: {
    cordon: {
      require: true
    },
    rainfall: {
      require: true
    },
    totalRainfall: {
      require: true
    },
    refid: {
      require: true
    }
  },
  data () {
    return {
      color: ['#2dda9f', '#0099ff', '#dddd00', '#ffc54f', '#fc425e']
    }
  },
  methods: {
    drawLine () {
      console.log(this.rainfall)
      let myChart = this.$echarts.init(document.getElementById(this.refid))
      window.addEventListener('resize', () => { myChart.resize() })
      // this.$get('https://echarts.cdn.apache.org/examples/data/asset/data/aqi-beijing.json').then((r) => {
      if (this.rainfall.length === 0 && this.totalRainfall.length === 0) {
        myChart.setOption({}, true)
        return
      }
      myChart.setOption(
        {
          title: {
            text: '',
            left: 'center'
          },
          grid: {
            bottom: 80
          },
          toolbox: {
            feature: {
              restore: {},
              saveAsImage: {}
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              animation: false,
              label: {
                backgroundColor: '#505765'
              }
            }
          },
          legend: {
            data: ['降雨量', '累计雨量'],
            left: 10
          },
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 0,
              end: 100
            },
            {
              type: 'inside',
              realtime: true,
              start: 0,
              end: 100
            }
          ],
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              axisLine: { onZero: false },
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#000'
                }
              }
            }
          ],
          yAxis: [
            {
              name: '降雨量(mm)',
              type: 'value',
              max: 200
            },
            {
              name: '累计雨量(mm)',
              nameLocation: 'start',
              max: 80000,
              type: 'value',
              inverse: true
            }
          ],
          series: [
            {
              name: '降雨量',
              type: 'line',
              lineStyle: {
                width: 1
              },
              emphasis: {
                focus: 'series'
              },
              markLine: {
                silent: true,
                symbol: ['arrow', 'none'],
                data: this.cordon.map(item => {
                  return {
                    yAxis: item[1],
                    lineStyle: {
                      color: 'red'
                    },
                    label: {
                      position: 'middle',
                      formatter: item[0] + ': {c}'
                      //   color: 'red'
                    }
                  }
                })
              },
              data: this.rainfall
            },
            {
              name: '累计雨量',
              type: 'bar',
              yAxisIndex: 1,
              barMaxWidth: '20',
              lineStyle: {
                width: 1
              },
              emphasis: {
                focus: 'series'
              },
              data: this.totalRainfall
            }
          ]
        },
        true
      )
      // myChart.refresh()
      setTimeout(() => {
        myChart.resize()
      }, 500)
    }
  },
  mounted () {
    this.drawLine()
    // })
  },
  watch: {
    rainfall (val) {
      // 监听数据发生改变 刷新图表数据
      this.drawLine()
    }
  }
}
</script>

<style>
</style>
