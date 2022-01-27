<template>
  <!-- 降水量趋势统计 -->
  <div class="trendStatistic">
    <a-card :bodyStyle="{ padding: '10px' }">
      <div class="safetyPlan">
        <div class="card">
          <img src="static/img/control/数据统计.png"/>
          <span>降水量趋势统计</span>
        </div>
        <div>
          <a-range-picker @change="onChange" style="width:250px;"/>
          <a-select v-model="queryParams.pnId" :style="{width:'20rem'}" @change="getRainPn">
            <a-select-option v-for="pn in pnList" :key="pn.pnId.toString()">{{pn.pnName}}</a-select-option>
          </a-select>
          <a-select v-model="queryParams.dateType" @change="dateChange">
            <a-select-option value="1">日数据</a-select-option>
            <a-select-option value="2">月数据</a-select-option>
            <a-select-option value="3">年数据</a-select-option>
          </a-select>
          <a-button type="primary">数据导出</a-button>
        </div>
      </div>
      <div style="width: 100%; text-align: center; padding: 5px">
        <div class="warn-info LR">
          <div><span>当前:</span><span class="warn-value">{{pnName}}  {{devCode}}</span></div>
        </div>
        <div style="display: flex;justify-content: flex-start;margin-top:1rem;">
          <div v-for="(v,i) in rainValue" :key="i" style="margin-right:1rem;">
            <div class="wvBox" :class="selectId === v.value?'act':''" @click="toggleMarkLine(v)">{{v.label}}</div>
          </div>
        </div>
        <div class="trendCon">
          <div class="echartTU">
            <component
              :is="'EchartsBarLine'"
              refid="BarRainLine"
              :cordon="cordon"
              :rainfall="rainfall"
              :totalRainfall="totalRainfall"
              class="main-content"
            ></component>
          </div>
          <div style="width:40%">
            <a-table :columns="columns" :data-source="tableData" :pagination="pagination">
            </a-table>
          </div>
        </div>
        <!--<div class="trendCon">
          <div>
            <div>当前 {{pnName}}</div>
            <div style="margin: 1rem 0;">
              <span class="cricle"></span>
              <span>{{devCode}}</span>
            </div>
            <a-col v-for="(v,i) in rainValue" :key="i" style="margin-bottom:1rem;">
              <div class="wvBox" :class="selectId === v.value?'act':''" @click="toggleMarkLine(v)">{{v.label}}</div>
            </a-col>
          </div>
          <div class="echartTU">
            <component
              :is="'EchartsBarLine'"
              refid="BarRainLine"
              :cordon="cordon"
              :rainfall="rainfall"
              :totalRainfall="totalRainfall"
              class="main-content"
            ></component>
          </div>
          <div style="width:40%">
            <a-table :columns="columns" :data-source="tableData" :pagination="pagination">
            </a-table>
          </div>
        </div>-->
      </div>
    </a-card>
  </div>
</template>

<script>
import EchartsBarLine from '@/components/echarts/EchartsBarLine.vue'
import moment from 'moment'
var option
export default {
  props: ['hiddenId', 'pnList'],
  components: {EchartsBarLine},
  data () {
    return {
      queryParams: {
        pnId: '',
        type: '1',
        dateType: '1',
        starttime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        endtime: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      current: '1',
      overViewData: {},
      columns: [],
      pnName: '',
      devCode: '',
      selectId: '1',
      rainValue: [
        {label: '一小时雨量', value: '1'},
        {label: '三小时雨量', value: '3'},
        {label: '六小时雨量', value: '6'},
        {label: '十二小时雨量', value: '12'}
      ],
      tableData: [],
      pagination: {
        current: 1,
        pageSize: 5,
        total: 0,
        onChange: (cur, size) => {
          this.pagination.current = cur
          // this.getData()
        }
      },
      cordon: [],
      rainfall: [],
      totalRainfall: []
    }
  },
  watch: {
    pnList: {
      handler: function (n, o) {
        if (!n || n.length === 0) {
          this.queryParams.pnId = ''
          this.pnName = ''
          this.tableData = []
          this.devCode = ''
          return
        }
        if (n.length > 0) {
          this.queryParams.pnId = n[0].pnId.toString()
          this.pnName = n[0].pnName
          this.devCode = n[0].devBasicStrId
          this.getMonitorConditionRain()
        }
      },
      immediate: true
    }
  },
  methods: {
    moment,
    getMonitorConditionRain () {
      let _this = this
      this.$get('web/monitorScene/monitorDataListRain', {
        ...this.queryParams
      }).then((res) => {
        if (res.data.code === 1) {
          let data = res.data.data
          _this.overViewData = data
          _this.cordon = data.warnValues
          _this.rainfall = data.rainfall
          _this.totalRainfall = data.totalRain
          _this.tableData = res.data.data.dataList
          if (res.data.data.warnValues.length !== 0) {
            let col = []
            let columns = [{
              title: '降水量',
              dataIndex: 'rainfall',
              key: 'rainfall'
            },
            {
              title: '累计降水量',
              dataIndex: 'totalRain',
              key: 'totalRain'
            },
            {
              title: '时间',
              dataIndex: 'time',
              key: 'time'
            }
            ]
            res.data.data.warnValues.forEach((v, i) => {
              col.push({
                title: v[1],
                customRender: () => {
                  return v[0]
                }
              })
            })
            col.unshift(1, 0)
            Array.prototype.splice.apply(columns, col)
            this.columns = columns
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 切换显示 markLine
    toggleMarkLine (v) {
      this.queryParams.type = v.value
      this.selectId = v.value
      this.getMonitorConditionRain()
    },
    onChange (date, dateString) {
      this.queryParams.starttime = dateString[0] ? dateString[0] + ' 00:00:00' : ''
      this.queryParams.endtime = dateString[1] ? dateString[1] + ' 59:59:59' : ''
      this.getMonitorConditionRain()
    },
    getRainPn () {
      this.pnName = this.pnList.find(v => {
        return v.pnId === this.queryParams.pnId
      }).pnName
      this.devCode = this.pnList.find(v => {
        return v.pnId === this.queryParams.pnId
      }).devBasicStrId
      this.getMonitorConditionRain()
    },
    // 快捷选择时间
    dateChange () {
      this.getMonitorConditionRain()
    },
    portData () {
      if (!this.queryParams.pnId) {
        this.$message.error('请选择监测点')
        return
      }
      this.queryParams.type = 15
      this.$export('web/monitorScene/exportMonitorPnDataRain', this.queryParams)
    }
  }
}

</script>
<style lang="less" scoped>
  .trendCon {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
  }
  .echartTU {
    width: 50%;
    height: 380px;
    margin: 0 1rem;
  }

  .wvBox {
    border: 1px solid #1890FF;
    line-height: 3rem;
    text-align: center;
    border-radius: 4px;
    color:#1890FF;
    padding:0.5rem 1rem;
  }

  .wvBox.act {
    background-color: #1890FF;
    color: #fff;
    cursor: pointer;
  }
  .cricle {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color:#1a94ff;
  }
  .trendCon /deep/ .ant-table-thead > tr > th{
    background-color: #188FFF;
    color: #fff;
  }
</style>
