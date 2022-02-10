<template>
  <div class="Echarts" :style="{width: '100%', height: '100%'}">
    <div :id="refid" :style="{width: '100%', height: '100%'}"></div>
  </div>
</template>

<script>
export default {
  name: "EchartsRelationship",
  props: {
    data: {
      require: true,
    },
    refid: {
      require: true,
    },
  },
  data() {
    return {
      color: ["#2dda9f", "#0099ff", "#dddd00", "#ffc54f", "#fc425e"],
    };
  },
  methods: {
    drawLine() {
      console.log(this.data);
      let myChart = this.$echarts.init(document.getElementById(this.refid));
      window.addEventListener('resize',() => { myChart.resize(); });
      // this.$get('https://echarts.cdn.apache.org/examples/data/asset/data/aqi-beijing.json').then((r) => {
      let data = this.data;
      if (this.data.length === 0) {
        myChart.setOption({}, true);
        return;
      }
      myChart.setOption(
        {
          title: {
            text: "",
            left: "center",
          },
          grid: {
            bottom: 80,
          },
          toolbox: {
            feature: {
              restore: {},
              saveAsImage: {},
            },
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              animation: false,
              label: {
                backgroundColor: "#505765",
              },
            },
          },
          legend: {
            data: data.map(item => {
              return item.targetName
            }),
            left: 10,
          },
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 0,
              end: 100,
            }
          ],
          xAxis: [
            {
              type: "time",
              boundaryGap: false,
              axisLine: { onZero: false }
              // prettier-ignore
            },
          ],
          yAxis: data.map(item => {
            return {
                id: item.unit,
                name: item.unit,
                position: item.showType === "1" ? "left" : "right",
                nameLocation: "center",
                type: "value",
                inverse: item.showType === "1" ? true : false,
                axisLine: {
                  show: true
                }
              }
          }),
          series: data.map((item, index) => {
            return {
                id: item.unit,
                name: item.targetName,
                type: item.showType === "1" ? "bar" : "line",
                yAxisIndex: index,
                lineStyle: {
                  width: 1,
                },
                emphasis: {
                  focus: "series",
                },
                data: item.list.map(it => {
                  return it
                })
              }
          })
        },
        true
      );
      // myChart.refresh()
      setTimeout(() => {
        myChart.resize()
      },500)
    },
  },
  mounted() {
    // this.$nextTick(() => {
    //   myChart.resize()
    // })
      this.drawLine();
    // })
  },
  watch: {
    data(val) {
      // 监听数据发生改变 刷新图表数据
      // this.$nextTick(() => {
        this.drawLine();
      // })
    },
  },
};
</script>

<style>
</style>
