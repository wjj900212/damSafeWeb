<template>
  <div style="width: 100%; height: 100%">
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="12" :style="{ height: '100%' }">
        <safetyOverview :reservoirInfo="reservoirInfo" :radarData="radarData"></safetyOverview>
      </a-col>
      <a-col :span="12" :style="{ height: '100%' }">
        <scene :sceneData="sceneData"></scene>
      </a-col>
    </a-row>
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="24">
        <safetyPlan :aqglyadataSource="aqglyadataSource" @getPlanList="getPlanList"></safetyPlan>
      </a-col>
    </a-row>
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="24">
        <trend :relationshipData="relationshipData" :treeData="treeData" @exportEXcel="exportEXcel" @getTrendStatistics="getTrendStatistics"></trend>
      </a-col>
    </a-row>
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="12">
        <rain :List="rainList"></rain>
      </a-col>
      <a-col :span="12">
        <water :List="waterList"></water>
      </a-col>
    </a-row>
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="24">
        <jogging :List="joggingList" @getMonitorList="getMonitorList" :targetList="targetList"></jogging>
      </a-col>
    </a-row>
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="8">
        <transfusion :List="transfusionList"></transfusion>
      </a-col>
      <a-col :span="8">
        <piezometric :List="piezometricList"></piezometric>
      </a-col>
      <a-col :span="8">
        <transshape :List="transshapeList"></transshape>
      </a-col>
    </a-row>
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="12">
        <div>
          <warn :reservoirId="reservoirId"></warn>
        </div>
      </a-col>
      <a-col :span="12">
        <a-card title="运维记录">
          <a slot="extra" href="#">查看更多</a>
          <a-card-grid style="width: 100%; text-align: center"></a-card-grid>
        </a-card>
      </a-col>
    </a-row>

  </div>
</template>
<script>

import safetyOverview from "./components/safetyOverview.vue"
import scene from "./components/scene.vue"
import { mapState } from 'vuex'
import moment from "moment";
import SafetyPlan from './components/safetyPlan.vue';
import trend from './components/trend.vue'
import rain from './components/rain.vue'
import water from './components/water.vue';
import transfusion from './components/transfusion.vue';
import piezometric from './components/piezometric.vue';
import transshape from './components/transshape.vue';
import jogging from './components/jogging.vue';
import warn from './components/warn.vue';

export default {
  name: "generalview",
  components: {
    safetyOverview,
    scene,
    SafetyPlan,
    trend,
    rain,
    water,
    transfusion,
    piezometric,
    transshape,
    jogging,
    warn
  },
  data() {
    return {
      rainList: [],
      rainData: [],
      waterList: [],
      waterData: [],
      transfusionList: [],
      transfusionData: [],
      piezometricList: [],
      piezometricData: [],
      transshapeList: [],
      transshapeData: [],
      joggingList: [],
      joggingData: [],
      targetList: [],
      reservoirInfo: {},
      radarData: [],
      relationshipData: [],
      warnData: [],
      monitor: 1,
      monitorData: [],
      dataSource: [],
      treeData: [],
      aqglyadataSource: [],
      sceneData: [],
      /*monitorData: [
        { id: 1, name: "监测点1" },
        { id: 2, name: "监测点2" },
        { id: 3, name: "监测点3" },
      ],*/
      sceneType: [
        { id: 11, name: "渗流监测" },
        { id: 12, name: "渗压监测" },
        { id: 13, name: "大坝变形监测" },
        { id: 14, name: "大坝微动监测" },
        { id: 15, name: "雨情监测" },
        { id: 16, name: "水情监测" }
      ],
    };
  },
  computed: {
    ...mapState({
      reservoirId: state => state.account.reservoirId
    }),
  },
  mounted() {
    this.getReservoirInfo()
    this.getDesignConfig()
    this.getPlanList()
    this.getTrendStatistics()
    this.getProjPnTreeList()
    this.getProjPnidsGroup()
    this.getSectionList()
  },
  watch: {
    reservoirId (val) { // 监听数据发生改变 刷新图表数据
      this.getReservoirInfo()
      this.getDesignConfig()
      this.getPlanList()
      this.getTrendStatistics()
      this.getProjPnTreeList()
      this.getProjPnidsGroup()
      this.getSectionList()
    }
  },
  updated() {},
  methods: {
    moment,
    getMonitorList (pnId) {
      const params = {
        pnId: pnId
      }
      this.$get('web/monitorScene/getDevBasicTargetByPnId', {
        ...params,
      }).then((r) => {
        if (r.data.data !== null) {
          let data = r.data.data
          this.targetList = data
          // this.treeData = data.treeData
        }
      })
    },
    handleMonitorChange (value) {
    },
    getSectionList () {
      const { reservoirId } = this
      const params = {
        reservoirId: reservoirId
      }
      this.$get('web/reservoirOverview/getSectionList', {
        ...params,
      }).then((r) => {
        if (r.data.data !== null) {
          let data = r.data.data
          this.piezometricList = data
          // this.treeData = data.treeData
        }
      })
    },
    getProjPnidsGroup () {
      const { reservoirId } = this
      const params = {
        reservoirId: reservoirId
      }
      this.$get('web/reservoirOverview/getProjPnidsGroup', {
        ...params,
      }).then((r) => {
        if (r.data.data !== null) {
          let data = r.data.data
          this.rainList = data.find(item => item.typeId === 15) ? data.find(item => item.typeId === 15).hiddenList : []
          this.waterList = data.find(item => item.typeId === 16) ? data.find(item => item.typeId === 16).hiddenList : []
          this.transfusionList = data.find(item => item.typeId === 11) ? data.find(item => item.typeId === 11).hiddenList : []
          this.transshapeList = data.find(item => item.typeId === 13) ? data.find(item => item.typeId === 13).hiddenList : []
          this.joggingList = data.find(item => item.typeId === 14) ? data.find(item => item.typeId === 14).hiddenList : []
          let obj = this.joggingList.length > 0 ? this.joggingList[0] : {}
          let pnList = obj.pnList || []
          let pnId = pnList.length > 0 ? pnList[0].projPnId : undefined
          if (pnId) {
            this.getMonitorList(pnId)
          }
          // this.treeData = data.treeData
        }
      })
    },
    getProjPnTreeList () {
      const { reservoirId } = this
      const params = {
        reservoirId: reservoirId
      }
      this.$get('web/reservoirOverview/getProjPnList', {
        ...params,
      }).then((r) => {
        if (r.data.data !== null) {
          let data = r.data.data
          this.treeData = data.treeData
        }
      })
    },
    getDesignConfig () {
      const { reservoirId } = this
      const params = {
        hiddenId: reservoirId,
        sceneType: '0'
      }
      this.$get('web/hiddenScene/getHiddenConfigInfo', {
        ...params,
      }).then((r) => {
        if (r.data.data !== null) {
          let data = r.data.data
          this.sceneData = data
          // data.safeLevelObj = this.getWarnText(data.safeLevel)
          // this.reservoirInfo = data
          // this.radarData = data.monitorList
        }
      })
    },
    exportEXcel(dataobj) {
      const { reservoirId } = this
      let dateTimeValue = [
        moment(new Date(), "YYYY-MM-DD"),
        moment(new Date(), "YYYY-MM-DD"),
      ]
      let params = {}
      if (dataobj) {
        params = {
          reservoirId: reservoirId,
          ...dataobj
        }
      } else {
        const start = moment(dateTimeValue[0]).format("YYYY-MM-DD");
        const end = moment(dateTimeValue[1]).format("YYYY-MM-DD");
        params = {
          reservoirId: reservoirId,
          startTime: start,
          endTime: end
        }
      }
      this.$export("web/reservoirOverview/exportStatistics", {
        ...params,
      }).then((r) => {
        // this.$message.success('导出成功')
      });
    },
    getReservoirInfo () {
      const { reservoirId } = this
      const params = {
        reservoirId: reservoirId
      }
      this.$get('web/reservoirOverview/safetyOverview', {
        ...params,
      }).then((r) => {
        if (JSON.stringify(r.data.data) !== "{}" && r.data.data !== null) {
          let data = r.data.data
          // data.safeLevelObj = this.getWarnText(data.safeLevel)
          this.reservoirInfo = data
          this.radarData = data.monitorList
        } else {
          this.reservoirInfo = {}
          this.radarData = []
        }
      })
    },
    getWarnText () {
    },
    getTrendStatistics (dataobj) {
      const { reservoirId } = this
      let dateTimeValue = [
        moment(new Date(), "YYYY-MM-DD"),
        moment(new Date(), "YYYY-MM-DD"),
      ]
      let params = {}
      if (dataobj) {
        params = {
          reservoirId: reservoirId,
          ...dataobj
        }
      } else {
        const start = moment(dateTimeValue[0]).format("YYYY-MM-DD");
        const end = moment(dateTimeValue[1]).format("YYYY-MM-DD");
        params = {
          reservoirId: reservoirId,
          startTime: start,
          endTime: end
        }
      }
      this.$get('web/reservoirOverview/trendStatistics', {
        ...params,
      }).then((r) => {
        if (JSON.stringify(r.data.data) !== "{}" && r.data.data !== null) {
          this.relationshipData = r.data.data
        } else {
          this.relationshipData = []
        }
      })
    },
    getPlanList (type) {
      let params = {}
      if (type && type !== 'all') {
        params.reserveType = type
      }
      this.$get('web/reservoirPlan/getPlanListNoPage', {
        ...params,
      }).then((r) => {
        if (JSON.stringify(r.data.data) !== "{}" && r.data.data !== null) {
          this.aqglyadataSource = r.data.data
        } else {
          this.aqglyadataSource = []
        }
      })
    },
  },
};
</script>

<style lang="less" scoped>
</style>
