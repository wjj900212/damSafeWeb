<template>
  <a-modal
    :footer="null"
    :visible="visible"
    :width="1000"
    :mask="true"
    :zIndex="1"
    @cancel="cancelModal"
  >
    <div class="potential-label">
      <ul>
        <li v-for="mx in list" :key="mx.id" @click="ck(mx.id)" :class="[{active: activeTab === mx.id}]">
          {{mx.name}}
        </li>
      </ul>
    </div>
    <div id="pnDataInfo" style="width:100%;" v-if="activeTab === '0'">
      <component ref="pnDataInfo" :is="componentName" v-bind="$attrs" :HPDevValueNameList="HPDevValueNameList" :HPDevBasic="HPDevBasic" :HPPnDetail="HPPnDetail"></component>
    </div>
    <div id="baseInfo" style="width:100%;" v-if="activeTab === '1'">
      <div class="titleIcon" style="width:100%;padding-left:0.5rem;">
        <img class="s-img" src="static/imgs/圆角矩形1220.png"/>
        <span class="s-title">基本信息</span>
      </div>
      <div style="margin-top:1rem;">
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            监测点名称
          </a-col>
          <a-col :span="9" :order="2" class="info-content">
            <span :title="HPPnDetail.projPnName">{{HPPnDetail.projPnName | ellipsis}}</span>
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            所属项目
          </a-col>
          <a-col :span="9" :order="4" class="info-content">
            {{HPPnDetail.projBasicName}}
          </a-col>
        </a-row>
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            所属隐患点
          </a-col>
          <a-col :span="9" :order="2" class="info-content">
            <span :title="HPPnDetail.hiddenName">{{HPPnDetail.hiddenName | ellipsis}}</span>
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            父测点
          </a-col>
          <a-col :span="9" :order="4" class="info-content">
            {{HPPnDetail.hostPnName || '--'}}
          </a-col>
        </a-row>
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            经纬度
          </a-col>
          <a-col :span="9" :order="2" class="info-content">
            {{HPPnDetail.projPnLongitude}} E {{HPPnDetail.projPnLatitude}} N
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            设备类型
          </a-col>
          <a-col :span="9" :order="4" class="info-content">
            {{HPPnDetail.devModelName}}
          </a-col>
        </a-row>
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            设备状态
          </a-col>
          <a-col :span="9" :order="2" class="info-content">
            <span style="color:#5affce;font-family:'Microsoft YaHei UI';" v-if="HPDevBasic.devBasicBonline === 0">在线</span>
            <span style="color:#ff595a;font-family:'Microsoft YaHei UI';" v-else-if="HPDevBasic.devBasicBonline === 1">离线</span>
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            设备绑定
          </a-col>
          <a-col :span="9" :order="4" class="info-content">
            <span v-if="HPPnDetail.projPnDevId === 0 || HPPnDetail.projPnDevId === null">未绑定</span>
            <span v-else>已绑定</span>
          </a-col>
        </a-row>
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            设备条码
          </a-col>
          <a-col :span="21" :order="2" class="info-content">
          {{HPDevBasic.devBasicStrId}}
          </a-col>
        </a-row>
      </div>
      <div class="titleIcon" style="width:100%;padding-left:0.5rem;margin-top:1rem;">
        <img class="s-img" src="static/imgs/指标.png"/>
        <span class="s-title">指标信息</span>
      </div>
      <div style="margin-top:1rem;">
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            指标名称
          </a-col>
          <a-col :span="9" :order="2" class="info-content">
            <a-select
              v-model="devValueName"
              style="width:70%"
            >
              <a-select-option v-for="item in HPDevValueNameList" @click="handleDevValueNameChange(item)" :key="item.devValueId" :value="item.devValueName">
                {{ item.devValueName }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            指标阈值
          </a-col>
          <a-col :span="9" :order="4" class="info-content">
            <div v-if="devValueYellowLower === '' && devValueYellowUpper === '' && devValueRedLower === '' && devValueRedUpper === ''">--</div>
            <div v-else>{{devValueYellowLower || '--'}}/{{devValueYellowUpper || '--'}}/{{devValueRedLower || '--'}}/{{devValueRedUpper || '--'}}</div>
          </a-col>
        </a-row>
      </div>
      <div class="titleIcon" style="width:100%;padding-left:0.5rem;margin-top:1rem;">
        <img class="s-img" src="static/imgs/图片.png"/>
        <span class="s-title">施工图片</span>
      </div>
      <div style="width:100%;height:23rem;overflow-y: auto;margin-top:1.5rem;">
        <div v-if="filePictureList.length === 0" style="margin-top:20px;text-align: center;">
          <img src="static/imgs/暂无数据.png"/>
          <span class="no-data">暂无数据</span>
        </div>
        <div v-else>
          <viewer :images="filePictureList">
            <img v-for="(src,index) in filePictureList" :src="src" :key="index" style="width:13rem;height:13rem;border-radius: 4px;margin-left:1rem;">
          </viewer>
        </div>
      </div>
    </div>
    <div id="modelIndexInfo" style="width:100%;" v-if="activeTab === '2'">
      <ModelIndex
        ref="modalIndex"
        :pnId="pnId"
        :CalculateValue="CalculateValue"
      ></ModelIndex>
    </div>
  </a-modal>
</template>

<script>
import SurveyDetail from '@/components/survey/SurveyDetail.vue'
import ModelIndex from './ModelIndex'
export default {
  name: 'MainContent',
  components: {
    SurveyDetail, // 指标详情
    ModelIndex
  },
  data () {
    return {
      dateFormat: 'YYYY-MM-DD',
      startDate: new Date((new Date()).getFullYear(), (new Date()).getMonth() - 1, (new Date()).getDate()).format('yyyy-MM-dd'),
      endDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()).format('yyyy-MM-dd'),
      list: [{id: '0', name: '监测数据详情'}, {id: '1', name: '监测点详情'}, {id: '2', name: '模型指数'}],
      activeTab: '0', // tab选中
	    componentName: 'SurveyDetail',
      devValueName: '',
      devValueRedUpper: '',
      devValueRedLower: '',
      devValueYellowUpper: '',
      devValueYellowLower: '',
      filePictureList: [],
      type: 3,
      CalculateValue: [], // 阈值
      total: 0,
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 10
      }
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    HPPnDetail: {
      type: Object,
      default: () => {}
    },
    HPDevBasic: {
      type: Object,
      default: () => {}
    },
    HPDevValueNameList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  mounted () {
    this.getCalculateThreshoid()
    console.log('指标列表',this.HPDevValueNameList)
    if (this.HPDevValueNameList.length !== 0) {
      this.devValueName = this.HPDevValueNameList[0].devValueName
    }
  },
  methods: {
    cancelModal () {
      this.activeTab = '0'
      this.filePictureList = []
      this.$emit('onClose')
    },
    ck (mx) {
      let _this = this
      _this.activeTab = mx
      if (mx === '2') {
        setTimeout(function () {
          _this.$refs.modalIndex.getPnModelChart()
          _this.$refs.modalIndex.getWarnByPnId(this.pagination)
        }, 100)
      }
    },
    getCalculateThreshoid () {
      let _this = this
      this.$get('web/earlyWarningBasic/calculateThreshold', {
      }).then((r) => {
        let dataList = r.data.data
        _this.CalculateValue = dataList
      })
    },
    handleDevValueNameChange (item) {
      let _this = this
      if (item.boundary[4] !== 9999) {
        _this.devValueRedUpper = item.boundary[4]
        _this.devValueYellowUpper = item.boundary[2]
        _this.devValueRedLower = item.boundary[3]
        _this.devValueYellowLower = item.boundary[1]
      } else {
        _this.devValueRedUpper = ''
        _this.devValueYellowUpper = ''
        _this.devValueRedLower = ''
        _this.devValueYellowLower = ''
      }
    }
  },
  watch: {
    HPPnDetail (newVal) {
      if (newVal.sgImage !== '') {
        this.filePictureList = newVal.sgImage.split('||')
      }
    },
    HPDevValueNameList (newVal) {
      if (this.HPDevValueNameList.length !== 0) {
        this.devValueName = this.HPDevValueNameList[0].devValueName
      }
    }
  },
  filters: {
  // 名称过长时用...代替
    ellipsis (value) {
      if (!value) {
        return ''
      }
      if (value.length > 14) {
        return value.slice(0, 14) + '...'
      }
      return value
    }
  }
}
</script>

<style lang="less" scoped>
  .card-container > .ant-tabs-card > .ant-tabs-content {
    height: 120px;
    margin-top: -16px;
  }

  .card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
    background: #fff;
    padding: 16px;
  }

  .card-container > .ant-tabs-card > .ant-tabs-bar {
    border-color: #fff;
  }

  .card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
    border-color: transparent;
    background: transparent;
  }

  .card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
    border-color: #fff;
    background: #fff;
  }
  .ant-tabs{
    color:#e9e9e9 !important;
  }
  .potential-label {
    width:100%;
    height:5rem;
    line-height: 5rem;
    position: absolute;
    top:4rem;
  }
  .potential-label ul{
    list-style: none;
    text-align: center;
    height:5rem;
    margin-right:0.8rem;
    cursor: pointer;
    position: absolute;
    right: 10px;
    li{
      float: left;
      width:14rem;
      height: 4.2rem;
      line-height: 4.2rem;
      border: 1px solid #3CDB95;
      opacity: 0.6;
      /*background-image: url("../../../static/imgs/组955.png");
      background-size: 100% 100%;*/
      font-family: "Microsoft YaHei UI";
      font-weight: 400;
      font-size: 1.6rem;
      color: #3BD996;
      margin: 5px !important;
    }
    li.active{
      border: 1px solid #3cdb95;
      background: rgba(70, 255, 172, 0.2);
      color: #3CDB95;
      opacity: 1;
    }
  }
  /*.index-mark{
    text-align: center;
    width:38px;
    height:98px;
    background: url("../../../static/images/圆角矩形4拷贝13@2x_97.png") !important;
    background-size: cover;
    font-family: 时尚中黑简体;
    font-size:17px;
    color:#ebc43d;
  }*/
  @media screen and (max-width:1536px){
    #pn-base-info{
      height: calc(30vh) !important;
      overflow-y: scroll;
    }
  }
  @media screen and (max-width:1366px){
    #pn-base-info{
      height: calc(24vh) !important;
      overflow-y: scroll;
    }
  }
  #pn-base-info{
    height: calc(35vh);
    overflow-y: scroll;
  }
</style>
