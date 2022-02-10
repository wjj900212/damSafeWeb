<template>
  <div class="Echarts" style="width: 100%;height:100%;">
    <div id="main" style="width: 500px;height:350px;"></div>
  </div>
</template>

<script>
// import 'echarts-gl'

export default {
  name: 'EchartsArr',
  props: {
    data: {
      require: true
    },
    name: {
      type: String
    }
  },
  methods: {
    drawLine () {
      let myChart = this.$echarts.init(document.getElementById('main'))
      let data = this.data
      let name = this.name
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
        legend: {
          data: data.map(function (item, index) {
            return item.projPnName
          }),
          textStyle: {
            color: '#000'
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
          // data: data.map(function (item, index) {
          //   return (index + 1)
          // }),
          axisLabel: {
            show: true,
            textStyle: {
              color: '#000'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: true,
            textStyle: {
              color: '#000'
            }
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
        series: data.map(function (item, index1) {
          return {
            name: item.projPnName,
            type: 'line',
            // stack: '总量',
            data: item.data.map(function (i, index2) {
              return i
            })
          }
        })
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
