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
      </a-row>
    </a-card-grid>
    <a-card-grid style="width: 100%; text-align: center"></a-card-grid>
  </a-card>
</template>
<script>
import EchartsBarLine from "@/components/echarts/EchartsBarLine.vue";
export default {
  name: "piezometric",
  components: {
    EchartsBarLine,
  },
  props: {
    List: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      select: {},
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
  },
  methods: {
    changeHidden(item) {
      this.select = item;
    },
    handleMonitorChange(value) {},
  },
};
</script>

<style lang="less" scoped>
</style>
