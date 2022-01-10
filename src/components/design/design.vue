<template>
  <div>
    <div class="design_content" @click="onClick">
      <!-- <div class="tabs-list">
        <div :title="item.sceneName" @click="changeActive(item.sceneId)" :class="['tabs-button', { active: activeKey === item.sceneId }]" v-for="item in data" :key="item.sceneId" style="text-align: center;">
          {{ item.sceneName }}
        </div>
      </div> -->
      <div style="position: relative;">
        <div :class="['tabs-pane', { active: activeKey === item.sceneId }]" v-for="item in data" :key="item.sceneId + 'content'" :style="{ backgroundImage: 'url(' + item.path + ')', backgroundSize: '100% 100%', position: 'relative', width: '765px', height: '398px' }">
          <div class="summary">
            <div>监测设备</div>
            <div>设备在线率</div>
            <div>当前预警</div>
            <span style="width:56px;color: #0F89C8;">{{ item.devNum }}</span>
            <span style="width:60px;color: #3CDB95;">{{ item.devBasicCover }}%</span>
            <span style="width:56px;color: #FF6C00;">{{ item.warnCount }}</span>
          </div>
          <div :title="i.pnName" :class="['title-info', {hidden: i.configId === select.configId}]" v-for="i in item.config" :key="i.configId + 'index'" :style="{position: 'absolute', left: (i.xaxis - 5) + 'px', top: (i.yaxis - 40) + 'px'}">{{ i.pnName }}</div>
          <div @click="(e)=>{ showDetail(e, i) }" v-for="i in item.config" :key="i.configId" :style="{ width: i.width - 22 + 'px', height: i.height - 22 + 'px', backgroundImage: 'url(' + i.path + ')', backgroundSize: 'contain', position: 'absolute', left: i.xaxis + 'px', top: i.yaxis + 'px' }">
          </div>
        </div>
      </div>
        <!-- <a-tabs type="card">
          <a-tab-pane v-for="item in data" :key="item.sceneId" :tab="item.sceneName" style="text-align: center;">
            <div :style="{ backgroundImage: 'url(' + item.path + ')', backgroundSize: 'contain', display: 'inline-block', position: 'relative', width: '900px', height: '600px' }">
              <div v-for="i in item.config" :key="i.configId + 'index'" :style="{position: 'absolute', left: i.xaxis + 'px', top: (i.yaxis - 30) + 'px', background: 'aliceblue'}">{{ i.pnName }}</div>
              <div @click="(e)=>{ showDetail(e, i) }" v-for="i in item.config" :key="i.configId" :style="{ width: i.width + 'px', height: i.height + 'px', backgroundImage: 'url(' + i.path + ')', backgroundSize: 'contain', position: 'absolute', left: i.xaxis + 'px', top: i.yaxis + 'px' }">
              </div>
            </div>
          </a-tab-pane>
        </a-tabs> -->
    </div>
    <div class="pointer_info Monitor" :style="{ left: (select.xaxis + 70) + 'px', top: (select.yaxis + 66) + 'px', display: select.display }">
      <div class="a-row">
        <div class="popupheader">
          <div class="point"></div>
          <span class="popuptitle" :title="select.pnName">{{ select.pnName }}</span>
          <div class="detailbutton Monitor" @click="showMDetail">详情</div>
        </div>
        <!-- <div class="" style="text-align: left;"><div class="point"></div></div> -->
        <!-- <div class="ant-col ant-col-14 ant-col-content"><a @click="showMDetail">详情</a></div> -->
        <div class="popupcontent">
          <div>
            <div class="ant-col ant-col-10" style="text-align: left;">设备类型</div>
            <div class="ant-col ant-col-14 ant-col-content" :title="select.devModelName">{{ select.devModelName }}</div>
            <div class="ant-col ant-col-10" style="text-align: left;">设备编号</div>
            <div class="ant-col ant-col-14 ant-col-content" :title="select.devCode">{{ select.devCode }}</div>
            <div class="ant-col ant-col-10" style="text-align: left;">设备状态</div>
            <div class="ant-col ant-col-14 ant-col-content" :title="select.devstatus" style="color:#02CDAB">{{ select.devstatus }}</div>
            <div class="ant-col ant-col-10" style="text-align: left;">预警状态</div>
            <div class="ant-col ant-col-14 ant-col-content" :title="select.warnStatus" style="color:#FF6C00">{{ select.warnStatus }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'design',
  components: {

  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    
  },
  data () {
    return {
      select: {
        xaxis: 0,
        yaxis: 0,
        display: 'none'
      },
      activeKey: ''
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
      this.$emit('show', this.select.projectId, this.select.hiddenId, this.select.projPnId)
    },
    cancelModel () {
      this.$emit('onClose')
    },
    showDetail (e, obj) {
      let status = ''
      let num = ''
      let warnStatus = this.getWarnType(obj.status)
      if (obj.bonline === '') {
        status = '未绑定设备'
      } else {
        status = obj.bonline === 0 ? '在线' : '离线'
      }
      if (obj.devCode === '') {
        num = '无'
      } else {
        num = obj.devCode
      }
      this.select = { ...obj, display: 'block', devstatus: status, num: num, warnStatus: warnStatus}
      e.stopPropagation()
    },
    onClick () {
      this.select = {
        xaxis: 0,
        yaxis: 0,
        display: 'none'
      }
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
    margin-top: 20px;
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
  }
  .title-info.hidden {
    display: none;
  }
  .pointer_info {
    position: absolute;
    display: none;
    width: 305px;
    height: 180px;
    line-height: 24px;
    background: white;
    background-position: center;
    background-size: 100% 100%;
  }
</style>
