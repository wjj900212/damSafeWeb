<template>
  <div class="Echarts" style="width: 100%;height:100%;">
    <div id="main" style="width: 100%;height:100%;"></div>
  </div>
</template>

<script>
// import 'echarts-gl'

export default {
  name: 'Echarts',
  props: {
    data: {
      require: true
    },
    name: {
      type: String
    },
    objname: {
      type: String
    },
    yname: {
      type: String
    }
  },
  methods: {
    drawLine () {
      let myChart = this.$echarts.init(document.getElementById('main'))
      let data = this.data
      let name = this.name
      let yname = this.yname
      let objname = this.objname
      if (this.data.length === 0) {
        myChart.setOption({}, true)
        return
      }
      console.log(data)
      let option = {
        // title: {
        //   text: '折线图堆叠'
        // },
        tooltip: {
          trigger: 'axis'
        },
        // legend: {
        //   data: ['Z'],
        //   textStyle: {
        //     color: '#000'
        //   }
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.map(function (item, index) {
            return (index + 1)
          }),
          axisLine: {
            show: true,
            lineStyle: {
              color: '#000'
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#000'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: yname,
          nameTextStyle : {
            color: '#000'
          },
          nameLocation: 'center',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#000'
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#000'
            }
          }
        },
        series: [
          {
            name: name,
            type: 'line',
            // stack: '总量',
            data: data.map(function (item, index) {
              return item[objname]
            })
          }
        ]
      }
      myChart.setOption(option, true)
    }
  },
  mounted () {
    this.drawLine()
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
