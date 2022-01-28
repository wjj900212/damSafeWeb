<template>
  <!-- 水库安全状态 -->
  <div class="safeStatus">
    <borderCom titTxt="水库安全状态" />
    <div class="safeStatusCon">
      <div id="safeStatusChart"></div>
      <div>
        <div class="item">
          <span class="cricle"></span>
          <span class="state">正常</span>
          <span class="val">{{sData.status0}}</span>
        </div>
        <div class="item item2">
          <span class="cricle c2"></span>
          <span class="state">异常</span>
          <span class="val">{{sData.status1}}</span>
        </div>
        <div class="item">
          <span class="cricle c3"></span>
          <span class="state">险情</span>
          <span class="val">{{sData.status2}}</span>
        </div>
      </div>
    </div>
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
        myChart: '',
        sData: {
          status0: '',
          status1: '',
          status2: ''
        }
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
          this.sData = rr.data
          this.drawChart(rr.data)
        })
      },
      drawChart(op) {
        let that=this
        if (!this.myChart) {
          var chartDom = document.getElementById('safeStatusChart');
          this.myChart = this.$echarts.init(chartDom);
        }
        this.myChart.clear()
        var option = {
          // tooltip: {
          //   trigger: 'item'
          // },
          series: [{
            name: '水库安全状态',
            center: ['50%', '50%'],
            type: 'pie',
            radius: ['35%', '65%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 3,
              borderWidth: 5,
            },
            hoverAnimation: true,

            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            data: [{
                value: op.status0,
                name: '正常',
                itemStyle: {
                  normal: { //颜色渐变
                    color: new that.$echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [{
                          offset: 0,
                          color: '#66E1B9'
                        },
                        {
                          offset: 1,
                          color: '#3CC8AE'
                        }
                      ]
                    )
                  }
                }
              },
              {
                value: op.status1,
                name: '异常',
                itemStyle: {
                  normal: { //颜色渐变
                    color: new that.$echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [{
                          offset: 0,
                          color: '#FFD33B'
                        },
                        {
                          offset: 1,
                          color: '#F06B1D'
                        }
                      ]
                    )
                  }
                }
              },
              {
                value: op.status2,
                name: '险情',
                itemStyle: {
                  normal: { //颜色渐变
                    color: new that.$echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [{
                          offset: 0,
                          color: '#FEA7A5'
                        },
                        {
                          offset: 1,
                          color: '#FE5230'
                        }
                      ]
                    )
                  }
                }
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
    width: calc(100% - 10px);
    height: 100%;
    position: absolute;
    margin: 0 5px;
  }

  .safeStatusCon {
    width: 100%;
    height: 22rem;
    background: url('../../../static/img/model-bg.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }

  #safeStatusChart {
    width: 15rem;
    height: 15rem;
    background: url('../../../static/img/饼图外环.png') no-repeat;
    background-size: 100% 100%;
  }

  .item {
    width: 13rem;
    height: 5rem;
    background: url('../../../static/img/组980.png') no-repeat;
    background-size: 100% 100%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    font-size: 1.5rem;
  }

  .item2 {
    margin: 8px 0;
  }

  .cricle {
    width: 1rem;
    height: 1rem;
    border-radius: 2px;
    background: linear-gradient(180deg, #66E1B9, #3CC8AE);
  }

  .c2 {
    background: linear-gradient(180deg, #F06B1D, #FCBC35);
  }

  .c3 {
    background: linear-gradient(180deg, #FEA7A5, #FE5230);
  }

  .item .val {
    font-size: 2.4rem;
    width: 45px;
    text-align: center;
  }

</style>
