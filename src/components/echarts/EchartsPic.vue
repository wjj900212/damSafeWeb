<template>
  <div class="Echarts">
    <div id="main" style="width: 100%;height:350px;"></div>
  </div>
</template>

<script>

export default {
  name: 'EchartsPic',
  props: {
    chartSourceData: {
      require: true
    }
  },
  watch: {
    chartSourceData (value) {
      this.getPictureData()
    }
  },
  mounted () {
    this.getPictureData()
  },
  methods: {
    // https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1593406385047&di=4fa348af8f97092ff5771134d5aa21be&imgtype=0&src=http%3A%2F%2Fa1.att.hudong.com%2F62%2F02%2F01300542526392139955025309984.jpg
    getPictureData: function () {
      let myChart = this.$echarts.init(document.getElementById('main'))
      let redData = []
      let orangeData = []
      let yellowData = []
      let blueData = []
      let greenData = []
      let createDate = []
      let infoDtoList = this.chartSourceData.infoDtoList
      console.log('**********EchartsPic*********')
      console.log(infoDtoList)
      if (infoDtoList === undefined) {
        return
      }
      for (let i = 0; i < infoDtoList.length; i++) {
        let infoDto = []
        createDate.push(infoDtoList[i].createTime)
        if (infoDtoList[i].monitorValue === 1) {
          infoDto.push(infoDtoList[i].createTime, infoDtoList[i].monitorValue, infoDtoList[i].imgList)
          redData.push(infoDto)
        } else if (infoDtoList[i].monitorValue === 2) {
          infoDto.push(infoDtoList[i].createTime, infoDtoList[i].monitorValue, infoDtoList[i].imgList)
          orangeData.push(infoDto)
        } else if (infoDtoList[i].monitorValue === 3) {
          infoDto.push(infoDtoList[i].createTime, infoDtoList[i].monitorValue, infoDtoList[i].imgList)
          yellowData.push(infoDto)
        } else if (infoDtoList[i].monitorValue === 4) {
          infoDto.push(infoDtoList[i].createTime, infoDtoList[i].monitorValue, infoDtoList[i].imgList)
          blueData.push(infoDto)
        } else if (infoDtoList[i].monitorValue === 0) {
          infoDto.push(infoDtoList[i].createTime, infoDtoList[i].monitorValue, infoDtoList[i].imgList)
          greenData.push(infoDto)
        }

        /* infoDto.push(infoDtoList[i].createTime, infoDtoList[i].monitorValue, infoDtoList[i].imgList)
          data.push(infoDto) */
      }
      /* console.log('**********EchartsPic*********')
        console.log(data) */
      let option = {
        color: ['#FF0000', '#FFA500', '#FFFF00', '#0000FF', '#008000'],
        title: {},
        grid: {
          left: '3%',
          right: '7%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          // trigger: 'axis',
          showDelay: 0,
          formatter: function (params) {
            console.log('*****EchartsPic-formatter******')
            console.log(params)
            let img = ''
            if (params.value[2] === '') {
              img = '无图片'
              return params.seriesName +
                  params.value[0] + ' : ' + img
            } else {
              img = params.value[2]
              return params.seriesName +
                  params.value[0] + ' : ' +
                  '<img width="120" :src=' + img + '>'
            }
          },
          axisPointer: {
            show: true,
            type: 'cross',
            lineStyle: {
              type: 'dashed',
              width: 0.1
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
          startValue: '2014-06-01'
        }, {
          type: 'inside'
        }],
        brush: {},
        legend: {
          data: ['红色警报', '橙色警戒', '黄色警示', '蓝色注意', '绿色无异常'],
          left: 'right',
          orient: 'vertical',
          textStyle: {
            color: '#c5f3ff'
          }
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              color: '#c5f3ff'
            },
            data: createDate
          }
        ],
        yAxis: [
          {
            type: 'value',
            scale: true,
            axisLabel: {
              color: '#c5f3ff',
              formatter: '{value}'
            },
            axisLine: {
              lineStyle: {
                color: '#c5f3ff'
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '红色警报',
            type: 'scatter',
            symbol: 'circle',
            symbolSize: 8,
            data: redData
          },
          {
            name: '橙色警戒',
            type: 'scatter',
            symbol: 'circle',
            symbolSize: 8,
            data: orangeData
          },
          {
            name: '黄色警示',
            type: 'scatter',
            symbol: 'circle',
            symbolSize: 8,
            data: yellowData
          },
          {
            name: '蓝色注意',
            type: 'scatter',
            symbol: 'circle',
            symbolSize: 8,
            data: blueData
          },
          {
            name: '绿色无异常',
            type: 'scatter',
            symbol: 'circle',
            symbolSize: 8,
            data: greenData
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>

<style>
</style>
