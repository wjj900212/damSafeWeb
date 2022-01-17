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
      </a-row>
    </a-card-grid>
    <a-card-grid style="width: 100%; text-align: center"></a-card-grid>
  </a-card>
</template>
<script>
import EchartsBarLine from "@/components/echarts/EchartsBarLine.vue";
export default {
  name: "transfusion",
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
