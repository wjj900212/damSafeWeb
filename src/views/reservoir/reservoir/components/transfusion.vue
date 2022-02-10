<template>
  <a-card>
    <div class="safetyPlan">
      <div class="card">
        <img src="static/img/control/图层1413.png"/>
        <span>渗流监测</span>
      </div>
      <a href="#">查看详情</a>
    </div>
    <div class="LR" style="padding:1rem;">
      <div>
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
      </div>
      <div>
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
      </div>
    </div>
    <div class="warn-info">
      <div><span>安全状态:</span><span :style="{ color: info.color }">{{ info.safeStatusText }}</span></div>
      <div><span>瞬时流量:</span><span class="warn-value">{{ info.flow }} </span></div>
      <div><span>水位差:</span><span class="warn-value">{{ info.waterLevel }} </span></div>
    </div>
    <div style="width: 100%; text-align: center;height:400px;">
      <component :is="componentName" :refid="'slchart'" :markLine="markLine" :name="name" :data="data" class="main-content"></component>
    </div>
  </a-card>
</template>
<script>
import EchartsoLine from '@/components/echarts/EchartsoLine.vue'
import { getText } from '@/utils/utils'
export default {
  name: 'transfusion',
  components: {
    EchartsoLine
  },
  props: {
    List: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      componentName: '',
      markLine: [],
      info: {},
      name: '',
      select: {},
      data: [],
      monitor: undefined,
      monitorData: []
    }
  },
  computed: {},
  mounted () {
    this.select = this.List.length > 0 ? this.List[0] : {}
    this.monitorData = this.select.pnList || []
    this.monitor =
      this.monitorData.length > 0 ? this.monitorData[0].projPnId : undefined
    if (this.monitor) {
      this.getStatistics(this.monitor)
    }
  },
  updated () {},
  watch: {
    List (val) {
      this.select = val.length > 0 ? val[0] : {}
      this.monitorData = this.select.pnList || []
      this.monitor =
        this.monitorData.length > 0 ? this.monitorData[0].projPnId : undefined
    },
    monitor (val) {
      this.getStatistics(this.monitor)
    }
  },
  methods: {
    changeHidden (item) {
      this.select = item
    },
    handleMonitorChange (value) {
      this.getStatistics(value)
    },
    getStatistics (projPnId) {
      if (projPnId === undefined) {
        return
      }
      const params = {
        projPnId: projPnId
      }
      this.$get('web/reservoirOverview/slStatistics', {
        ...params
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
  }
}
</script>

<style lang="less" scoped>
</style>
