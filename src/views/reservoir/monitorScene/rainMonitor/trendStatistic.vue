<template>
  <!-- 降水量趋势统计 -->
  <div class="trendStatistic">
    <a-card title="降水量趋势统计">
      <template slot="extra">
        <a-select v-model="queryParams.pnId" :style="{width:'20rem'}">
          <a-select-option v-for="pn in overViewData.pnList" :key="pn.pnId.toString()">{{pn.pnName}}</a-select-option>
        </a-select>
        <a-range-picker @change="onChange" style="width:250px;"/>
        <a-select v-model="current">
          <a-select-option value="0">日数据</a-select-option>
          <a-select-option value="1">月数据</a-select-option>
          <a-select-option value="2">年数据</a-select-option>
        </a-select>
        <a-button type="primary">数据导出</a-button>
      </template>
      <a-card-grid style="width: 100%; text-align: center; padding: 5px">

      </a-card-grid>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: ['hiddenId', 'pnList'],
  data () {
    return {
      queryParams: {},
      current: '',
      overViewData: {}
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
          this.warnValue = []
          this.columns = [{
            title: '库水位',
            dataIndex: 'value',
            key: 'value'
          },
          {
            title: '时间',
            dataIndex: 'time',
            key: 'time'
          }
          ]
          setTimeout(() => {
            this.drawChart()
          }, 300)
          return
        }
        if (n.length > 0) {
          this.queryParams.pnId = n[0].pnId
          this.pnName = n[0].pnName
          this.getWarnValue()
        }
      },
      immediate: true
    }
  },
  methods: {
    moment,
    getMonitorConditionRain () {
      let _this = this
      this.$get('web/monitorScene/monitorConditionRain', {
        hiddenId: _this.hiddenId
      }).then((res) => {
        if (res.data.code === 1) {
          _this.current = res.data.data.pnList[0].pnName
          _this.overViewData = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    onChange (date, dateString) {
      console.log(date, dateString)
    }
  }
}

</script>
<style lang="less" scoped>

</style>
