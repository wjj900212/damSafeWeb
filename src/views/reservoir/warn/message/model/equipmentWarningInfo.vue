<template>
  <a-modal
    :footer="null"
    :visible="visible"
    :width="1000"
    :mask="true"
    :zIndex="2"
    @cancel="cancelModal"
  >
    <div style="display: flex;flex-direction: row;margin-top:0.5rem;">
      <div style="display: flex;justify-content: center;align-items: center;">
        <img src="static/imgs/多边形1.png"/>
        <span class="modelTitle">预警详情</span>
      </div>
    </div>
    <!--预警详情-->
    <div style="height: 67rem;overflow-y: auto;">
      <div style="display: flex;flex-direction: row;justify-content: space-between;align-content: space-between;margin-top:2rem;">
        <div class="titleIcon">
          <img class="s-img" src="static/imgs/圆角矩形1220.png"/>
          <span class="s-title">基本信息</span>
        </div>
      </div>
      <!--设备预警基本信息-->
      <div style="margin-top:1rem;" v-if="cur==='1'">
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            预警类型
          </a-col>
          <a-col :span="3" :order="2" class="info-content">
            设备预警
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            警示等级
          </a-col>
          <a-col :span="3" :order="4" class="info-content">
            <span v-if="warnDetailData.warnLevel==='4'" style="color:#FF3C1C;font-size:1.4rem;font-family: 'Microsoft YaHei UI';font-weight: 400;">红色预警</span>
            <span v-if="warnDetailData.warnLevel==='3'" style="color:#FF6C00;font-size:1.4rem;font-family: 'Microsoft YaHei UI';font-weight: 400;">橙色预警</span>
            <span v-if="warnDetailData.warnLevel==='2'" style="color:#FFD800;font-size:1.4rem;font-family: 'Microsoft YaHei UI';font-weight: 400;">黄色预警</span>
            <span v-if="warnDetailData.warnLevel==='1'" style="color:#12A8F6;font-size:1.4rem;font-family: 'Microsoft YaHei UI';font-weight: 400;">蓝色预警</span>
          </a-col>
          <a-col :span="3" :order="5" class="info-label">
            预警阈值
          </a-col>
          <a-col :span="3" :order="6" class="info-content">
            {{warnDetailData.warnValue}}
          </a-col>
          <a-col :span="3" :order="7" class="info-label">
            预警时间
          </a-col>
          <a-col :span="3" :order="8" class="info-content">
            <span :title="warnDetailData.warnTime">{{warnDetailData.warnTime | ellipsis(10)}}</span>
          </a-col>
        </a-row>
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            警示信息
          </a-col>
          <a-col :span="21" :order="2" class="info-content">
            <span :title="warnDetailData.warnInfo">{{warnDetailData.warnInfo | ellipsis(30)}}</span>
          </a-col>
        </a-row>
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            水库名称
          </a-col>
          <a-col :span="3" :order="2" class="info-content">
            <a class="aStyle" :title="warnDetailData.reservoirName">{{warnDetailData.reservoirName | ellipsis(7)}}</a>
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            所属隐患点
          </a-col>
          <a-col :span="3" :order="4" class="info-content">
            <a class="aStyle" :title="warnDetailData.hiddenName">{{warnDetailData.hiddenName | ellipsis(7)}}</a>
          </a-col>
          <a-col :span="3" :order="5" class="info-label">
            所属监测点
          </a-col>
          <a-col :span="3" :order="6" class="info-content">
            <a class="aStyle" :title="warnDetailData.projPnName">{{warnDetailData.projPnName | ellipsis(7)}}</a>
          </a-col>
          <a-col :span="3" :order="7" class="info-label">
            设备名称
          </a-col>
          <a-col :span="3" :order="8" class="info-content">
            {{warnDetailData.devCode}}
          </a-col>
        </a-row>
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            所属地区
          </a-col>
          <a-col :span="3" :order="2" class="info-content">
            <span :title="warnDetailData.cityName">{{warnDetailData.cityName | ellipsis(7)}}</span>
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            监测类型
          </a-col>
          <a-col :span="3" :order="4" class="info-content">
            {{warnDetailData.hiddenType}}
          </a-col>
        </a-row>
      </div>
      <!--安全预警基本信息-->
      <div style="margin-top:1rem;" v-if="cur==='2'">
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            类别
          </a-col>
          <a-col :span="6" :order="2" class="info-content">
            安全预警
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            警示等级
          </a-col>
          <a-col :span="3" :order="4" class="info-content">
            <span v-if="warnDetailData.warnLevel==='4'" style="color:#FF3C1C;font-size:1.4rem;font-family: 'Microsoft YaHei UI';font-weight: 400;">红色预警</span>
            <span v-else-if="warnDetailData.warnLevel==='3'" style="color:#FF6C00;font-size:1.4rem;font-family: 'Microsoft YaHei UI';font-weight: 400;">橙色预警</span>
            <span v-else-if="warnDetailData.warnLevel==='2'" style="color:#FFD800;font-size:1.4rem;font-family: 'Microsoft YaHei UI';font-weight: 400;">黄色预警</span>
            <span v-else-if="warnDetailData.warnLevel==='1'" style="color:#12A8F6;font-size:1.4rem;font-family: 'Microsoft YaHei UI';font-weight: 400;">蓝色预警</span>
            <span v-else style="color:#34B97D;font-size:1.4rem;font-family: 'Microsoft YaHei UI';font-weight: 400;">无预警</span>
          </a-col>
          <a-col :span="3" :order="5" class="info-label">
            预警来源
          </a-col>
          <a-col :span="6" :order="6" class="info-content">
            <span v-if="warnDetailData.fromWarnType === 0">设备预警</span>
            <span v-else-if="warnDetailData.fromWarnType === 1">模型预警</span>
            <span v-else-if="warnDetailData.fromWarnType === 2">安全预警</span>
          </a-col>
        </a-row>
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            预警参数
          </a-col>
          <a-col :span="6" :order="2" class="info-content">
            {{warnDetailData.fromWarnValue}}
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            预警时间
          </a-col>
          <a-col :span="3" :order="4" class="info-content">
            <span :title="warnDetailData.releaseTime">{{warnDetailData.releaseTime | ellipsis(10)}}</span>
          </a-col>
          <a-col :span="3" :order="5" class="info-label">
            项目经理
          </a-col>
          <a-col :span="6" :order="6" class="info-content">
            {{warnDetailData.pmNamePhone}}
          </a-col>
        </a-row>
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            所属区县
          </a-col>
          <a-col :span="6" :order="2" class="info-content">
            {{warnDetailData.cityName}}
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            所属监测点
          </a-col>
          <a-col :span="12" :order="4" class="info-content">
            <span :title="warnDetailData.projPnName">{{warnDetailData.projPnName | ellipsis(7)}}</span>
          </a-col>
        </a-row>
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            所属隐患点
          </a-col>
          <a-col :span="6" :order="2" class="info-content">
            <span :title="warnDetailData.hiddenName">{{warnDetailData.hiddenName | ellipsis(7)}}</span>
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            所属项目
          </a-col>
          <a-col :span="12" :order="4" class="info-content">
            <span>{{warnDetailData.projBasicName}}</span>
          </a-col>
        </a-row>
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            预警标题
          </a-col>
          <a-col :span="6" :order="2" class="info-content">
            <span :title="warnDetailData.warnTitle">{{warnDetailData.warnTitle | ellipsis(7)}}</span>
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            警示信息
          </a-col>
          <a-col :span="12" :order="4" class="info-content">
            <span :title="warnDetailData.warnMsg">{{warnDetailData.warnMsg | ellipsis(7)}}</span>
          </a-col>
        </a-row>
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            发布人
          </a-col>
          <a-col :span="6" :order="2" class="info-content">
            {{warnDetailData.releaseUser}}
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            处置人员
          </a-col>
          <a-col :span="12" :order="4" class="info-content">
            {{warnDetailData.ownerUser}}
          </a-col>
        </a-row>
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            处置记录
          </a-col>
          <a-col :span="21" :order="2" class="info-content">
            <span>{{warnDetailData.disposalRecord}}</span>
          </a-col>
        </a-row>
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            指导建议
          </a-col>
          <a-col :span="21" :order="2" class="info-content">
            {{warnDetailData.actions}}
          </a-col>
        </a-row>
      </div>
      <!--模型预警基本信息-->
      <div style="margin-top:1rem;" v-if="cur==='3'">
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            类别
          </a-col>
          <a-col :span="6" :order="2" class="info-content">
            模型预警
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            警示等级
          </a-col>
          <a-col :span="5" :order="4" class="info-content">
            <span v-if="warnDetailData.warnLevel===4" style="color:#FF3C1C;font-size:1.4rem;font-family: 'Microsoft YaHei UI';font-weight: 400;">红色预警</span>
            <span v-if="warnDetailData.warnLevel===3" style="color:#FF6C00;font-size:1.4rem;font-family: 'Microsoft YaHei UI';font-weight: 400;">橙色预警</span>
            <span v-if="warnDetailData.warnLevel===2" style="color:#FFD800;font-size:1.4rem;font-family: 'Microsoft YaHei UI';font-weight: 400;">黄色预警</span>
            <span v-if="warnDetailData.warnLevel===1" style="color:#12A8F6;font-size:1.4rem;font-family: 'Microsoft YaHei UI';font-weight: 400;">蓝色预警</span>
            <span v-if="warnDetailData.warnLevel===0" style="color:rgb(70, 255, 172);font-size:1.4rem;font-family: 'Microsoft YaHei UI';font-weight: 400;">正常</span>
          </a-col>
          <a-col :span="3" :order="5" class="info-label">
            计算结果
          </a-col>
          <a-col :span="4" :order="6" class="info-content">
            {{warnDetailData.value}}
          </a-col>

        </a-row>
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            预警时间
          </a-col>
          <a-col :span="6" :order="2" class="info-content">
            {{warnDetailData.warnTime}}
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            所属监测点
          </a-col>
          <a-col :span="5" :order="4" class="info-content">
            {{warnDetailData.pnName}}
          </a-col>
          <a-col :span="3" :order="5" class="info-label">
            所属区县
          </a-col>
          <a-col :span="4" :order="6" class="info-content">
            {{warnDetailData.cityName}}
          </a-col>
        </a-row>
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            所属隐患点
          </a-col>
          <a-col :span="6" :order="2" class="info-content">
            <span :title="warnDetailData.hiddenName">{{warnDetailData.hiddenName | ellipsis(7)}}</span>
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            所属项目
          </a-col>
          <a-col :span="12" :order="4" class="info-content">
            <span>{{warnDetailData.projBasicName}}</span>
          </a-col>
        </a-row>
      </div>
      <div v-if="cur !== 1">
        <div style="display: flex;flex-direction: row;justify-content: space-between;align-content: space-between;margin-top:2rem;">
          <div class="titleIcon">
            <img class="s-img" src="static/imgs/CHART拷贝3.png"/>
            <span class="s-title">监测数据详情</span>
          </div>
        </div>
        <div style="display: flex;flex-direction: row;margin-top:1rem;">
          <div style="margin-right:2rem;">
            <span>时间</span>
            <a-range-picker  :defaultValue="[moment(startDate, dateFormat), moment(endDate, dateFormat)]" @change="changeDate"></a-range-picker>
          </div>
          <div>
            <span>类型</span>
            <a-select
              v-model="devValueName"
              style="width:12rem"
            >
              <a-select-option v-for="item in warnDetailData.target" @click="handleDevValueNameChange(item)" :key="item.devValueId" :value="item.devValueName">
                {{ item.devValueName }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <component v-if="data.length !== 0" refid="main" :is="componentName" :yname="yname" :data="data" :boundary="boundary" :echart2DHeight="echart2DHeight" :pnDevId="chartsID(devValueId)" class="main-content" style="height: 350px;"></component>
        <div v-if="data.length === 0" style="margin:4rem 0;text-align: center;">
          <img src="static/imgs/暂无数据.png"/>
          <span class="no-data">暂无数据</span>
        </div>
        <div>
          <a-table ref = "TableInfo"
                   :columns="columns"
                   :rowKey="record => record.id"
                   :data-source="sourceData"
                   :pagination="pagination"
                   @change="handleTableChange"
                   :scroll="{y:220}"
          >
            <a slot="name" slot-scope="text">{{ text }}</a>
          </a-table>
        </div>
      </div>
      <!--甲方处置结果-->
      <div>
        <div  class="titleIcon" style="margin-bottom:2rem;">
          <img class="s-img" src="static/imgs/圆角矩形1220.png"/>
          <span class="s-title">甲方处置信息</span>
        </div>
          <a-row type="flex" class="info">
            <a-col :span="3" :order="1" class="info-label">
              处置状态
            </a-col>
            <a-col :span="3" :order="2" class="info-content">
              <span v-if="warnDetailData.handle === '0' || warnDetailData.handle === ''">未处置</span>
              <span v-else-if="warnDetailData.handle === '1'">已处置</span>
              <span v-else-if="warnDetailData.handle === '2'">不予处置</span>
            </a-col>
            <a-col :span="3" :order="3" class="info-label">
              处置人
            </a-col>
            <a-col :span="3" :order="4" class="info-content">
              {{warnDetailData.disposaler}}
            </a-col>
            <a-col :span="3" :order="5" class="info-label">
              处置时间
            </a-col>
            <a-col :span="9" :order="6" class="info-content">
              {{warnDetailData.disposalTime || ''}}
            </a-col>
          </a-row>
          <a-row type="flex" class="info">
            <a-col :span="3" :order="1" class="info-label">
              处置记录
            </a-col>
            <a-col :span="21" :order="2" class="info-content">
              {{warnDetailData.disposalRecord}}
            </a-col>
          </a-row>
      </div>
    </div>
  </a-modal>
</template>

<script>
import {mapState} from 'vuex'
import moment from 'moment'
import Echarts2D from '@/components/echarts/Echarts2D.vue'
import EchartsoLine from '@/components/echarts/EchartsoLine.vue'
import EchartsLine from '@/components/echarts/EchartsLine.vue'
import EchartsThinbar from '@/components/echarts/EchartsThinbar.vue'
import EchartsPolar from '@/components/echarts/EchartsPolar.vue'
import EchartsWave from '@/components/echarts/EchartsWave.vue'
import EchartsScatter from '@/components/echarts/EchartsScatter.vue'
export default {
  name: 'equipment-warning-info',
  data () {
    return {
      dateFormat: 'YYYY-MM-DD',
      startDate: new Date((new Date()).getFullYear(), (new Date()).getMonth() - 1, (new Date()).getDate()).format('yyyy-MM-dd'),
      endDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()).format('yyyy-MM-dd'),
      warnInfo: {},
      devValueId: '',
      warnTrend: '',
      isShowIfdisposal: '0',
      warnDetail: {}, // 发布安全预警获取的基本信息
      safetyWarn: {
        /*
         * 1 发布安全预警-预警等级中 有‘无预警’选项(设备预警)
         * 2 发布安全预警-预警等级中 无‘无预警’选项(模型预警)
         */
        type: '1'
      },
      devValueName: '',
      safetyIns: '',
      yname: '',
      data: [],
      boundary: [],
      componentName: 'Echarts2D',
      echart2DHeight: '35rem',
      CalculateValue: [],
      EChartsData: [],
      color: ['#2dda9f', '#0099ff', '#dddd00', '#ffc54f', '#fc425e'],
      sourceData: [],
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) => `${index + 1}`,
          width: '15%'
        },
        {
          title: '时间',
          dataIndex: 'time',
          key: 'time'
        },
        {
          title: '值',
          dataIndex: 'value',
          key: 'value',
          width: '15%'
        }
      ],
      modelSourceData: [],
      modelColumns: [
        { title: '时间', dataIndex: 'warnTime', key: 'warnTime', width: '25%' },
        { title: '隐患点', dataIndex: 'hiddenName', key: 'hiddenName' },
        { title: '监测点', dataIndex: 'pnName', key: 'pnName' },
        { title: '计算结果', dataIndex: 'value', key: 'value', scopedSlots: { customRender: 'value' } }
      ],
      total: 0,
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
  components: {
    Echarts2D,
    EchartsoLine,
    EchartsLine,
    EchartsThinbar,
    EchartsPolar,
    EchartsWave,
    EchartsScatter
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    warnDetailData: {
      type: Object,
      default: () => {}
    },
    cur: {
      type: String,
      default: '1'
    },
    warnId: {
      type: Number,
      default: 0
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        if (this.cur !== '1') {
          this.getCalculateThreshoid()
          if (this.warnDetailData.target.length !== 0) {
            let indexItem = {}
            this.warnInfo = this.warnDetailData.target[0]
            // this.devValueName = this.warnDetailData.devValueList[0].devValueName
            let valueId = ''
            if (this.warnDetailData.basicIndex !== undefined) {
              valueId = this.warnDetailData.basicIndex
              this.warnDetailData.target.find((item) => {
                if (item.devValueId === valueId) {
                  this.devValueName = item.devValueName
                  this.safetyIns = item.safetyIns
                }
              })
              indexItem = this.warnDetailData.target.find(item => item.devValueId === valueId)
            } else {
              valueId = this.warnDetailData.target[0].devValueId
              this.devValueName = this.warnDetailData.target[0].devValueName
              indexItem = this.warnDetailData.target[0]
            }
            this.boundary = this.warnDetailData.target[0].boundary
            this.handleDevValueNameChange(indexItem)
          }
        }
      }
    },
    warnDetailData (newVal) {
      console.log('预警详情数据', this.warnDetailData)
      if (this.warnDetailData.target.length !== 0) {
        this.devValueId = this.warnDetailData.target[0].devValueId
      }
    }
  },
  mounted () {
    if (this.warnDetailData.target !== undefined) {
      this.devValueId = this.warnDetailData.target[0].devValueId
    }
  },
  computed: {
    ...mapState({
      multipage: (state) => state.setting.multipage,
      cityCode: (state) => state.account.cityCode,
      cityType: (state) => state.account.cityType,
      userMsg: (state) => state.account.user
    })
  },
  methods: {
    moment,
    cancelModal () {
      this.data = []
      this.yname = ''
      this.devValueName = ''
      this.isShowIfdisposal = '0'
      this.$emit('onClose')
    },
    handleDevValueNameChange (item) {
      // console.log('预警item', item)
      switch (item.showType) {
        case '0' : this.componentName = item.alarmflag === '0' ? 'EchartsoLine' : 'EchartsLine'
          this.chartAndListInit(item, '2D')
          this.clickable = false
          break
        case '1' : this.componentName = 'EchartsThinbar'
          this.chartAndListInit(item, '2D')
          this.clickable = false
          break
        case '2' : this.componentName = 'EchartsPolar'
          this.chartAndListInit(item, '2D')
          this.clickable = false
          break
        case '3' : this.componentName = 'EchartsScatter'
          this.chartAndListInit(item, '2D')
          this.clickable = false
          break
        case '5' : this.componentName = 'EchartsWave'
          this.chartAndListInit(item, '2D')
          this.clickable = false
      }
      this.warnInfo = item
    },
    chartAndListInit (item, type) {
      this.devValueName = item.devValueName
      this.safetyIns = item.safetyIns
      if (type === '2D') {
        this.updateChart({
          pnId: this.warnDetailData.pnId,
          devValueId: item.devValueId,
          devValueName: item.devValueName,
          startDate: this.startDate,
          endDate: this.endDate
        })
      }
      this.fetch({
        devValueId: item.devValueId,
        devValueName: item.devValueName,
        startDate: this.startDate,
        endDate: this.endDate
      })
      this.reset()
    },
    chartsID (index) {
      return 'charts_' + index
    },
    updateChart (params = {}) {
      this.loading = true
      let url = 'web/earlyWarningBasic/timeValue'
      this.$get(url, {
        ...params
      }).then((r) => {
        if (JSON.stringify(r.data) !== '{}') {
          this.data = r.data.list
          this.yname = r.data.rightY + ' (' + r.data.unitRight + ')'
          // 数据加载完毕，关闭loading
          this.loading = false
        }
      })
    },
    // 模型指数趋势图
    getPnModelChart (startDate, endDate) {
      let _this = this
      let params = {}
      if (startDate === undefined && endDate === undefined) {
        params.startDate = _this.startDate
        params.endDate = _this.endDate
      } else {
        params.startDate = startDate
        params.endDate = endDate
      }
      params.pnId = _this.warnDetailData.pnId
      this.$get('warnWeb/calculate/calculateChart', {
        ...params
      }).then((r) => {
        if (r.data.data.length !== 0 || r.data.data !== null) {
          let dataList = r.data.data
          _this.EChartsData = dataList
          if (dataList.length === 0) {
            return
          }
          let xAxisValue = []
          let modelValue = []
          for (let i = 0; i < dataList.length; i++) {
            xAxisValue.push(dataList[i].warnTime)
            modelValue.push(dataList[i].value)
          }
          // console.log('模型指数', xAxisValue+'****'+ modelValue)
          _this.chartPicInit(xAxisValue, modelValue)
        }
      })
    },
    parseThreshold (arr, color) {
      let p = []
      arr.forEach((item, index, array) => {
        if (index === (array.length - 1)) {
          p.push({gt: item.type, color: color[index]})
        } else {
          p.push({gt: item.type, lte: item.value, color: color[index]})
        }
      })
      return {p: p}
    },
    chartPicInit (xAxisValue, modelValue) {
      let _this = this
      let myChart = _this.$echarts.init(this.$refs.EChartModelData)
      let obj = this.parseThreshold(_this.CalculateValue, _this.color)
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
          data: xAxisValue
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
            data: modelValue
          }
        ]
      }, true)
    },
    // 模型预警阈值列表
    getCalculateThreshoid () {
      let _this = this
      this.$get('web/earlyWarningBasic/calculateThreshold', {}).then((r) => {
        let dataList = r.data.data
        _this.CalculateValue = dataList
      })
    },
    reset () {
      if (this.$refs.TableInfo) this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
      if (this.paginationInfo) {
        this.paginationInfo.current = this.pagination.defaultCurrent
        this.paginationInfo.pageSize = this.pagination.defaultPageSize
      }
    },
    changeDate (dates, dateStrings) {
      this.startDate = dateStrings[0]
      this.endDate = dateStrings[1]
      this.reset()
      this.updateChart({
        pnId: this.warnDetailData.pnId,
        devValueId: this.warnInfo.devValueId,
        devValueName: this.warnInfo.devValueName,
        startDate: this.startDate,
        endDate: this.endDate
      })
      this.fetch({
        devValueId: this.warnInfo.devValueId,
        devValueName: this.warnInfo.devValueName,
        startDate: this.startDate,
        endDate: this.endDate
      })
    },
    fetch (params = {}) {
      this.loading = true
      this.sourceData = []
      if (this.paginationInfo) {
        // 如果分页信息不为空，则设置表格当前第几页，每页条数，并设置查询分页参数
        this.$refs.TableInfo.pagination.current = this.paginationInfo.current
        this.$refs.TableInfo.pagination.pageSize = this.paginationInfo.pageSize
        params.pageSize = this.paginationInfo.pageSize
        params.pageNum = this.paginationInfo.current
      } else {
        // 如果分页信息为空，则设置为默认值
        params.pageSize = this.pagination.defaultPageSize
        params.pageNum = this.pagination.defaultCurrent
      }
      params.pnId = this.warnDetailData.pnId
      this.$get('web/earlyWarningBasic/devValueDataList', {...params}).then((r) => {
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
      })
    },
    handleTableChange (pagination) {
      let _this = this
      _this.paginationInfo = pagination
      _this.fetch({
        devValueId: this.warnInfo.devValueId,
        devValueName: this.warnInfo.devValueName,
        startDate: this.startDate,
        endDate: this.endDate,
        pageSize: pagination.pageSize,
        pageNum: pagination.current
      })
    },
    changePageNumber (current) {
      let _this = this
      _this.pagination.defaultCurrent = current
      _this.getWarnByPnId(_this.pagination)
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
      params.pnId = _this.warnDetailData.pnId
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
          _this.modelSourceData = dataList.records
          _this.total = dataList.total
        } else {
          _this.modelSourceData = []
          _this.total = 0
          _this.pagination.defaultCurrent = 1
        }
      })
    }
  },
  filters: {
    // 名称过长时用...代替
    ellipsis (value, num) {
      if (!value) {
        return ''
      }
      if (value.length > num) {
        return value.slice(0, num) + '...'
      }
      return value
    }
  }
}
</script>

<style lang="less" scoped>
  .handleResult{
    font-family: 'Microsoft YaHei UI';
    font-size: 1.8rem;
    font-weight: bold;
  }
  .main-content{
    margin-left:3rem;
  }
  .aStyle{
    color: #3CDB95;
    text-decoration:underline;
  }
  .index-safety{
    border: 1px solid #0C666A;
    margin-left:1rem;
    padding:0 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
</style>
