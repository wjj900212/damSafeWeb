<template>
  <div class="Echarts" style="width: 100%;height:100%;">
    <div :id="refid" style="width: 100%;height:100%;"></div>
  </div>
</template>

<script>
export default {
  name: 'EchartsoLine',
  props: {
    data: {
      require: true
    },
    name: {
      type: String
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
      console.log(this.refid)
      let myChart = this.$echarts.init(document.getElementById(this.refid))
      window.addEventListener('resize',() => { myChart.resize(); });
      // this.$get('https://echarts.cdn.apache.org/examples/data/asset/data/aqi-beijing.json').then((r) => {
      let data = this.data
      let name = this.name
      if (this.data.length === 0) {
        myChart.setOption({}, true)
        return
      }
      myChart.setOption({
        title: {
          text: name,
          textStyle: {
            fontSize: 12,
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          data: data.map(function (item) {
            return item[0]
          }),
          axisLabel: {
            show: true,
            textStyle: {
              color: '#ffffff'
            }
          }
        },
        yAxis: {
          splitLine: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#ffffff'
            }
          }
        },
        toolbox: {
          left: 'center',
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        dataZoom: [{
          startValue: '2020-06-01',
          backgroundColor: 'rgba(47,69,84,0.5)',
          dataBackground: { // 数据阴影的样式。
            lineStyle: {
              color: '#ffffff'
            }, // 阴影的线条样式
            areaStyle: {
              color: '#ffffff'
            } // 阴影的填充样式
          }
        }, {
          type: 'inside'
        }],
        series: {
          name: name,
          type: 'line',
          data: data.map(function (item) {
            return item[1]
          })
        }
      }, true)
      // myChart.refresh()
      setTimeout(() => {
        myChart.resize()
      },500)
    }
  },
  mounted () {
    this.drawLine()
    // })
  },
  watch: {
    data (val) { // 监听数据发生改变 刷新图表数据
      this.drawLine()
    }
  }
}
</script>

<style>
</style>
