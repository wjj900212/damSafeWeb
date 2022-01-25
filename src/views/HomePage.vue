<template>
  <div :class="[
      'home-page'
    ]">
    <cesium-page :isSpin="isSpin">
      <!-- <ul id="hom-layers-ul" v-show="isShowLayers">
        <li @click="init3">
          <img src="static/images/rain.png" />
          <div>电子地图</div>
        </li>
        <li @click="initRain">
          <img
            style="border: 1px solid rgb(87, 240, 198)"
            src="static/images/sanwei.png"
          />
          <div style="color: rgb(87, 240, 198)">影像</div>
        </li>
      </ul> -->
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
  } from "vuex";
  import moment from "moment";
  import cesiumPage from '@/components/cesium/cesium.vue'
  import safeStatus from './homePage/safeStatus.vue' //左侧水库安全状态
  import reservoirList from './homePage/list.vue' //左侧水库概览列表
  import centerTotal from './homePage/centertotal.vue' //中间内容 数量统计
  import rainWaterMonitor from "./homePage/rainWaterMonitor.vue" //右侧 雨水情监测
  import safeAmonitor from './homePage/safeAmonitor.vue' // 大坝安全监测 重点区域监控 
  import dynamic from './homePage/dynamic.vue' // 实时动态 
  moment.locale("zh-cn");

  export default {
    name: "HomePage",
    components: {
      cesiumPage,
      safeStatus,
      reservoirList,
      centerTotal,
      rainWaterMonitor,
      safeAmonitor,
      dynamic
    },
    data() {
      return {
        isSpin: false,
        isShowLayers: true,
      };
    },
    computed: {
      ...mapState({
        multipage: (state) => state.setting.multipage,
      websocketData: (state) => state.account.websocketData,
        user: (state) => state.account.user,
      }),
      avatar() {
        return `static/avatar/${this.user.avatar}`;
      },
    },
    watch:{
      websocketData(n,o){
        console.log(n,o)
      }
    },
    methods: {
      toggleLayers() {
        this.isShowLayers = !this.isShowLayers
      },
      init3() {
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
      initRain() {
        let viewer = mapviewer.viewer
        viewer.imageryLayers._layers[0].show = true
        viewer.imageryLayers._layers[1].show = false
        document.getElementById('hom-layers-ul').getElementsByTagName('img')[0].style.border =
          '1px solid rgb(255, 255, 255)'
        document.getElementById('hom-layers-ul').getElementsByTagName('img')[1].style.border =
          '1px solid rgb(87, 240, 198)'
        document.getElementById('hom-layers-ul').getElementsByTagName('div')[0].style.color = 'rgb(110, 164, 153)'
        document.getElementById('hom-layers-ul').getElementsByTagName('div')[1].style.color = 'rgb(87, 240, 198)'
      },
    },
    mounted() {},
  };

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

    .head-info {
      margin-bottom: 0.5rem;

      .head-info-card {
        padding: 0.5rem;
        border-color: #f1f1f1;

        .head-info-avatar {
          display: inline-block;
          float: left;
          margin-right: 1rem;

          img {
            width: 5rem;
            border-radius: 2px;
          }
        }

        .head-info-count {
          display: inline-block;
          float: left;

          .head-info-welcome {
            font-size: 1.05rem;
            margin-bottom: 0.1rem;
          }

          .head-info-desc {
            color: rgba(0, 0, 0, 0.45);
            font-size: 0.8rem;
            padding: 0.2rem 0;

            p {
              margin-bottom: 0;
            }
          }

          .head-info-time {
            color: rgba(0, 0, 0, 0.45);
            font-size: 0.8rem;
            padding: 0.2rem 0;
          }
        }
      }
    }

    .count-info {
      .visit-count-wrapper {
        padding-left: 0 !important;

        .visit-count {
          padding: 0.5rem;
          border-color: #f1f1f1;

          .ant-card-body {
            padding: 0.5rem 1rem !important;
          }
        }
      }

      .project-wrapper {
        padding-right: 0 !important;

        .project-card {
          border: none !important;

          .ant-card-head {
            border-left: 1px solid #f1f1f1 !important;
            border-top: 1px solid #f1f1f1 !important;
            border-right: 1px solid #f1f1f1 !important;
          }

          .ant-card-body {
            padding: 0 !important;

            table {
              width: 100%;

              td {
                width: 50%;
                border: 1px solid #f1f1f1;
                padding: 0.6rem;

                .project-avatar-wrapper {
                  display: inline-block;
                  float: left;
                  margin-right: 0.7rem;

                  .project-avatar {
                    color: #42b983;
                    background-color: #d6f8b8;
                  }
                }
              }
            }
          }

          .project-detail {
            display: inline-block;
            float: left;
            text-align: left;
            width: 78%;

            .project-name {
              font-size: 0.9rem;
              margin-top: -2px;
              font-weight: 600;
            }

            .project-desc {
              color: rgba(0, 0, 0, 0.45);

              p {
                margin-bottom: 0;
                font-size: 0.6rem;
                white-space: normal;
              }
            }
          }
        }
      }
    }
  }

  .home-page {

    .leftView {
      position: absolute;
      width: 17%;
      height: calc(100% - 59px);
      z-index: 10;
      left: 1.8rem;
      bottom: 0;

      .left_modelA {
        position: absolute;
        width: 100%;
        height: 270px;
        top: 2.4rem;
      }

      .left_modelB {
        position: absolute;
        width: 100%;
        bottom: 1rem;
        height: calc(100% - 2.4rem - 270px - 3.5rem);
      }
    }

    .centerView {
      width: 40%;
      left: 50%;
      transform: translateX(-50%);
      top: 8rem;
      position: absolute;
    }

    .rightView {
      position: absolute;
      width: 20%;
      height: calc(100% - 59px);
      z-index: 10;
      right: 1.8rem;
      bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .right_modelA,
      .right_modelB,
      .right_modelC {
        position: relative;
        height: 33%;
      }

      .right_modelA {
        margin-top: 2.4rem;
      }

      .right_modelB {
        margin: 2.4rem 0;
      }

      .right_modelC {
        margin-bottom: 1rem;
      }
    }
  }

</style>
