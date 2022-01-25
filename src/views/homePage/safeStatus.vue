<template>
  <!-- 水库安全状态 -->
  <div class="safeStatus">
    <borderCom titTxt="水库安全状态" />
    <div id="safeStatusChart"></div>
  </div>
</template>

<script>
  import borderCom from "./border.vue"
  export default {
    components: {
      borderCom
    },
    data() {
      return {
        myChart: ''
      };
    },
    methods: {
      getData() {
        this.$get("/web/onePicture/ROVRunstatus").then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return false
          }
          this.drawChart(rr.data)
        })
      },
      drawChart(op) {
        if (!this.myChart) {
          var chartDom = document.getElementById('safeStatusChart');
          this.myChart = this.$echarts.init(chartDom);
        }
        this.myChart.clear()
        var option = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: "vertical",
            right: "5%",
            top: "center",
            // itemGap: 9,
            itemWidth: 10,
            itemHeight: 10,
            icon: "circle",
            textStyle: {
              color: "#fff",
              fontSize: 14,
            },
            formatter: function (name) {
              var data = option.series[0].data;
              let val = "";
              let vv = data.find((v) => {
                return v.name == name;
              });
              if (vv) val = vv.value;
              return name + " " + " " + val;
            },
          },

          series: [{
            name: '水库安全状态',
            center: ['30%', '45%'],
            type: 'pie',
            radius: ['45%', '65%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 3,
              //   borderColor: "#000218cc",
              borderWidth: 5,
            },
            hoverAnimation: true,

            label: {
              show: true,
              position: "center",
              fontSize: 16,
              lineHeight: 20,
              formatter: function (params) {
                // if (params.dataIndex != 0) {}
                // return (
                //   "{p|" + params.percent + "%}" + "\n{nm|" + params.name + "}"
                // );
                if (params.dataIndex === 0) {
                  return (
                    "{p|" + params.percent + "%}" + "\n{nm|" + params.name + "}"
                  );
                } else {
                  return "";
                }
              },
              emphasis: {
                formatter: function (params) {
                  if (params.dataIndex != 0) {
                    return (
                      "{p|" +
                      params.percent +
                      "%}" +
                      "\n{nm|" +
                      params.name +
                      "}"
                    );
                  }
                },
              },

              rich: {
                p: {
                  width: 90,
                  color: "#fff",
                  fontSize: 24,
                  height: 30,
                  backgroundColor: "#347693",
                },
                nm: {
                  width: 90,
                  color: "#B8EDF0",
                  fontSize: 16,
                  backgroundColor: "#347693",
                },
              },
            },
            labelLine: {
              show: false,
            },
            data: [{
                value: op.status0,
                name: '正常'
              },
              {
                value: op.status1,
                name: '异常'
              },
              {
                value: op.status2,
                name: '险情'
              }
            ],
          }, ],
        };
        option && this.myChart.setOption(option, true);
      }
    },
    mounted() {
      this.getData()
    }
  }

</script>
<style scoped>
  .safeStatus {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  #safeStatusChart {
    padding: 0 1rem;
    width: 100%;
    height: 25rem;
    margin-top: 38px;
  }

</style>
