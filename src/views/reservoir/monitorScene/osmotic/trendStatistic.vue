<template>
  <!-- 渗压监测趋势统计 -->
  <div class="trendStatistic">
    <a-card :bodyStyle="{ padding: '10px' }">
      <div class="safetyPlan">
        <div class="card">
          <img src="static/img/渗压监测趋势统计.png">
          <span>渗压监测趋势统计</span>
        </div>
        <div>
          <a-select v-model="queryParams.sceneId" :style="{width:'20rem'}" @change="sceneChange">
            <a-select-option v-for="pn in pnList" :key="pn.sceneId" :value="pn.sceneId">{{pn.sceneName}}
            </a-select-option>
          </a-select>
          <a-range-picker @change="onDateChange" style="width:250px;" />
          <a-select v-model="dateCurrent" @change="dateChange" style="width:100px;">
            <a-select-option value="1">今日</a-select-option>
            <a-select-option value="2">近三天</a-select-option>
            <a-select-option value="3">近一周</a-select-option>
            <a-select-option value="4">近一月</a-select-option>
          </a-select>
          <a-button type="primary" @click="portData">数据导出</a-button>
        </div>
      </div>
      <div style="width: 100%; padding: 5px">
        <div
          style="background: #F9FAFE;color:#5D6574;font-size:1.6rem;line-height:40px;width:calc(100% - 20px);margin:0 auto;padding:0 1rem;">
          当前： <span style="color:#007EFE;">{{sceneName}}</span>
          <span style="margin-right:10px;;color:#007EFE;" v-for="v,i in devCode" :key="i">{{v}}</span>
        </div>
        <div class="stateMsg">
          <div class="echartTU" ref="transChart"></div>
          <div class="s_right">
            <!-- 表格区域 -->
            <a-table ref="TableInfo" :rowKey="(record,index)=>{return index}" :columns="columns" :dataSource="tableData"
              :pagination="pagination" :customRow="customRow">
            </a-table>
          </div>
        </div>

      </div>
    </a-card>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    props: ['hiddenId', 'pnList'],
    components: {
      // chartTU
    },
    data() {
      return {
        sceneName: '',
        dateCurrent: '1',
        columns: [{
          title: '监测点',
          dataIndex: 'pnName'
        }, {
          title: '水位高程',
          dataIndex: 'value1'
        }, {
          title: '水头',
          dataIndex: 'value2'
        }, {
          title: '时间',
          dataIndex: 'time'
        }],
        searchTime: [],
        pagination: {
          current: 1,
          pageSize: 5,
          total: 0,
          onChange: (cur, size) => {
            this.pagination.current = cur
            // this.getData()
          }
        },
        warnValue: [], // 水位警戒值
        queryParams: {
          sceneId: '',
          starttime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          endtime: moment().format('YYYY-MM-DD HH:mm:ss'),
          pageNum: '',
          pageSize: ''
        },
        tableData: [],
        devCode: [],
        myChart: ''
      }
    },
    watch: {
      // hiddenId: {
      //   handler: function (n, o) {},
      //   immediate: true
      // },
      pnList: {
        handler: function (n, o) {
          if (!n || n.length == 0) {
            this.queryParams.sceneId = ''
            this.sceneName = ''
            this.tableData = []
            this.devCode = []
            if (this.myChart) this.myChart.clear()
            return
          }
          if (n.length > 0) {
            this.queryParams.sceneId = n[0].sceneId
            this.sceneName = n[0].sceneName
            this.getData()
          }
        },
        immediate: true
      }
    },
    methods: {
      moment,
      //设置表格隔行变色
      customRow(record, index) {
        return {
          style: {
            // 字体颜色
            color: '#8E8E8E',
            // 行背景色
            'background-color': index % 2 == 1 ? '#F9FAFE' : '#fff'
          }
        }
      },
      sceneChange() {
        this.sceneName = this.pnList.find(v => {
          return v.sceneId == this.queryParams.sceneId
        }).sceneName
        this.getData()
      },
      getData() {
        // this.queryParams.pageNum = this.pagination.current
        if (!this.queryParams.sceneId) {
          this.$message.error('请选择断面')
          return
        }
        this.$get('/web/monitorScene/monitorPnDataOsmotic', this.queryParams).then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return
          }
          this.devCode = rr.data.pns.map(v => {
            return v.devCode
          })
          this.tableData = rr.data.dataList
          this.drawChart(rr.data.data)
        })
      },
      onDateChange(date, dateString) {
        // console.log(date, dateString);
        this.queryParams.starttime = dateString[0] ? dateString[0] + ' 00:00:00' : ''
        this.queryParams.endtime = dateString[1] ? dateString[1] + ' 59:59:59' : ''
        this.getData()
      },
      // 快捷选择时间
      dateChange() {
        if (this.dateCurrent == 1) {
          this.searchTime = [
            this.moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            this.moment().format('YYYY-MM-DD HH:mm:ss')
          ]
        } else if (this.dateCurrent == 2) {
          this.searchTime = [
            this.moment().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
            this.moment().format('YYYY-MM-DD HH:mm:ss')
          ]
        } else if (this.dateCurrent == 3) {
          this.searchTime = [
            this.moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss'),
            this.moment().format('YYYY-MM-DD HH:mm:ss')
          ]
        } else if (this.dateCurrent == 4) {
          this.searchTime = [
            this.moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss'),
            this.moment().format('YYYY-MM-DD HH:mm:ss')
          ]
        }

        this.queryParams.starttime = this.searchTime[0]
        this.queryParams.endtime = this.searchTime[1]
        this.getData()
      },
      portData() {
        if (!this.queryParams.sceneId) {
          this.$message.error('请选择断面')
          return
        }
        // console.log(this.queryParams)
        this.$export('/web/monitorScene/exportMonitorDataOsmotic', this.queryParams)
      },
      drawChart(data) {
        if (!this.myChart) {
          this.myChart = this.$echarts.init(this.$refs.transChart)
          window.addEventListener('resize', () => {
            this.myChart.resize()
          })
        }

        var option = {
          color: '#075EFF',
          grid: {
            right: 10,
            left: 80
          },
          tooltip: {
            trigger: 'axis'
          },
          dataZoom: [{
            type: 'slider'
            // height: 15,
            // bottom: 10,
          }, {
            type: 'inside'
          }],
          xAxis: {
            type: 'category',
            data: data.times
          },
          yAxis: {
            type: 'value',
            name: '水位高程(m)',
            axisLine: {
              show: true
            }
          },
          series: data.value.map(v => {
            return {
              name: v.pnName,
              type: 'bar',
              barWidth: 20,
              barGap: 0,
              emphasis: {
                focus: 'series'
              },
              data: v.value
            }
          })
        }
        this.myChart.setOption(option, true)
      }
    }
  }

</script>
<style scoped>
  .stateMsg {
    display: flex;
    justify-content: space-evenly;
    padding: 1rem 0;
    border-bottom: 1px solid #f2f2f2;
    font-size: 1.4rem;
  }

  .s_right {
    width: 48%;
  }

  .s_right>>>.ant-table-thead>tr>th {
    background-color: #188FFF;
    color: #fff;
    border-color: rgba(59, 173, 255, 0.12);
  }

  .s_right>>>.ant-table-tbody>tr>td {
    border-color: rgba(59, 173, 255, 0.12);
  }


  .echartTU {
    width: 50%;
    height: 380px;
    margin: 0 1rem;
  }

</style>
