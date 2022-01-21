<template>
  <div style="width:100%;">
    <div class="titleIcon" style="padding-left:0.5rem;">
      <img class="s-img" src="static/imgs/形状1254.png"/>
      <span class="s-title">模型指数数据</span>
    </div>
    <div class="HPDevValueName">
      <div style="margin:1rem 0px 0px 1rem;">
        <span style="font-family: 'Microsoft YaHei UI';font-size: 1.4rem;font-weight: 400;color:#99C8CC;">时间</span>
        <a-range-picker
          :defaultValue="[moment(startDate, dateFormat), moment(endDate, dateFormat)]"
          @change="changeDate"></a-range-picker>
      </div>
    </div>
      <div id="EChartPicData" v-if="EChartsData.length !==0" style="width:90rem;height:25rem;"></div>
      <div v-else style="margin:4rem 0;text-align: center;">
        <img src="static/imgs/暂无数据.png"/>
        <span class="no-data">暂无数据</span>
      </div>
    <div id="TableData" style="width:100%;margin-top:10px;height: calc(100vh - 605px);">
      <a-table ref = "TableInfo"
               :columns="columns"
               :data-source="modelSourceData"
               :pagination="false"
               :scroll="{y:220}"
      >
        <div slot="value"  slot-scope="text,record">
          <span v-if="record.warnLevel === 0" style="color:#2dda9f;">{{record.value}}</span>
          <span v-else-if="record.warnLevel === 1" style="color:#0099ff;">{{record.value}}</span>
          <span v-else-if="record.warnLevel === 2" style="color:#dddd00;">{{record.value}}</span>
          <span v-else-if="record.warnLevel === 3" style="color:#ffc54f;">{{record.value}}</span>
          <span v-else-if="record.warnLevel === 4" style="color:#fc425e;">{{record.value}}</span>
        </div>
      </a-table>
      <div style="margin-bottom:10px;">
        <a-pagination size="small" :current="pagination.defaultCurrent" :page-size.sync="pagination.defaultPageSize" :total="total" @change="changePageNumber"/>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import ECharts from '@/components/echarts/EchartsPic'
import RangeDate from '@/components/datetime/RangeDate'
export default {
  name: 'safety-index',
  data () {
    return {
      dateFormat: 'YYYY-MM-DD',
      startDate: new Date((new Date()).getFullYear(), (new Date()).getMonth() - 1, (new Date()).getDate()).format('yyyy-MM-dd'),
      endDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()).format('yyyy-MM-dd'),
      columns: [
        { title: '时间', dataIndex: 'warnTime', key: 'warnTime', width: '25%' },
        { title: '隐患点', dataIndex: 'hiddenName', key: 'hiddenName' },
        { title: '监测点', dataIndex: 'pnName', key: 'pnName' },
        { title: '计算结果', dataIndex: 'value', key: 'value', scopedSlots: { customRender: 'value' } }
      ],
      modelSourceData: [],
      total: 0,
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 10
      },
      sourceData: [],
      loading: false,
      color: ['#2dda9f', '#0099ff', '#dddd00', '#ffc54f', '#fc425e'],
      EChartsData: [], // 趋势图数据
      modelXAxisValue: [],
      modelYAxisValue: [],
      modelValueList: []
    }
  },
  components: {
    RangeDate,
    ECharts
  },
  props: {
    pnId: {
      required: true
    },
    CalculateValue: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    sourceData (newVal) {
      this.modelSourceData = newVal
    },
    CalculateValue (newVal) {
      this.CalculateValue = newVal
    },
    EChartsData (newVal) {
      let _this = this
      setTimeout(function () {
        _this.chartPicInit()
      }, 100)
    },
    modelXAxisValue (newVal) {
      this.modelXAxisValue = newVal
    },
    modelYAxisValue (newVal) {
      this.modelYAxisValue = newVal
    }
  },
  methods: {
    moment,
    changeDate (dates, dateStrings) {
      this.startDate = dateStrings[0]
      this.endDate = dateStrings[1]
      this.getPnModelChart(this.startDate, this.endDate)
      this.getWarnByPnId(undefined, this.startDate, this.endDate)
    },
    chartPicInit () {
      let _this = this
      let myChart = _this.$echarts.init(document.getElementById('EChartPicData'))
      let obj = this.$MSGInfo.parseThreshold(_this.CalculateValue, _this.color)
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let timeValue = params[0].name
            let str = ''
            if (params[0].value >= 0 && params[0].value < 1) {
              str += '绿色'
            } else if (params[0].value >= 1 && params[0].value < 2) {
              str += '蓝色'
            } else if (params[0].value >= 2 && params[0].value < 3) {
              str += '黄色'
            } else if (params[0].value >= 3 && params[0].value < 4) {
              str += '橙色'
            } else if (params[0].value >= 4) {
              str += '红色'
            }
            timeValue = timeValue + ' : ' + str
            return timeValue
          }
        },
        legend: {
          data: ['红色警报', '橙色警戒', '黄色警示', '蓝色注意', '无告警']
        },
        grid: {
          left: '4%',
          right: '5%',
          top: '10%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            show: true,
            color: '#c5f3ff'
          },
          data: _this.modelXAxisValue
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: false,
            color: '#e9e9e9'
          },
          splitLine: {
            lineStyle: {
              color: ['rgba(162,233,225,0.3)']
            }
          }
        },
        visualMap: {
          show: false, // 隐藏图例
          top: 0,
          right: 0,
          textStyle: {
            fontSize: 10, // 字体大小
            color: '#ffffff'// 字体颜色
          },
          precision: 1,
          pieces: obj.p,
          outOfRange: {
            color: '#2dda9f'
          }
        },
        series: [
          {
            type: 'line',
            step: 'end',
            data: _this.modelYAxisValue
          }
        ]
      }, true)
    },
    // 模型指数趋势图
    getPnModelChart (startDate, endDate) {
      let _this = this
      _this.safetyYAxisVlue = []
      let params = {}
      if (startDate === undefined && endDate === undefined) {
        params.startDate = _this.startDate
        params.endDate = _this.endDate
      } else {
        params.startDate = startDate
        params.endDate = endDate
      }
      params.pnId = _this.pnId
      this.$get('warnWeb/calculate/calculateChart', {
        ...params
      }).then((r) => {
        if (r.data.data.length !== 0 || r.data.data !== null) {
          let dataList = r.data.data
          _this.EChartsData = dataList
          if (dataList.length === 0) {
            _this.modelXAxisValue = []
            _this.modelYAxisValue = []
            return
          }
          let xAxisValue = []
          let modelValue = []
          for (let i = 0; i < dataList.length; i++) {
            xAxisValue.push(dataList[i].warnTime)
            modelValue.push(dataList[i].value)
          }
          _this.modelXAxisValue = xAxisValue
          _this.modelYAxisValue = modelValue
        }
      })
    },
    // 模型指数 - 列表
    getWarnByPnId (pagination, startDate, endDate) {
      let _this = this
      let params = {}
      if (startDate === undefined && endDate === undefined) {
        params.startDate = _this.startDate
        params.endDate = _this.endDate
      } else {
        params.startDate = startDate
        params.endDate = endDate
      }
      params.pnId = _this.pnId
      console.log(pagination)
      console.log('****进来了****')
      if (pagination === undefined) {
        params.pageNum = _this.pagination.defaultCurrent
        params.pageSize = _this.pagination.defaultPageSize
      } else {
        params.pageNum = pagination.defaultCurrent
        params.pageSize = pagination.defaultPageSize
      }
      this.$get('warnWeb/calculate/listCalculateResultHistory', {
        ...params
      }).then((r) => {
        let dataList = r.data.data
        if (dataList.records.length !== 0) {
          _this.sourceData = dataList.records
          _this.total = dataList.total
        } else {
          _this.sourceData = []
          _this.total = 0
          _this.pagination.defaultCurrent = 1
        }
      })
    },
    changePageNumber (current) {
      let _this = this
      _this.pagination.defaultCurrent = current
      _this.getWarnByPnId(_this.pagination)
    }
  }
}
</script>

<style lang="less" scoped>
.HPDevValueName{
  display: flex;
  justify-content: space-between;
  .tabBtn{
    cursor: pointer;
  }
}
.surveyList{
  color:#ffffff;
}
  .surveyList ul{
    list-style: none;
    border-bottom:1px solid #e9e9e9;
    height: 40px;
    line-height: 40px;
    li{
      display: inline;
      height: 40px;
      padding:10px;
    }
  }
.auto-scroll-y{
  height: 100%;
  overflow-y: scroll;
}
@media screen and (max-width:1536px){
  #EChartPicData{
    height: 230px !important;
  }
  .auto-scroll-y{
    height: calc(30vh) !important;
    overflow-y: scroll;
  }
}
</style>
