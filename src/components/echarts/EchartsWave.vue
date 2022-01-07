<template>
  <div class="Echarts" style="width: 100%;height:100%;">
    <div :id="refid" style="width: 100%;height:100%;"></div>
  </div>
</template>

<script>
// import 'echarts-gl'

export default {
  name: 'EchartsWave',
  props: {
    data: {
      require: true
    },
    refid: {
      require: true
    }
  },
  methods: {
    drawLine () {
      let myChart = this.$echarts.init(document.getElementById(this.refid))
      let data = this.data
      if (this.data.length === 0) {
        myChart.setOption({}, true)
        return
      }
      let option = {
        // title: {
        //   text: '折线图堆叠'
        // },
        color: ['red', 'yellow', 'blue'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['x', 'y', 'z'],
          textStyle: {
            color: '#fff'
          }
        },
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
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            name: 'x',
            type: 'line',
            stack: '总量',
            data: data.map(function (item, index) {
              return item[0]
            })
          },
          {
            name: 'y',
            type: 'line',
            stack: '总量',
            data: data.map(function (item, index) {
              return item[1]
            })
          },
          {
            name: 'z',
            type: 'line',
            stack: '总量',
            data: data.map(function (item, index) {
              return item[2]
            })
          }
        ]
      }
      myChart.setOption(option, true)
    }
  },
  mounted () {
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
