<template>
  <!-- 大坝安全监测 重点区域监控 -->
  <div class="safeAmonitor">
    <borderCom :titTxt="title" @toggle="titToggle" />
    <div class="conBox">
      <div id="safeChart" v-show="actInd===0&&!reservoirId"></div>
      <div v-show="actInd===1&&!reservoirId">
        <!-- <a-empty :description="false" /> -->
        <div class="monitor">
          <div class="mbox" v-for="i in 2" :key='i'>
            <div class="videoArea">
              <img src="static/img/监控.png">
            </div>
            <div class="m_name">
              水库大门东侧
            </div>
          </div>
          <div class="mbox"></div>
        </div>
      </div>

      <div class="typeBox" v-show="reservoirId">
        <div class="typeItem" :class="typeAct==1?'act':''" @click="typeChange(1)">渗流</div>
        <div class="typeItem typeItem2" :class="typeAct==2?'act':''" @click="typeChange(2)">渗压</div>
        <div class="typeItem" :class="typeAct==3?'act':''" @click="typeChange(3)">变形</div>
      </div>
      <div class="selectBox" v-show="reservoirId&&typeAct==2">
        <a-select v-model="OsmoticScenesId" style="width: 80px" @change="getOsmoticData()">
          <a-select-option v-for="v,i in OsmoticScenes" :key="i" :value="v.sceneId">{{v.sceneName}}</a-select-option>
        </a-select>
      </div>
      <div class="selectBox" v-show="reservoirId&&typeAct==3">
        <a-select v-model="VariantPnId" style="width: 100px">
          <a-select-option v-for="v,i in VariantPns" :key="i" :value="v.pnId">{{v.pnName}}</a-select-option>
        </a-select>
      </div>
      <div id="safeChartR" v-show="reservoirId"></div>
    </div>
  </div>
</template>

<script>
  import borderCom from "./border.vue"
  import Bus from "../../utils/bus"
  var labelOption = {
    show: true,
    position: 'top',
    distance: 5,
    color: '#fff'
  }
  export default {
    components: {
      borderCom
    },
    data() {
      return {
        safeChart: '',
        safeChartR: '',
        actInd: 0,
        reservoirId: '',
        title: ['大坝安全监测', '重点区域监控'],
        typeAct: '',
        chartData: [],
        OsmoticScenes: [], //渗压截面
        OsmoticScenesId: '',
        VariantPns: [], //变形监测点
        VariantPnId: ''
      };
    },
    methods: {
      // 切换大坝安全 视频监控
      titToggle(ind) {
        // console.log(ind)
        this.actInd = ind
        if (ind === 0) this.getChartData()
      },
      // 总大坝安全监测
      getChartData() {
        if (!this.myChart) {
          var chartDom = document.getElementById('safeChart');
          this.safeChart = this.$echarts.init(chartDom);
        }
        this.safeChart.clear()
        this.$get("/web/onePicture/damSafetyMonitor").then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return false
          }
          var option = {
            color: ['rgba(6, 252, 255, .72)', 'rgba(255, 239, 64, .66)', 'rgba(2, 163, 253, .75)'],
            grid: {
              left: 30,
              top: 50,
              bottom: 25,
              right: 10
            },
            tooltip: {
              backgroundColor: "#041542",
              borderColor: "#00CCFF", //设置边框颜色
              borderRadius: 15,
              textStyle: {
                color: "#fff",
              },
              confine: true, //避免溢出显示不全
              trigger: 'axis',
              formatter: function (param) {
                let color = ['rgba(6, 252, 255, .72)', 'rgba(255, 239, 64, .66)', 'rgba(2, 163, 253, .75)']
                let str = ''
                str += `<div>${param[0].name}</div>`
                param.forEach((v, i) => {
                  str += `<div style="display:flex;align-items: center;margin-top: 3px;">
                <span style="border-radius:10px;width:10px;height:10px;background-color:${color[i]};"></span>
                <span style='margin:0 5px;margin-right:15px;'>${v.seriesName}</span>
                <span style="margin-left: auto;">${v.value}</span>
                </div>`
                })
                return str
              }
            },
            legend: {
              textStyle: {
                color: '#fff'
              },
              data: ['渗流监测', '渗压监测', '变形监测']
            },
            xAxis: {
              type: 'category',
              axisLine: {
                lineStyle: {
                  color: '#fff',
                }
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#fff'
                },
                formatter: function (params) {
                  var val = "";
                  if (params.length > 6) {
                    val = params.substr(0, 6) + '...';
                    return val;
                  } else {
                    return params;
                  }
                }
              },
              data: rr.data.map(v => {
                return v.reservoirName
              })
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#fff'
                }
              },
              axisLine: {
                show: false,
              },
              splitLine: { //网格线
                show: false
              }
            },
            series: [{
              name: '渗流监测',
              label: labelOption,
              itemStyle: {
                normal: {
                  color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: "rgba(25, 30, 42, .34)"
                  }, {
                    offset: 1,
                    color: "rgba(6, 252, 255, .72)"
                  }], false)
                }
              },
              data: rr.data.map(v => {
                return v.sl
              }),
              type: 'bar',
            }, {
              name: '渗压监测',
              label: labelOption,
              data: rr.data.map(v => {
                return v.sy
              }),
              type: 'bar',
              itemStyle: {
                normal: {
                  color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: "rgba(25, 30, 42, .34)"
                  }, {
                    offset: 1,
                    color: "rgba(255, 239, 64, .66)"
                  }], false)
                }
              },
            }, {
              name: '变形监测',
              label: labelOption,
              data: rr.data.map(v => {
                return v.bx
              }),
              type: 'bar',
              itemStyle: {
                normal: {
                  color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: "rgba(7, 42, 157, .34)"
                  }, {
                    offset: 1,
                    color: "rgba(2, 163, 253, .75)"
                  }], false)
                }
              },
            }]
          };
          option && this.safeChart.setOption(option, true);
        })
      },
      // 单个水库画图
      drawRChart() {
        if (!this.safeChartR) {
          var chartDom = document.getElementById('safeChartR');
          this.safeChartR = this.$echarts.init(chartDom);
        }
        this.safeChartR.clear()
        var seriesData = [],
          legend = [],
          xAxis = []
        if (this.typeAct == 1) {
          this.chartData.forEach(v => {
            let obj = {
              name: v.pnName,
              type: 'line',
              data: v.data.map(vv => {
                return [vv.time, vv.value]
              })
            }
            seriesData.push(obj)
            legend.push(v.pnName)
          })
          xAxis = [{
            type: "time",
            boundaryGap: false,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              show: true,
              onZero: false,
              lineStyle: {
                color: 'rgba(0, 176, 255, .34)'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            },
          }]
        } else if (this.typeAct == 2) {
          this.chartData.data.value.forEach(v => {
            let obj = {
              name: v.pnName,
              type: 'line',
              data: v.value
            }
            seriesData.push(obj)
            legend.push(v.pnName)
          })
          xAxis = [{
            type: "category",
            data: this.chartData.data.times,
            boundaryGap: false,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              show: true,
              onZero: false,
              lineStyle: {
                color: 'rgba(0, 176, 255, .34)'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            },
          }]
        } else if (this.typeAct == 3) {
          let arr = [{
            name: 'x',
            type: 'line',
            data: this.chartData.map(v => {
              return v[1]
            })
          }, {
            name: 'y',
            type: 'line',
            data: this.chartData.map(v => {
              return v[2]
            })
          }, {
            name: 'z',
            type: 'line',
            data: this.chartData.map(v => {
              return v[3]
            })
          }]
          seriesData = arr
          legend = ['x', 'y', 'z']
          xAxis = [{
            type: "category",
            data: this.chartData.map(v => {
              return v[0]
            }),
            boundaryGap: false,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              show: true,
              onZero: false,
              lineStyle: {
                color: 'rgba(0, 176, 255, .34)'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            },
          }]
        }

        var option = {
          color: ['rgba(255, 160, 108, 1)', 'rgba(44, 194, 183, 1)', 'red'],
          grid: [{
            left: 50,
            right: 30,
            top: 40,
            bottom: 30,
          }],
          tooltip: {
            confine: true, //避免溢出显示不全
            trigger: 'axis'
          },
          legend: {
            type: 'scroll',
            width: "80%",
            left: 90,
            textStyle: {
              color: '#fff'
            },
            data: legend
          },
          xAxis: xAxis,
          yAxis: [{
            type: 'value',
            name: this.typeAct == 1 ? '瞬时流量：m³/s' : this.typeAct == 2 ? '水位高程：m' : '位移：mm',
            nameTextStyle: {
              color: "#fff",
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: 'rgba(0, 176, 255, .34)'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            },
            splitLine: { //网格线
              show: true,
              lineStyle: {
                color: 'rgba(0, 176, 255, .34)',
                width: 1,
                type: 'solid'
              }
            }
          }],
          series: seriesData
        };
        this.safeChartR.setOption(option, true)
      },
      // 切换渗流 渗压 变形
      typeChange(i) {
        if (i == this.typeAct) return false
        this.typeAct = i
        this.getReservoirData()
      },
      // 获取单个水库数据信息
      getReservoirData() {
        if (this.typeAct == 1) {
          this.getSLData()
        } else if (this.typeAct == 2) {
          this.getOsmoticScenes()
        } else if (this.typeAct == 3) {
          this.getVariantPns()
        }
      },
      // 获取渗流数据
      getSLData() {
        let o = {
          reservoirId: this.reservoirId
        }
        var d = new Date();
        var str = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ' 00:00:00'
        o.starttime = str

        this.$get('/web/onePicture/monitorDataListVadose', o).then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return
          }
          this.chartData = rr.data
          this.drawRChart()
        })
      },
      // 获取渗压下的 断面(场景)
      getOsmoticScenes() {
        let o = {
          reservoirId: this.reservoirId
        }
        this.$get('/web/onePicture/getOsmoticScenes', o).then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return
          }
          this.OsmoticScenes = rr.data
          if (rr.data.length > 0) {
            this.OsmoticScenesId = rr.data[0].sceneId
            this.getOsmoticData()
          }
        })
      },
      // 获取渗压数据 
      getOsmoticData() {
        this.$get('/web/monitorScene/monitorPnDataOsmotic?sceneId=' + this.OsmoticScenesId).then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return
          }
          this.chartData = rr.data
          this.drawRChart()
        })
      },
      // 获取变形监测点
      getVariantPns() {
        let o = {
          reservoirId: this.reservoirId
        }
        this.$get('/web/onePicture/getVariantPns', o).then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return
          }
          this.VariantPns = rr.data
          if (rr.data.length > 0) {
            this.VariantPnId = rr.data[0].pnId
            this.getVariantData()
          }
        })
      },
      // 变形监测
      getVariantData() {
        this.$get('/web/monitorScene/monitorDataListVariant?pnId=' + this.VariantPnId).then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return
          }
          this.chartData = rr.data
          this.drawRChart()
        })
      }
    },
    mounted() {
      this.getChartData()
      // 点击左侧水库概览列表水库时显示该水库大坝安全监测
      Bus.$on('reservoirId', (reservoirId) => {
        // console.log("组件收到bus消息：", reservoirId);
        if (reservoirId != this.reservoirId) this.typeAct = ''
        this.reservoirId = reservoirId
        if (reservoirId) {
          this.title = '大坝安全监测'
          setTimeout(() => {
            this.typeChange(1)
          }, 300);
        } else {
          this.title = ['大坝安全监测', '重点区域监控']
          this.typeAct = ''
        }
      });
    }
  }

</script>
<style scoped>
  .safeAmonitor {
    width: calc(100% - 10px);
    height: 100%;
    position: absolute;
    margin: 0 5px;
  }

  .conBox {
    width: 99%;
    margin: 0 auto;
    padding: 1rem;
    height: calc(100% - 5rem);
    /* background: url('../../../static/img/model-bg.png') no-repeat;
    background-size: 100% 100%; */
    overflow: hidden;
    /* position: relative; */
    background: rgba(13, 76, 145, 0.4);
    box-shadow: 0px 0px 10px 0px rgba(17, 40, 255, 0.66) inset;
    border-radius: 3px;
  }

  #safeChart,
  #safeChartR {
    width: 100%;
    height: 100%;
  }



  .typeBox {
    position: absolute;
    top: 10px;
    right: 10px;
    line-height: 3rem;
    border: 1px solid rgba(0, 126, 253, .4);
    display: flex;
    align-items: center;
    color: #fff;
  }

  .typeItem {
    padding: 0 18px;
    cursor: pointer;
  }

  .typeItem2 {
    border-left: 1px solid rgba(0, 126, 253, .4);
    border-right: 1px solid rgba(0, 126, 253, .4);
  }

  .typeItem.act {
    background: url('../../../static/img/矩形.png') no-repeat;
    background-size: 100% 100%;
  }

  .selectBox {
    position: absolute;
    top: 55px;
    right: 10px;
    z-index: 10;
  }

  .selectBox>>>.ant-select-selection--single {
    background: transparent;
    color: #fff;
    border-color: #1890ff;
  }

  .selectBox>>>.ant-select-arrow {
    color: #fff;
  }
  /* 监控视频 */
  .monitor{
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-wrap: wrap;
    width: calc(100% - 20px);
    height: 100%;
    overflow: auto;
    position: absolute;
  }
  .mbox{
    width: 48%;
    height: 49%;
    padding-bottom: 1%;
  }
  .videoArea{
    width: 100%;
    height: calc(100% - 30px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* .videoArea img{
    max-width: 100%;
    height: 100%;
    float: left;
  } */
  .m_name{
    background-color: rgba(0, 0, 0, 0.5);
    text-indent: 20px;
    line-height: 30px;
  }
</style>
