<template>
  <div class="Echarts" style="width: 100%;height:100%;">
    <div :id="refid" style="width: 100%;height:100%;"></div>
  </div>
</template>

<script>
// import 'echarts-gl'

export default {
  name: 'EchartsPolar',
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
  methods: {
    drawLine () {
      let myChart = this.$echarts.init(document.getElementById(this.refid))
      let data = this.data
      let name = this.name
      if (this.data.length === 0) {
        myChart.setOption({}, true)
        return
      }
      console.log(data)
      let option = {
        title: {
          text: name,
          textStyle: {
            fontSize: 12,
            color: '#fff'
          }
        },
        tooltip: {
          formatter: function (params) {
            console.log(params)
            return '倾角：' + params.value[0] + '<br/>' + '倾向：' + params.value[1] + '<br/>' + params.value[2]
          }
        },
        polar: {},
        angleAxis: {
          min: 0,
          max: 360,
          interval: 30,
          startAngle: 90,
          boundaryGap: false,
          splitLine: {
            show: true
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            color: '#7589c9'
          }
        },
        radiusAxis: {
          axisLabel: {
            color: '#7589c9'
          },
          axisLine: {
            lineStyle: {
              color: '#7589c9'
            }
          }

        },
        series: [{
          name: name,
          type: 'scatter',
          symbolSize: 5,
          coordinateSystem: 'polar',
          data: data.map(function (item) {
            return item
          })
        }]
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
