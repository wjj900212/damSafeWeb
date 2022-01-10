<template>
  <div class="Echarts" style="width: 100%;height:100%;">
    <div :id="refid" style="width: 100%;height:100%;"></div>
  </div>
</template>

<script>
export default {
  name: 'EchartsRadar',
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
          text: ''
        },
        radar: {
          indicator: [
            { name: '雨情监测', max: 6500 },
            { name: '水情监测', max: 16000 },
            { name: '渗流监测', max: 30000 },
            { name: '渗压监测', max: 38000 },
            { name: '变形监测', max: 52000 }
          ]
        },
        series: 
          {
            name: '',
            type: 'radar',
            areaStyle: {},
            data: [
              {
                value: [4200, 3000, 20000, 35000, 50000, 18000],
              }
            ]
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
