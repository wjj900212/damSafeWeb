<template>
  <a-card title="渗压监测">
    <a slot="extra" href="#">查看详情</a>
    <a-card-grid style="width: 100%; text-align: left">
      <a-row>
        <a-col :span="3">
          <img width="36" height="34" src="static/img/u550.png" alt="" />
        </a-col>
        <a-col :span="21">
          <a-row>
            <a-col :span="12">
              <a-dropdown :trigger="['click']">
                <h4 style="float: left; cursor: pointer">
                  {{ select.hiddenName
                  }}<a-icon style="margin-left: 5px" type="caret-down" />
                </h4>
                <a-menu slot="overlay">
                  <a-menu-item
                    @click="changeHidden(item)"
                    v-for="item in List"
                    :key="item.hiddenId"
                  >
                    {{ item.hiddenName }}
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-col>
            <a-col :span="12" :style="{ textAlign: 'right' }">
              <a-select
                v-model="monitor"
                placeholder="监测点"
                option-filter-prop="children"
                @change="handleMonitorChange"
              >
                <a-select-option
                  v-for="item in monitorData"
                  :value="item.sceneId"
                  :key="item.sceneId"
                >
                  {{ item.sceneName }}
                </a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8"> 安全状态 </a-col>
            <a-col :span="16"> <span :style="{ color: info.color }">{{ info.safeStatusText }}</span> </a-col>
          </a-row>
          <a-row>
            <a-col :span="8"> 水位高程 </a-col>
            <a-col :span="16">
              <a-row>
                <a-col v-for="(sw, index) in info.height" :key="'sw' + index" :span="8"> {{ sw }} </a-col>
                <!-- <a-col :span="8">34m(坝中) </a-col>
                <a-col :span="8">23m(坝底)</a-col> -->
              </a-row>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8"> 水头 </a-col>
            <a-col :span="16">
              <a-row>
                <a-col v-for="(st, index) in info.waterDistance" :key="'st' + index" :span="8">{{ st }}</a-col>
                <!-- <a-col :span="8">5m(坝顶) </a-col>
                <a-col :span="8">4m(坝中) </a-col>
                <a-col :span="8">3m(坝底)</a-col> -->
              </a-row>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-card-grid>
    <a-card-grid style="width: 100%; text-align: center;height:400px;">
      <component :is="componentName" :refid="'sychart'" :markLine="markLine" :name="name" :data="data" class="main-content"></component>
    </a-card-grid>
  </a-card>
</template>
<script>
import EchartsArr from "@/components/echarts/EchartsArr.vue";
import { getText } from "@/utils/utils";
export default {
  name: "piezometric",
  components: {
    EchartsArr,
  },
  props: {
    List: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      componentName: '',
      markLine: [],
      info: {},
      name: '',
      select: {},
      data: [],
      monitor: undefined,
      monitorData: [],
    };
  },
  computed: {},
  mounted() {
    this.select = this.List.length > 0 ? this.List[0] : {};
    this.monitorData = this.select.sceneList || [];
    this.monitor =
      this.monitorData.length > 0 ? this.monitorData[0].sceneId : undefined;
  },
  updated() {},
  watch: {
    List(val) {
      this.select = val.length > 0 ? val[0] : {};
      this.monitorData = this.select.sceneList || [];
      this.monitor =
        this.monitorData.length > 0 ? this.monitorData[0].sceneId : undefined;
    },
    monitor (val) {
      this.getStatistics(this.monitor)
    }
  },
  methods: {
    changeHidden(item) {
      this.select = item;
    },
    handleMonitorChange(value) {
      this.getStatistics(value)
    },
    getStatistics (projPnId) {
      const params = {
        projPnId: projPnId
      }
      this.$get('web/reservoirOverview/syStatistics', {
        ...params,
      }).then((r) => {
        if (r.data.data !== null) {
          let data = r.data.data
          data.color = getText(data.safeStatus).color
          data.safeStatusText = getText(data.safeStatus).name
          this.info = data
          this.data = data.xlist
          // // this.markLine = data.warnflow
          this.componentName = 'EchartsArr'
          this.name = '水位高程（m）'
          // this.piezometricList = data
          // this.treeData = data.treeData
        }
      })
    }
  },
};
</script>

<style lang="less" scoped>
</style>
