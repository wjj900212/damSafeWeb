<template>
  <!--场景可视化-->
  <div :style="{ height: '100%', width: '100%' }">
    <div class="design_content" @click="onClick">
      <!-- <div class="tabs-list">
        <div :title="item.sceneName" @click="changeActive(item.sceneId)" :class="['tabs-button', { active: activeKey === item.sceneId }]" v-for="item in data" :key="item.sceneId" style="text-align: center;">
          {{ item.sceneName }}
        </div>
      </div> -->
      <div style="position: relative;width: 100%;height: 100%;">
        <div :class="['tabs-pane', { active: activeKey === data.sceneId }]" :style="{ backgroundImage: 'url(' + data.path + ')', backgroundSize: '100% 100%', position: 'relative', width: '765px', height: '398px', display: 'block' }">
          <div :title="i.pnName" :class="['title-info', {hidden: i.configId === select.configId}]" v-for="i in data.config" :key="i.configId + 'index'" :style="{position: 'absolute', left: (i.xaxis - 5) + 'px', top: (i.yaxis - 40) + 'px'}">{{ i.pnName }}</div>
          <div @click="(e)=>{ showDetail(e, i) }" v-for="i in data.config" :key="i.configId" :style="{ width: i.width - 22 + 'px', height: i.height - 22 + 'px', backgroundImage: 'url(' + i.path + ')', backgroundSize: 'contain', position: 'absolute', left: i.xaxis + 'px', top: i.yaxis + 'px' }">
          </div>
        </div>
      </div>
    </div>
    <div class="pointer_info" :style="{ left: (select.xaxis + 70) + 'px', top: (select.yaxis + 66) + 'px', display: select.display }">
      <div class="headtitle">
        <a-row>
          <a-col :span="20" :style="{ textAlign: 'left'}">{{ select.pnName }}</a-col>
          <a-col :span="4"><a-icon type="snippets" :style="{ cursor: 'pointer' }" @click="showMDetail"/></a-col>
        </a-row>
      </div>
      <div class="bodybox">
        <a-row  v-for="(item, index) in select.list" :key="index" type="flex" justify="space-between">
          <!-- <a-col :style="{ textAlign: 'left'}"></a-col>
          <a-col :style="{ textAlign: 'right'}"></a-col> -->
          <a-col>{{ item.targetName }}</a-col>
          <a-col>{{ item.value }}</a-col>
        </a-row>
      </div>
    </div>
    <component
      v-if="isShowProjPn"
      :is="componentName"
      :visible="isShowProjPn"
      :indexValueId="devValueId"
      :HPDevValueNameList="HPDevValueNameList"
      :HPDevBasic="HPDevBasic"
      :HPPnDetail="HPPnDetail"
      @getProjPnDataOfHome="getProjPnDataOfHome"
      @onClose="()=>{isShowProjPn=false}"
      class="main-content"
    ></component>
  </div>
</template>

<script>
import MainContent from '@/components/survey/MainContent.vue'
export default {
  name: 'design',
  components: {
    MainContent
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    data (val) {
      this.onClick()
    }
  },
  data () {
    return {
      select: {
        xaxis: 0,
        yaxis: 0,
        display: 'none'
      },
      activeKey: '',
      componentName: 'MainContent',
      HPPnDetail: null, // 监测点信息
      HPDevBasic: null, // 设备信息
      HPDevValueNameList: [], // 指标名称列表
      mapProjPnId: 0, // 记录点击地图监测点id
      devValueId: 0, // 指标id
      isShowProjPn: false
    }
  },
  mounted () {

  },
  methods: {
    changeActive (active) {
      this.activeKey = active
    },
    getWarnType (type) {
      let title = ''
      switch (type) {
        case '0':
          title = '无预警'
          break
        case '1':
          title = '蓝色预警'
          break
        case '2':
          title = '黄色预警'
          break
        case '3':
          title = '橙色预警'
          break
        case '4':
          title = '红色预警'
          break
      }
      return title
    },
    showMDetail () {
      // console.log('选中监测点信息', this.select)
      // this.$emit('show', this.select.projectId, this.select.hiddenId, this.select.projPnId)
      this.getProjPnDataOfHome(this.select.projPnId)
      this.isShowProjPn = true
    },
    cancelModel () {
      this.$emit('onClose')
    },
    showDetail (e, obj) {
      const projPnId = obj.projPnId
      const params = {
        projPnId: projPnId
      }
      this.$get('web/hiddenScene/getConfiguredSomePnInfo', {
        ...params
      }).then((r) => {
        if (r.data.data !== null) {
          let data = r.data.data
          console.log(data)
          this.select = { ...obj, display: 'block', list: []}
          this.select.list = data.list
        } else {
          this.$message.success(r.data.msg)
        }
      })
      e.stopPropagation()
    },
    onClick () {
      this.select = {
        xaxis: 0,
        yaxis: 0,
        display: 'none'
      }
    },
    // 监测点详情
    /*
    * pnId:监测设备id
    * indexId:指标id
    * */
    getProjPnDataOfHome (pnId) {
      let params = {}
      params.projPnId = pnId
      this.$get('web/projPn/projPnDetail', {...params}).then((r) => {
        let projPnData = r.data.data
        this.HPPnDetail = projPnData.pnDetail
        if (projPnData.devValueList.length !== 0) {
          this.devValueId = projPnData.devValueList[0].devValueId
        }
        this.HPDevValueNameList = projPnData.devValueList
        this.HPDevBasic = projPnData.devBasic
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .summary {
    width: 269px;
    height: 65px;
    background: rgba(6, 32, 33, 0.8);
    border: 1px solid rgba(60, 219, 149, 0.5);
    padding: 10px;
    position: absolute;
    top: 13px;
    left: 31px;
    z-index: 1;
  }
  .summary > div {
    float: left;
    text-align: center;
    margin: 0px 10px;
  }
  .summary > span {
    display: inline-block;
    text-align: center;
    margin: 5px 10px;
  }
  .designModal /deep/ .ant-modal{
    top:40px !important;
  }
  .design_title {
    font-size: 18px;
    padding: 10px;
  }
  .design_content {
    width: 100%;
    height: 100%;
    // padding: 10px;
    // height: 650px;
  }
  .tabs-list {
    position: absolute;
    top: 15px;
    left: 30%;
  }
  .tabs-button {
    line-height: 32px;
    float: left;
    width: 109px;
    height: 32px;
    background: rgba(10, 48, 57, 0.3);
    border: 1px solid rgba(11, 94, 94, 0.5);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    cursor: pointer;
  }
  .tabs-button.active {
    background: rgba(12, 102, 106, 0.5)!important;
  }
  .tabs-pane {
    display: none;
  }
  .tabs-pane.active {
    display: block;
  }
  .ant-tabs-tab {
    color: cadetblue;
  }
  .title-info {
    background: url("../../../static/img/titleinfo.png") no-repeat;
    background-position: center;
    background-size: 100% 100%;
    width: 98px;
    height: 36px;
    line-height: 8px;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding: 10px;
    color: white;
  }
  .title-info.hidden {
    display: none;
  }
  .pointer_info {
    position: absolute;
    display: none;
    min-width: 205px;
    line-height: 24px;
    background: white;
    background-position: center;
    background-size: 100% 100%;
    border-radius: 5px;
    white-space: nowrap;
  }
  .headtitle {
    border-bottom: 1px solid #aaa;
    padding: 5px 10px;
  }
  .bodybox {
    padding: 10px;
  }
</style>
