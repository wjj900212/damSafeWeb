<template>
  <a-card title="渗流监测">
    <a slot="extra" href="#">查看详情</a>
    <a-card-grid style="width: 100%; text-align: left">
      <a-row>
        <a-col :span="3">
          <img width="36" height="34" src="static/img/u309.png" alt="" />
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
                  :value="item.projPnId"
                  :key="item.projPnId"
                >
                  {{ item.projPnName }}
                </a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8"> 安全状态 </a-col>
            <a-col :span="16"> <span :style="{ color: info.color }">{{ info.safeStatusText }}</span> </a-col>
          </a-row>
          <a-row>
            <a-col :span="8"> 瞬时流量 </a-col>
            <a-col :span="16"> {{ info.flow }} </a-col>
          </a-row>
          <a-row>
            <a-col :span="8"> 水位差 </a-col>
            <a-col :span="16"> {{ info.waterLevel }} </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-card-grid>
    <a-card-grid style="width: 100%; text-align: center;height:400px;">
      <component :is="componentName" :refid="'slchart'" :markLine="markLine" :name="name" :data="data" class="main-content"></component>
    </a-card-grid>
  </a-card>
</template>
<script>
import EchartsoLine from "@/components/echarts/EchartsoLine.vue";
import { getText } from "@/utils/utils";
export default {
  name: "transfusion",
  components: {
    EchartsoLine,
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
    this.monitorData = this.select.pnList || [];
    this.monitor =
      this.monitorData.length > 0 ? this.monitorData[0].projPnId : undefined;
  },
  updated() {},
  watch: {
    List(val) {
      this.select = val.length > 0 ? val[0] : {};
      this.monitorData = this.select.pnList || [];
      this.monitor =
        this.monitorData.length > 0 ? this.monitorData[0].projPnId : undefined;
    },
    monitor () {
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
      this.$get('web/reservoirOverview/slStatistics', {
        ...params,
      }).then((r) => {
        if (r.data.data !== null) {
          let data = r.data.data
          data.color = getText(data.safeStatus).color
          data.safeStatusText = getText(data.safeStatus).name
          this.info = data
          this.data = data.list
          this.markLine = data.warnflow
          this.componentName = 'EchartsoLine'
          this.name = '瞬时流量（m³/s）'
        }
      })
    }
  },
};
</script>

<style lang="less" scoped>
</style>
