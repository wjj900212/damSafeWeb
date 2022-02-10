<template>
  <div class="Echarts" style="width: 100%;height:100%;">
    <div :id="refid" style="width: 100%;height:100%;"></div>
  </div>
</template>

<script>
// import 'echarts-gl'

export default {
  name: 'EchartsThinbar',
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
      window.addEventListener('resize',() => { myChart.resize(); });
      let data = this.data
      let name = this.name
      console.log('EchartsThinbar',data)
      if (this.data.xAxis.length === 0) {
        myChart.setOption({}, true)
        return
      }
      let option = {
        title: {
          text: name,
          textStyle: {
            fontSize: 12,
            color: '#000'
          }
        },
        toolbox: {
            // y: 'bottom',
            feature: {
                magicType: {
                    type: ['stack', 'tiled']
                },
                dataView: {},
                saveAsImage: {
                    pixelRatio: 2
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
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
            data: data.xAxis.map(function (item) {
              return item
            }),
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
        series: [{
            name: name,
            type: 'bar',
            data: data.yAxis.map(function (item) {
              return item
            })
        }]
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
    }
  }
}
</script>

<style>
</style>
