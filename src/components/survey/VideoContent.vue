<template>
  <!--<a-modal
    :footer="null"
    :visible="visible"
    :width="800"
    :mask="true"
    @cancel="cancelModal"
  >-->
  <div>
   <!-- <div>
      <img src="static/imgs/多边形1.png"/>
      <span class="modelTitle">监测点详情</span>
    </div>-->
    <div class="potential-label">
      <ul>
        <li v-for="mx in list" :key="mx.id" @click="ck(mx.id)" :class="[{active: activeTab === mx.id}]">
          {{mx.name}}
        </li>
      </ul>
    </div>
    <div id="baseInfo" style="width:100%;" v-if="activeTab === '0'">
      <div class="titleIcon" style="width:100%;padding-left:0.5rem;">
        <img class="s-img" src="static/imgs/圆角矩形1220.png"/>
        <span class="s-title">基本信息</span>
      </div>
      <div style="margin-top:1rem;">
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            监测点
          </a-col>
          <a-col :span="5" :order="2" class="info-content">
            <span :title="HPPnDetail.projPnName">{{HPPnDetail.projPnName | ellipsis(7)}}</span>
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            经纬度
          </a-col>
          <a-col :span="5" :order="4" class="info-content">
            {{HPPnDetail.projPnLongitude}},{{HPPnDetail.projPnLatitude}}
          </a-col>
          <a-col :span="3" :order="5" class="info-label">
            父测点
          </a-col>
          <a-col :span="5" :order="6" class="info-content">
            {{HPPnDetail.hostPnName || '--'}}
          </a-col>
        </a-row>
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            所受隐患点
          </a-col>
          <a-col :span="5" :order="2" class="info-content">
            <span :title="HPPnDetail.hiddenName">{{HPPnDetail.hiddenName | ellipsis(7)}}</span>
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            所在地址
          </a-col>
          <a-col :span="5" :order="4" class="info-content">
            {{HPPnDetail.projBasicAddress}}
          </a-col>
          <a-col :span="3" :order="5" class="info-label">
            状态
          </a-col>
          <a-col :span="5" :order="6" class="info-content">
            已绑定
          </a-col>
        </a-row>
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            创建时间
          </a-col>
          <a-col :span="5" :order="2" class="info-content">
            {{HPPnDetail.createTime}}
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            创建者
          </a-col>
          <a-col :span="13" :order="4" class="info-content">
            {{HPPnDetail.createUserName}}
          </a-col>
        </a-row>
      </div>
      <div class="titleIcon" style="width:100%;padding-left:0.5rem;">
        <img class="s-img" src="static/imgs/形状1254.png"/>
        <span class="s-title">设备信息</span>
      </div>
      <div style="margin-top:1rem;">
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            设备名称
          </a-col>
          <a-col :span="9" :order="2" class="info-content">
            {{HPDevBasic.devBasicName}}
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            设备编号
          </a-col>
          <a-col :span="9" :order="4" class="info-content">
            {{HPDevBasic.devBasicStrId}}
          </a-col>
        </a-row>
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            生产日期
          </a-col>
          <a-col :span="9" :order="2" class="info-content">
            {{HPDevBasic.devBasicCreateTime}}
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            状态
          </a-col>
          <a-col :span="9" :order="4" class="info-content">
            <span v-if="HPDevBasic.devBasicBonline === 0">在线</span>
            <span v-else-if="HPDevBasic.devBasicBonline === 1">离线</span>
          </a-col>
        </a-row>
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            设备型号
          </a-col>
          <a-col :span="9" :order="2" class="info-content">
            {{HPDevBasic.devModelName}}
          </a-col>
          <a-col :span="3" :order="3" class="info-label">
            设备生产商
          </a-col>
          <a-col :span="9" :order="4" class="info-content">
            <a style="color:#e9e9e9;">北京中关村智连安全科学研究院有限公司</a>
          </a-col>
        </a-row>
        <a-row type="flex" class="info">
          <a-col :span="3" :order="1" class="info-label">
            设备说明
          </a-col>
          <a-col :span="21" :order="2" class="info-content">
            可测振动、倾角、加速度、Lora连接......
          </a-col>
        </a-row>
      </div>
    </div>
    <div id="pnVideoInfo" style="width:100%;" v-if="activeTab === '1'">
      <component :is="componentName" @showVideo="showVideo"  :isfirst="isfirst" :HPDevBasic="HPDevBasic" :HPPnDetail="HPPnDetail"  class="main-content"></component>
    </div>
  </div>
 <!-- </a-modal>-->
</template>

<script>
import VideoDetail from '@/components/survey/VideoDetail.vue'
import '../../views/warn/info.css'
export default {
  name: 'VideoContent',
  components: {
    VideoDetail // 指标详情
  },
  data () {
    return {
	    componentName: 'VideoDetail',
      selectedDevTags: [], // 指标选中列表
      devValueName: '',
      projPnParentId: '',
      devValueStrId: '',
      devValueRedUpper: '',
      devValueRedLower: '',
      devValueYellowUpper: '',
      devValueYellowLower: '',
      devValueModelName: '',
      selectDevValueName: '', // 选中指标名称
      list: [{id: '0', name: '监测点详情'}, {id: '1', name: '监测数据详情'}],
      activeTab: '0' // tab选中
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
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
  methods: {
    cancelModal () {
      this.activeTab = '0'
      this.$emit('onClose')
    },
    ck (mx) {
      let _this = this
      _this.activeTab = mx
    },
    showVideo () {
      this.$emit('showVideo')
    },
    callback (key) {
      console.log(key)
    //   if (key === '2') {
    //     document.getElementsByClassName('HPDevValueName')[0].getElementsByClassName('ant-tag')[0].click()
    //   }
    },
  },
  mounted () {
  },
  created () {

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
  .card-container{
    padding:0px 5px;
    .s-title-info{
      font-size: 12px;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-weight: bold;
      color: #c9f4ff;
      line-height: 24px;
      margin-left:8px;
    }
    .info{
      border-bottom: 1px solid #0e2142;
    }
    .base-info{
      margin-top:10px;
      font-size:12px;
    }
    .base-info-title{
      height:25px;
      line-height: 25px;
      text-align: center;
      font-size:14px;
      font-family: "时尚中黑简体";
      color: rgba(197,243,255,.8);
      background-color: rgba(45,150,238,.5);
    }
    .info-label,.info-content{
      // height: 28px;
      padding: 5px 0px 5px 10px;
      border-left:1px solid #0e2142;
    }
    .info-label{
      background-color: rgba(230,249,254,.12);
    }
    .info-content{
      background-color: rgba(230,249,254,.08)
    }
  }
  .potential-label {
    width:100%;
    height:5rem;
    line-height: 5rem;
    margin-top:1.5rem;
    margin-bottom:1rem;
  }
  .potential-label ul{
    float: left;
    list-style: none;
    text-align: center;
    margin-right:0.8rem;
    cursor: pointer;
    li{
      float: left;
      width:14rem;
      height: 4.2rem;
      line-height: 4.2rem;
      background-image: url("../../../static/imgs/组955.png");
      background-size: 100% 100%;
      font-family: "Microsoft YaHei UI";
      font-weight: 400;
      font-size: 1.6rem;
      color:#3CDB95;
      margin: 5px !important;
    }
    li.active{
      font-weight: bold;
      color:#FFFFFF !important;
      background-image: url("../../../static/imgs/组956.png") !important;
      background-size: 100% 100%;
    }
  }
</style>
