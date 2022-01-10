<template>
  <div class="Echarts" style="width: 100%;height:100%;">
    <div :id="refid" style="width: 100%;height:300px;"></div>
  </div>
</template>

<script>

export default {
  name: 'EchartsArrLine',
  props: {
    data: {
      require: true
    },
    name: {
      type: String
    },
    type: {
      type: String
    },
    refid: {
      require: true
    }
  },
  methods: {
    drawLine () {
      let myChart = this.$echarts.init(document.getElementById(this.refid))
      window.addEventListener('resize',() => { myChart.resize(); });
      let data = this.data
      let type = this.type
      if (this.data.length === 0) {
        myChart.setOption({}, true)
        return
      }
      let option = {
        title: {
          text: '',
          textStyle: {
            fontSize: 12,
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params, ticket, callback) {
            console.log(params)
            return params[0].marker + params[0].seriesName + '<br/>' + type + ': ' + params[0].data[0] + '<br/>' + 'z: ' + params[0].data[1]
          }
        },
        legend: {
          data: data.map(function (item) {
            return item[0].time
          }),
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
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        xAxis: {
          // name: type,
          type: 'value',
          splitLine: {
            show: false
          },
          boundaryGap: false,
          // data: data.map(function (item) {
          //   return item.
          // }),
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          position: 'right',
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          },
          splitLine: {
            show: false
          },
        },
        series: data.map(function (item, index) {
          return {
            name: item[0].time,
            type: 'line',
            // stack: '总量',
            data: item.map(function (it, index) {
              return type=== '节点' ? [index + 1, it.z] : [it[type], it.z]
            })
          }
        })
        // [
        //   {
        //     name: 'x',
        //     type: 'line',
        //     stack: '总量',
        //     data: data.map(function (item, index) {
        //       return item.data
        //     })
        //   },
        //   {
        //     name: 'y',
        //     type: 'line',
        //     stack: '总量',
        //     data: data.map(function (item, index) {
        //       return item[1]
        //     })
        //   },
        //   {
        //     name: 'z',
        //     type: 'line',
        //     stack: '总量',
        //     data: data.map(function (item, index) {
        //       return item[2]
        //     })
        //   }
        // ]
      }
      myChart.setOption(option, true)
      setTimeout(() => {
        myChart.resize()
      },500)
    }
  },
  mounted () {
    this.drawLine()
  },
  watch: {
    data (val) { // 监听数据发生改变 刷新图表数据
      this.drawLine()
    },
    type (val) {// 监听数据发生改变 刷新图表数据 (测斜 x-z或者y-z)
      console.log(val)
      this.drawLine()
    }
  }
}
</script>

<style>
</style>
