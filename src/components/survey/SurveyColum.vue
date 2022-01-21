<!--suppress ALL -->
<template>
  <div style="display: flex;flex-direction: row;height: 100%;">
    <div style="width:300px;">
      <a-table ref = "TableInfo"
        :columns="columns"
        :rowKey="record => record.id"
        :data-source="data"
        :customRow="onClickRow"
        :rowClassName="setRowClassName"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <a slot="name" slot-scope="text">{{ text }}</a>
      </a-table>
    </div>
    <div style="flex: 1;margin-left: 10px;">
      <component :is="componentName" :data="chartsdata" :boundary="boundary" :name="name" :objname="objname" :refid="refid" class="main-content"></component>
    </div>
  </div>
</template>

<script>
import EchartsLine from '@/components/echarts/EchartsLine.vue'
import Echartsr3D from '@/components/echarts/Echartsr3D.vue'
import picShow from '@/components/picture/picShow.vue'
import moment from 'moment'
export default {
  name: 'SurveyColum',
  components: {
    Echartsr3D, // 三维折线图
    EchartsLine,
    picShow
  },
  data () {
    return {
      dateFormat: 'YYYY-MM-DD',
      selected_index: 0,
      chartsdata: [],
      objname: '',
      clickable: true,
      _type: '2D',
      devValueId: '',
      selectRowId: '',
      boundary: [],
      componentName: '',
      selectedDevTags: [], // 指标选中列表
      sourceData: [],
      devValueName: '',
      projPnParentId: '',
      devValueStrId: '',
      queryParams: {},
      chartParams: {},
      className: '',
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) => `${index + 1}`
        },
        {
          title: '时间',
          dataIndex: 'time',
          key: 'time'
        }
      ],
      paginationInfo: null,
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 10,
        size: 'small',
        showTotal: (total, range) => `共 ${total} 条`
      },
      loading: false
    }
  },
  props: {
    data: {
      require: true
    },
    model: {
      require: true
    },
    chartstype: {
      require: true
    },
    refid: {
      require: true
    },
    name: {
      require: true
    }
  },
  created () {

  },
  methods: {
    moment,
    onClickRow (record, index) {
      return {
        on: {
          click: () => {
            console.log('行事件', record, index)
            if (this.clickable) {
              this.selectRowId = record.id
              this.chartParams.model = this.model
              this.chartParams.id = record.id
              this.chartParams.pnId = record.pnId
              this.chartParams.pnStrId = record.pnStrId
              this.chartParams.projId = record.projId
              this.updateChart(this.chartParams)
            }
          }
        }
      }
    },
    setRowClassName (record) {
      const tableId = this.selectRowId
      return record.id === tableId ? 'tableactive' : ''
    },
    chartAndListInit (item, type) {

    },
    handleTableChange (pagination) {
      let _this = this
      // this.fetch({
      //   devBasicId: _this.HPDevBasic.devBasicId,
      //   projPnParentId: _this.HPPnDetail.projPnParentId,
      //   devValueStrId: _this.devValueStrId,
      //   pageSize: pagination.pageSize,
      //   pageNum: pagination.current,
      //   type: _this._type
      // })
    },
    fetch (params = {}) {
      this.loading = true
      if (typeof (params.pageSize) === 'undefined') {
        params.pageSize = this.pagination.defaultPageSize
        params.pageNum = this.pagination.defaultCurrent
      }
      params.devValueId = this.devValueId
      params.startDate = this.startDate
      params.endDate = this.endDate
      this.$get('warnWeb/homePage/devValueDataList', {...params}).then((r) => {
        let data = r.data.data
        // if (data.result.length === 0) {
        //   return
        // }
        const pagination = { ...this.pagination }
        pagination.total = data.count
        this.sourceData = data.result
        this.pagination = pagination
        // 数据加载完毕，关闭loading
        this.loading = false
        this.chartParams.devValueId = params.devValueId
        if (data.result.length === 0) {
          this.data = ''
        } else {
          this.chartParams.type = params.type
          let type = params.type
          this.chartParams.id = data.result[0].id
          console.log(type)
          if (type !== '2D') {
            this.selectRowId = data.result[0].id
            this.updateChart2(this.chartParams)
          }
        }

      })
    },
    updateChart (params = {}) {
      this.loading = true
      // let url = '/api/data/query/' + params.projPnParentId + '/' + params.devBasicId + '/' + params.devValueStrId + '/' + params.id
      let url = 'warnWeb/devopsindex/getDetailsById'
      this.$get(url, {
        ...params
      }).then((r) => {
        if (JSON.stringify(r.data) !== '{}' && r.data.code !== -1) {
          if (this.chartstype === '3D') {
            this.componentName = 'Echartsr3D'
            let arr = r.data.data
            let data = []
            arr.forEach((item, index, array) => {
              data.push([item.x, item.y, item.z])
            })
            this.chartsdata = data
            console.log(data)
          } else if (this.chartstype === 'base64') {
            this.componentName = 'picShow'
            let url = r.data.data[0]
            this.chartsdata = 'data:image/png;base64,' + url
          }
          // if (params.type === 'pic') {
          //   let url = r.data.data.b64data
          //   this.data = 'data:image/png;base64,' + url
          // } else if (params.type === 'arr') {
          //   let data = r.data.data.wxStringList
          //   this.data = data
          //   let name = this.getStringName(params.devValueStrId).name
          //   let objname = this.getStringName(params.devValueStrId).objname
          //   this.name = name
          //   this.objname = objname
          //   console.log(data)
          //   console.log(name)
          //   console.log(objname)
          // } else {
          //   let arr = r.data.data.shiftList
          //   let data = []
          //   arr.forEach((item, index, array) => {
          //     data.push([item.x, item.y, item.z])
          //   })
          //   this.data = data
          //   console.log(data)
          // }
          // 数据加载完毕，关闭loading
          this.loading = false
        }
      })
    },
    getStringName (str) {
      let arr = str.split('_')
      let type = arr[1]
      let name = []
      let objname = []
      switch (type) {
        case '1': name = ['倾角', '倾向', '振动', '温度', '位移X', '位移Y', '位移Z', '最大速度']
          objname = ['inclination', 'tendency', 'vibration', 'temperature', 'x', 'y', 'z', 'resVelocity']
          break
        case '2': name = ['倾角']
          objname = ['inclination']
          break
        case '3': name = ['倾向']
          objname = ['tendency']
          break
        case '4': name = ['振动']
          objname = ['vibration']
          break
        case '5': name = ['温度']
          objname = ['temperature']
          break
        case '6': name = ['位移X', '位移Y', '位移Z']
          objname = ['x', 'y', 'z']
          break
        case '43': name = ['位移X', '位移Y', '位移Z', '最大速度']
          objname = ['x', 'y', 'z', 'resVelocity']
          break
      }
      return {name: name, objname: objname}
    }
  },
  mounted () {
    let record = this.data[0]
    this.selectRowId = record.id
    this.chartParams.model = this.model
    this.chartParams.id = record.id
    this.chartParams.pnId = record.pnId
    this.chartParams.pnStrId = record.pnStrId
    this.chartParams.projId = record.projId
    this.updateChart(this.chartParams)
    console.log('mounted')
  },
  watch: {
    model (val) { //
      console.log('变化')
      let record = this.data[0]
      this.selectRowId = record.id
      this.chartParams.model = this.model
      this.chartParams.id = record.id
      this.chartParams.pnId = record.pnId
      this.chartParams.pnStrId = record.pnStrId
      this.chartParams.projId = record.projId
      this.updateChart(this.chartParams)
    }
  }
}
/**
 *对Date的扩展，将 Date 转化为指定格式的String
 *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *例子：
 *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  return fmt
}
</script>

<style>
.tableactive{
  background-color: rgba(197,243,255,.5)!important;
}
.HPDevValueName div{
  margin:5px;
}

</style>
