<template>
  <div class="Echarts" style="width: 100%;height:100%;">
    <div :id="refid" style="width: 100%;height:100%;"></div>
  </div>
</template>

<script>
export default {
  name: 'EchartsLine',
  props: {
    data: {
      require: true
    },
    name: {
      type: String
    },
    boundary: {
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
    parseThreshold (arr) {
      let p = []
      let d = []
      arr.forEach((item, index, array) => {
        if (index === (array.length - 1)) {
          p.push({gt: item, color: this.color[index]})
        } else {
          p.push({gt: item, lte: array[index + 1], color: this.color[index]})
        }
        d.push({yAxis: item})
      })
      return {p: p, d: d}
    },
    drawLine () {
      console.log(this.refid)
      let myChart = this.$echarts.init(document.getElementById(this.refid))
      window.addEventListener('resize',() => { myChart.resize(); });
      // this.$get('https://echarts.cdn.apache.org/examples/data/asset/data/aqi-beijing.json').then((r) => {
      let data = this.data
      let boundary = this.boundary
      let name = this.name
      let obj = this.parseThreshold(boundary)
      console.log(obj)
      if (this.data.length === 0) {
        myChart.setOption({}, true)
        return
      }
      myChart.setOption({
        title: {
          text: name,
          textStyle: {
            fontSize: 12,
            color: '#000'
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
              color: '#000'
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
              color: '#000'
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
              color: '#000'
            }, // 阴影的线条样式
            areaStyle: {
              color: '#000'
            } // 阴影的填充样式
          }
        }, {
          type: 'inside'
        }],
        visualMap: {
          top: 0,
          right: 0,
          textStyle: {
            fontSize: 10, // 字体大小
            color: '#000'// 字体颜色
          },
          precision: 1,
          pieces: obj.p,
          // [{
          //   gt: 0,
          //   lte: 50,
          //   color: '#096'
          // }, {
          //   gt: 50,
          //   lte: 100,
          //   color: '#ffde33'
          // }, {
          //   gt: 100,
          //   lte: 150,
          //   color: '#ff9933'
          // }, {
          //   gt: 150,
          //   lte: 200,
          //   color: '#cc0033'
          // }, {
          //   gt: 200,
          //   lte: 300,
          //   color: '#660099'
          // }, {
          //   gt: 300,
          //   color: '#7e0023'
          // }],
          outOfRange: {
            color: '#2dda9f'
          }
        },
        series: {
          name: name,
          type: 'line',
          data: data.map(function (item) {
            return item[1]
          }),
          markLine: {
            silent: true,
            data: obj.d
            // [{
            //   yAxis: 50
            // }, {
            //   yAxis: 100
            // }, {
            //   yAxis: 150
            // }, {
            //   yAxis: 200
            // }, {
            //   yAxis: 300
            // }]
          }
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
