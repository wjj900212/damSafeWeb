<template>
  <div class="Echarts" style="width: 100%;height:100%;">
    <div :id="refid" style="width: 100%;height:100%;"></div>
  </div>
</template>

<script>
export default {
  name: 'EchartsScatter',
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
      console.log(this.data)
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
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            show: true,
            textStyle: {
              color: '#ffffff'
            }
          }
        },
        yAxis: {
          type: 'value',
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
        series: {
          name: name,
          type: 'scatter',
          data: data
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
