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
      // this.$get('https://echarts.cdn.apache.org/examples/data/asset/data/aqi-beijing.json').then((r) => {
      let data = this.data
      let name = this.name
      if (this.data.length === 0) {
        myChart.setOption({}, true)
        return
      }
      myChart.setOption({
        title: {
          text: name
        },
        legend: {
          data: []
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: 'Sales', max: 6500 },
            { name: 'Administration', max: 16000 },
            { name: 'Information Technology', max: 30000 },
            { name: 'Customer Support', max: 38000 },
            { name: 'Development', max: 52000 }
          ]
        },
        series: 
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: 'Allocated Budget'
              },
            ]
          }
  
      }, true)
      // myChart.refresh()
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
