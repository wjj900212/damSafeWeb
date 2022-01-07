<!--suppress ALL -->
<template>
  <div>
    <div class="HPDevValueName">
      <div style="width:100%;display: flex;flex-direction: row;">
        <a-range-picker style="margin-right:10px;" :defaultValue="[moment(startDate, dateFormat), moment(endDate, dateFormat)]" @change="changeDate"></a-range-picker>
        <div class="scada" @click="showVideo">实时监控</div>
      </div>
      <template v-for="(tag, index) in HPDevValueNameList">
        <a-checkable-tag color="#585f69" :closable="false" :key="index"
          :checked="selectedDevTags.indexOf(tag) > -1"
          @change="() => onDevValueSelect(tag, index)">
          {{tag.devValueName}}
        </a-checkable-tag>
      </template>
    </div>
    <div>
      <div style="height:300px;width:100%;margin: 10px 0px 5px 10px;">
        <component :is="videoComponent" :videoType="videoType"  :videoSrc="videoSrc"></component>
      </div>
    </div>
    <div style="width:100%;margin: 10px 0px 5px 10px;">
      <a-table ref = "TableInfo"
        :columns="columns"
        :rowKey="record => record.id"
        :data-source="sourceData"
        :customRow="onClickRow"
        :rowClassName="setRowClassName"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <a slot="name" slot-scope="text">{{ text }}</a>
        <span slot="trend" slot-scope="text, record">
          <span v-if="text.indexOf('上升') === 0" style="color:red;">{{text}}</span>
          <span v-else-if="text.indexOf('下降') === 0" style="color:#2DDA9F;">{{text}}</span>
          <span v-else>{{text}}</span>
        </span>
      </a-table>
    </div>
    <!--<div>
      <div @click="showVideo" class="scada">实时监控</div>
    </div>-->
  </div>
</template>

<script>
import RangeDate from '@/components/datetime/RangeDate'
import H5VideoPlay from '@/components/video/h5video.vue'
import moment from 'moment'
export default {
  name: 'VideoDetail',
  components: {
    RangeDate,
    H5VideoPlay
  },
  data () {
    return {
      videoComponent: 'H5VideoPlay',
      videoSrc: '',
      videoType: 'video/mp4',
      dateFormat: 'YYYY-MM-DD',
      startDate: new Date((new Date()).getFullYear(), (new Date()).getMonth()-1, (new Date()).getDate()).format('yyyy-MM-dd'),
      endDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()).format('yyyy-MM-dd'),
      name: '',
      selected_index: 0,
      objname: '',
      clickable: false,
      devValueId: '',
      data: [],
      selectRowId: '',
      boundary: [],
      componentName: 'Echarts2D',
      selectedDevTags: [], // 指标选中列表
      sourceData: [],
      devValueName: '',
      projPnParentId: '',
      devValueStrId: '',
      queryParams: {},
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) => `${index + 1}`
        },
        {
          title: '时间',
          dataIndex: 'warnTime',
          key: 'warnTime'
        },
        {
          title: '值',
          dataIndex: 'warnValue',
          key: 'warnValue'
        }
      ],
      paginationInfo: null,
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 10,
        size:'small',
        showTotal: (total, range) => `共 ${total} 条`
      },
      loading: false
    }
  },
  props: {
    HPDevValueNameList: {
      require: true
    },
    HPPnDetail: {
      require: true
    },
    HPDevBasic: {
      require: true
    },
    isfirst: {
      require: true
    }
  },
  created () {
    // console.log(this.HPDevValueNameList)
    // this.onDevValueSelect(this.HPDevValueNameList[0], 0)

  },
  methods: {
    moment,
    changeDate (dates, dateStrings) {
      this.startDate = dateStrings[0]
      this.endDate = dateStrings[1]
      console.log(this.startDate)
      console.log(this.endDate)
      let paramObj = {
        projPnId: this.HPDevBasic.devBasicPn,
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.current,
      }
      this.searchSourceDataList(paramObj)

    },
    showVideo () {
      this.$emit('showVideo')
    },
    onClickRow (record, index) {
      return {
        on: {
          click: () => {
            console.log('行事件', record, index)
            if (this.clickable) {
              this.selectRowId = record.id
              this.videoSrc = record.videoReplayPath
            }
          }
        }
      }
    },
    exportExcel () {
      let params = {}
      params.devValueId = this.HPDevValueNameList[this.selected_index].devValueId
      params.startDate = this.startDate
      params.endDate = this.endDate
      console.log('导出参数',params)
      this.$export('warnWeb/homePage/devValueDataListToExcel', {
        ...params
      }).then((r) => {
      })
    },
    setRowClassName (record) {
      const tableId = this.selectRowId
      return record.id === tableId ? 'videoActive' : ''
    },
    handleTableChange (pagination) {
      let _this = this
      this.fetch({
        // projPnId: _this.HPDevBasic.devBasicId,
        projPnId: _this.HPDevBasic.devBasicPn,
        pageSize: pagination.pageSize,
        pageNum: pagination.current,
      })
    },
    searchSourceDataList (queryParams = {}) {
      if (queryParams) {
        this.queryParams = queryParams
      }
      this.fetch({
        ...this.queryParams
      })
    },
    fetch (params = {}) {
      this.loading = true
      if (typeof (params.pageSize) === 'undefined') {
        params.pageSize = this.pagination.defaultPageSize
        params.pageNum = this.pagination.defaultCurrent
      }
      // params.projPnId = this.projPnId
      params.startDate = this.startDate
      params.endDate = this.endDate
      this.$get('warnWeb/homePage/getVideoReplay', {...params}).then((r) => {
        let data = r.data.data
        if(data.length !== 0){
          const pagination = { ...this.pagination }
          pagination.total = data.total
          this.sourceData = data.records
          this.pagination = pagination
          this.clickable = true
        }
        // 数据加载完毕，关闭loading
        this.loading = false
        // this.videoSrc = 'http://preview.hazardscience.com.cn/videoReplay/4123/1617162341874.mp4'
        // this.selectRowId = data.records[0].id
        // this.videoSrc = data.records[0].videoReplayPath
      })
    },
    // 获取前一个月的日期
    // 入参格式：YYYY-MM-DD
    getPreMonthDay(date) {
      var arr = date.split('-')
      var year = arr[0]    // 当前年
      var month = arr[1]      // 当前月
      var day = arr[2]       // 当前日
      // 验证日期格式为YYYY-MM-DD
      var reg = date.match(/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/)
      if ((!reg) || (month > 12) || (day > 31)) {
        console.log('日期或格式有误！请输入正确的日期格式（年-月-日）')
        return
      }
      var pre_year = year     //前一个月的年
      var pre_month = parseInt(month) - 1      //前一个月的月，以下几行是上月数值特殊处理
      if (pre_month === 0) {
        pre_year = parseInt(pre_year) - 1
        pre_month = 12
      }
      var pre_day = parseInt(day)       //前一个月的日，以下几行是特殊处理前一个月总天数
      var pre_month_alldays = new Date(pre_year, pre_month, 0).getDate()    //巧妙处理，返回某个月的总天数
      if (pre_day > pre_month_alldays) {
        pre_day = pre_month_alldays
      }
      if (pre_month < 10) {   //补0
        pre_month = '0' + pre_month
      }
      else if (pre_day < 10) {   //补0
        pre_day = '0' + pre_day
      }
      var pre_month_day = pre_year + '-' + pre_month + '-' + pre_day
      return pre_month_day
    }
  },
  mounted () {
    console.log('jinaaaaaaaaa')
    let paramObj = {
      projPnId: this.HPDevBasic.devBasicPn,
      pageSize: this.pagination.pageSize,
      pageNum: this.pagination.current,
    }
    this.searchSourceDataList(paramObj)
  },
  watch: {

  }
}
</script>

<style lang="less" scoped>
.videoActive{
  background-color: rgba(197,243,255,.5);
}
.HPDevValueName div{
  margin:5px;
}
.exportExcel{
  position: absolute;
  bottom: 15px;
  left: 10px;
  cursor: pointer;
}
.scada {
  background:url("../../../static/images/矩形2拷贝78@2x.png") no-repeat;
  font-family: PingFang SC;
  color:#59b7ff;
  width: 76px;
  height: 21px;
  line-height: 21px;
  text-align: center;
  margin-left:10px;
  cursor: pointer;
  /*margin-top: 20px;
  text-align: center;
  height: 100px;
  line-height: 100px;
  font-size: 18px;
  border: 1px solid;
  color: aqua;
  margin-left: 12px;
  cursor: pointer;*/
}
.scada:hover {
  color:#e8c648 !important;
  background-image: url("../../../static/images/矩形2拷贝74@2x.png") !important;
 /* background: rgb(7, 241, 222);
  color: black;*/
}
.ant-modal-wrap{
  z-index:10000 !important;
}
</style>
