<template>
  <div :class="[
      'home-page'
    ]">
    <cesium-page :isSpin="isSpin">
      <div v-show="ishiddenHomePointPopup" :style="hiddenPosition" id="hiddenHomePointPopup" class="homePopup">
        <div id="hhpp-proj" style="display: flex;justify-content: space-between;align-content: space-between;">
          <div id="hhpp-proj-name" style="font-size: 1.6rem;color: #FEFFFF;"></div>
          <div id="hhpp-proj-type" style="font-size: 1.6rem;"></div>
          <div class="info">详情</div>
        </div>
        <div class="line"></div>
        <div style="display: flex;font-size: 1.4rem;margin-bottom:1.3rem;align-items: center;"><div class="circle"></div><div id="hhpp-location"></div><img src="static/img/定位-2.png"></div>
        <div id="hhpp-img"></div>
        <div id="hhpp-data"></div>
        <div id="hhpp-scene"></div>
      </div>
    </cesium-page>
    <!-- 左侧内容 -->
    <div class="leftView">
      <!-- 水库安全状态 -->
      <div class="left_modelA">
        <safeStatus />
      </div>
      <!-- 水库概览列表 -->
      <div class="left_modelB">
        <reservoirList />
      </div>
    </div>
    <!-- 中间内容 数量统计 -->
    <div class="centerView">
      <centerTotal />
    </div>
    <!-- 右侧内容 -->
    <div class="rightView">
      <!-- 雨水情监测 -->
      <div class="right_modelA">
        <rainWaterMonitor />
      </div>
      <!-- 大坝安全监测 重点区域监控 -->
      <div class="right_modelB">
        <safeAmonitor />
      </div>
      <!-- 实时动态 -->
      <div class="right_modelC">
        <dynamic />
      </div>
    </div>
  </div>
</template>
<script>
import {
  mapState
} from 'vuex'
import moment from 'moment'
import cesiumPage from '@/components/cesium/cesium.vue'
import safeStatus from './homePage/safeStatus.vue' // 左侧水库安全状态
import reservoirList from './homePage/list.vue' // 左侧水库概览列表
import centerTotal from './homePage/centertotal.vue' // 中间内容 数量统计
import rainWaterMonitor from './homePage/rainWaterMonitor.vue' // 右侧 雨水情监测
import safeAmonitor from './homePage/safeAmonitor.vue' // 大坝安全监测 重点区域监控
import dynamic from './homePage/dynamic.vue' // 实时动态
moment.locale('zh-cn')

export default {
  name: 'HomePage',
  components: {
    cesiumPage,
    safeStatus,
    reservoirList,
    centerTotal,
    rainWaterMonitor,
    safeAmonitor,
    dynamic
  },
  data () {
    return {
      isSpin: false,
      isShowLayers: true,
      isShowLegend: {
        warnLevel: true,
        devPoint: false
      },
      ishiddenHomePointPopup: false,
      hiddenPosition: {
        left: '0px',
        top: '0px'
      }
    }
  },
  computed: {
    ...mapState({
      multipage: (state) => state.setting.multipage,
      websocketData: (state) => state.account.websocketData,
      user: (state) => state.account.user
    }),
    avatar () {
      return `static/avatar/${this.user.avatar}`
    }
  },
  watch: {
    websocketData (n, o) {
      console.log('websocketData',n, o)
    }
  },
  methods: {
    toggleLayers () {
      this.isShowLayers = !this.isShowLayers
    },
    init3 () {
      let viewer = mapviewer.viewer
      viewer.imageryLayers._layers[0].show = false
      viewer.imageryLayers._layers[1].show = true
      document.getElementById('hom-layers-ul').getElementsByTagName('img')[0].style.border =
          '1px solid rgb(87, 240, 198)'
      document.getElementById('hom-layers-ul').getElementsByTagName('img')[1].style.border =
          '1px solid rgb(255, 255, 255)'
      document.getElementById('hom-layers-ul').getElementsByTagName('div')[0].style.color = 'rgb(87, 240, 198)'
      document.getElementById('hom-layers-ul').getElementsByTagName('div')[1].style.color = 'rgb(110, 164, 153)'
    },
    initRain () {
      let viewer = mapviewer.viewer
      viewer.imageryLayers._layers[0].show = true
      viewer.imageryLayers._layers[1].show = false
      document.getElementById('hom-layers-ul').getElementsByTagName('img')[0].style.border =
          '1px solid rgb(255, 255, 255)'
      document.getElementById('hom-layers-ul').getElementsByTagName('img')[1].style.border =
          '1px solid rgb(87, 240, 198)'
      document.getElementById('hom-layers-ul').getElementsByTagName('div')[0].style.color = 'rgb(110, 164, 153)'
      document.getElementById('hom-layers-ul').getElementsByTagName('div')[1].style.color = 'rgb(87, 240, 198)'
    }
  },
  mounted () {
    this.$cesiumJS.clearMap(this)
    this.$cesiumJS.initMap(this, 'homePage', this.isShowLegend)
    this.$websocket.sendThis(this)
  }
}
</script>
<style lang="less">
  #hom-layers-ul {
    font-family: 时尚中黑简体;
    background: url("../../static/img/scene-background.png") no-repeat;
    position: absolute;
    bottom: 5px;
    left: 15px;
    z-index: 999;
    font-size: 14px;
    width: 250px;
    background-size: 100% 100%;
    -webkit-box-orient: vertical;
    margin-bottom: 0px !important;
  }

  #hom-layers-ul li {
    float: left;
    color: #fff;
    text-align: center;
    margin-left: 13px;
    margin-top: 10px;
    cursor: pointer;
  }

  #hom-layers-ul img {
    width: 100px;
    height: 63px;
    border: 1px solid #C5F3FF;
  }

  #hom-layers-ul div {
    color: rgb(110, 164, 153);
  }
  .home-page {
    background-color: #fff;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;

    .leftView {
      position: absolute;
      width: 18%;
      height: calc(100% - 81px - 3rem);
      z-index: 10;
      left: 1.8rem;
      bottom: 1.5rem;
      background: url('../../static/img/left-bg.png') no-repeat;
      background-size: 100% 100%;


      .left_modelA {
        position: absolute;
        width: 100%;
        height: 270px;
        // top: 2.4rem;
      }

      .left_modelB {
        position: absolute;
        width: 100%;
        bottom: 1rem;
        height: calc(100% - 270px - 1rem);
      }
    }

    .centerView {
      width: 40%;
      // padding: 0 2%;
      left: 50%;
      transform: translateX(-50%);
      top: 9rem;
      position: absolute;
    }

    .rightView {
      position: absolute;
      width: 23%;
      height: calc(100% - 81px - 3rem);
      z-index: 10;
      right: 1.8rem;
      bottom: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: url('../../static/img/left-bg.png') no-repeat;
      background-size: 100% 100%;

      .right_modelA,
      .right_modelB,
      .right_modelC {
        position: relative;
        height: 33%;
      }

      // .right_modelA {}

      .right_modelB {
        margin: 1rem 0;
      }

      .right_modelC {
        margin-bottom: 1rem;
      }
    }
  }
  .homePopup {
    position: absolute;
    z-index: 9999;
    height: 500px;
    width: 376px;
    background: url("../../static/img/弹框-bg.png");
    padding: 20px 30px;
    color:#ffffff;
    .info{
      width:5.5rem;
      height: 2.3rem;
      line-height: 2.3rem;
      font-size: 1.4rem;
      border: 1px solid;
      border-image: linear-gradient(0deg, #18BFE2, #FFFFFF) 1 1;
      border-radius: 0.8rem;
      text-align: center;
      cursor: pointer;
      background: rgba(10,16,40,0.3);
    }
    .line{
      width: 31rem;
      height: 1px;
      background: #0084FF;
      margin-top:0.8rem;
      margin-bottom:1.8rem;
    }
    .circle{
      width: 6px;
      height: 6px;
      background: #27FFE8;
      box-shadow: 0px 0px 6px 0px #2DBCFF;
      border-radius: 50%;
    }
    #hhpp-location{
      margin-left:0.5rem;
      margin-right:0.5rem;
    }
    #hhpp-img{
      width: 30.6rem;
      height: 15.7rem;
    }
    #hhpp-data{
      width: 31.7rem;
      height: 3.5rem;
      line-height: 3.5rem;
      display: flex;
      justify-content: space-between;
      align-content: space-between;
      padding:0px 0.5rem;
      border: 1px solid #02BDED;
      margin-top:0.9rem;
      margin-bottom:2rem;
    }
    #hhpp-scene{
      font-size: 1.4rem;
      color: #C3CDE5;
    }
  }
</style>
