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
        <a-card title="雨情监测">
          <a slot="extra" href="#">查看详情</a>
          <a-card-grid style="width: 100%; text-align: left">
            <a-row>
              <a-col :span="2">
                <img width="36" height="34" src="static/img/u295.png" alt="" />
              </a-col>
              <a-col :span="19">
                <a-row>
                  <a-col>
                    <h4 style="float: left">雨情</h4>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="4"> 安全状态 </a-col>
                  <a-col :span="3"> 正常 </a-col>
                  <a-col :span="4"> 当前降水量 </a-col>
                  <a-col :span="3"> 29.2mm </a-col>
                  <a-col :span="4"> 日降水量 </a-col>
                  <a-col :span="6"> 52.2mm </a-col>
                </a-row>
              </a-col>
              <a-col :span="3">
                <a-select
                  v-model="monitor"
                  placeholder="监测点"
                  option-filter-prop="children"
                  @change="handleMonitorChange"
                >
                  <a-select-option
                    v-for="item in monitorData"
                    :value="item.id"
                    :key="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-card-grid>
          <a-card-grid style="width: 100%; text-align: center">
            <div :style="{ width: '100%', height: '320px' }">
              <component
                :is="'EchartsBarLine'"
                refid="BarLine"
                :data="radarData"
                class="main-content"
              ></component>
            </div>
          </a-card-grid>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="水情监测">
          <a slot="extra" href="#">查看详情</a>
          <a-card-grid style="width: 100%; text-align: left">
            <a-row>
              <a-col :span="2">
                <img width="36" height="34" src="static/img/u319.png" alt="" />
              </a-col>
              <a-col :span="19">
                <a-row>
                  <a-col>
                    <h4 style="float: left">水情</h4>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="4"> 安全状态 </a-col>
                  <a-col :span="3"> 正常 </a-col>
                  <a-col :span="4"> 当前水位 </a-col>
                  <a-col :span="3"> 29.2mm </a-col>
                  <a-col :span="5"> 历史最大水位 </a-col>
                  <a-col :span="5"> 39.2mm </a-col>
                </a-row>
              </a-col>
              <a-col :span="3">
                <a-select
                  v-model="monitor"
                  placeholder="监测点"
                  option-filter-prop="children"
                  @change="handleMonitorChange"
                >
                  <a-select-option
                    v-for="item in monitorData"
                    :value="item.id"
                    :key="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-card-grid>
          <a-card-grid style="width: 100%; text-align: center"></a-card-grid>
        </a-card>
      </a-col>
    </a-row>
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="24">
        <a-card title="微动监测数据统计">
          <div slot="extra">
            <a-button type="primary"> 查询 </a-button>
            <a-button type="primary"> 导出 </a-button>
          </div>
          <a-card-grid style="width: 100%; text-align: center">

          </a-card-grid>
        </a-card>
      </a-col>
    </a-row>
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="8">
        <a-card title="渗流监测">
          <a slot="extra" href="#">查看详情</a>
          <a-card-grid style="width: 100%; text-align: left">
            <a-row>
              <a-col :span="3">
                <img width="36" height="34" src="static/img/u309.png" alt="" />
              </a-col>
              <a-col :span="15">
                <a-row>
                  <a-col>
                    <h4 style="float: left">渗流</h4>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="8"> 安全状态 </a-col>
                  <a-col :span="16"> 正常 </a-col>
                </a-row>
                <a-row>
                  <a-col :span="8"> 当前降水量 </a-col>
                  <a-col :span="16"> 29.2mm </a-col>
                </a-row>
                <a-row>
                  <a-col :span="8"> 日降水量 </a-col>
                  <a-col :span="16"> 52.2mm </a-col>
                </a-row>
              </a-col>
              <a-col :span="6">
                <a-select
                  v-model="monitor"
                  placeholder="监测点"
                  option-filter-prop="children"
                  @change="handleMonitorChange"
                >
                  <a-select-option
                    v-for="item in monitorData"
                    :value="item.id"
                    :key="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-card-grid>
          <a-card-grid style="width: 100%; text-align: center"></a-card-grid>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="渗压监测">
          <a slot="extra" href="#">查看详情</a>
          <a-card-grid style="width: 100%; text-align: left">
            <a-row>
              <a-col :span="3">
                <img width="36" height="34" src="static/img/u550.png" alt="" />
              </a-col>
              <a-col :span="15">
                <a-row>
                  <a-col>
                    <h4 style="float: left">240断面渗压</h4>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="8"> 安全状态 </a-col>
                  <a-col :span="16"> 正常 </a-col>
                </a-row>
                <a-row>
                  <a-col :span="8"> 水位高程 </a-col>
                  <a-col :span="16">
                    <a-row>
                      <a-col :span="8">45m(坝顶) </a-col>
                      <a-col :span="8">34m(坝中) </a-col>
                      <a-col :span="8">23m(坝底)</a-col>
                    </a-row>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="8"> 水头 </a-col>
                  <a-col :span="16">
                    <a-row>
                      <a-col :span="8">5m(坝顶) </a-col>
                      <a-col :span="8">4m(坝中) </a-col>
                      <a-col :span="8">3m(坝底)</a-col>
                    </a-row>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="6">
                <a-select
                  v-model="monitor"
                  placeholder="监测点"
                  option-filter-prop="children"
                  @change="handleMonitorChange"
                >
                  <a-select-option
                    v-for="item in monitorData"
                    :value="item.id"
                    :key="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-card-grid>
          <a-card-grid style="width: 100%; text-align: center"></a-card-grid>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="变形监测">
          <a slot="extra" href="#">查看详情</a>
          <a-card-grid style="width: 100%; text-align: left">
            <a-row>
              <a-col :span="3">
                <img width="36" height="34" src="static/img/u209.png" alt="" />
              </a-col>
              <a-col :span="15">
                <a-row>
                  <a-col>
                    <h4 style="float: left">变形监测-01</h4>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="8"> 安全状态 </a-col>
                  <a-col :span="16"> 正常 </a-col>
                </a-row>
                <a-row>
                  <a-col :span="8"> 最大位移值 </a-col>
                  <a-col :span="16">
                    <a-row>
                      <a-col :span="24">位移X （东）+0.2mm </a-col>
                    </a-row>
                    <a-row>
                      <a-col :span="24">位移Y （北）+0.2mm </a-col>
                    </a-row>
                    <a-row>
                      <a-col :span="24">位移Z （高）+0.2mm </a-col>
                    </a-row>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="6">
                <a-select
                  v-model="monitor"
                  placeholder="监测点"
                  option-filter-prop="children"
                  @change="handleMonitorChange"
                >
                  <a-select-option
                    v-for="item in monitorData"
                    :value="item.id"
                    :key="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-card-grid>
          <a-card-grid style="width: 100%; text-align: center"></a-card-grid>
        </a-card>
      </a-col>
    </a-row>
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="12">
        <a-card>
          <div slot="title">
            <span>预警消息</span
            ><span style="font-size: 10px; margin-left: 10px; color: darkgray"
              >今日 246条消息</span
            >
          </div>
          <a slot="extra" href="#">更多消息</a>
          <a-card-grid style="width: 100%; text-align: center; padding: 0px">
            <a-list bordered :dataSource="warnData">
              <a-list-item slot="renderItem" slot-scope="item">
                {{ item }}
              </a-list-item>
            </a-list>
          </a-card-grid>
        </a-card>
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
import EchartsBarLine from "@/components/echarts/EchartsBarLine.vue";
import { mapState } from 'vuex'
import moment from "moment";
import SafetyPlan from './components/safetyPlan.vue';
import trend from './components/trend.vue'

export default {
  name: "generalview",
  components: {
    EchartsBarLine,
    safetyOverview,
    scene,
    SafetyPlan,
    trend
  },
  data() {
    return {
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
      monitorData: [
        { id: 1, name: "监测点1" },
        { id: 2, name: "监测点2" },
        { id: 3, name: "监测点3" },
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
  },
  watch: {
    reservoirId (val) { // 监听数据发生改变 刷新图表数据
      this.getReservoirInfo()
      this.getDesignConfig()
      this.getPlanList()
      this.getTrendStatistics()
      this.getProjPnTreeList()
    }
  },
  updated() {},
  methods: {
    moment,
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
    handleMonitorChange() {},
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
