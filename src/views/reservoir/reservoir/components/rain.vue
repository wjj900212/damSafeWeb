<template>
  <a-card title="雨情监测">
    <a slot="extra" href="#">查看详情</a>
    <a-card-grid style="width: 100%; text-align: left">
      <a-row>
        <a-col :span="2">
          <img width="36" height="34" src="static/img/u295.png" alt="" />
        </a-col>
        <a-col :span="22">
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
            <a-col :span="4"> 安全状态 </a-col>
            <a-col :span="3" :style="{color: getText(rainData.safeStatus).color}"> {{getText(rainData.safeStatus).name}} </a-col>
            <a-col :span="4"> 当前降水量 </a-col>
            <a-col :span="3"> {{rainData.current}}</a-col>
            <a-col :span="4"> 日降水量 </a-col>
            <a-col :span="6"> {{rainData.dayRain}}</a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-card-grid>
    <a-card-grid style="width: 100%; text-align: center">
      <div :style="{ width: '100%', height: '320px' }">
        <component
          :is="'EchartsBarLine'"
          refid="BarLine"
          :cordon="cordon"
          :rainfall="rainfall"
          :totalRainfall="totalRainfall"
          class="main-content"
        ></component>
      </div>
    </a-card-grid>
  </a-card>
</template>
<script>
import EchartsBarLine from '@/components/echarts/EchartsBarLine.vue'
import {getText} from '@/utils/utils'

export default {
  name: 'rain',
  components: {
    EchartsBarLine
  },
  props: {
    List: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      select: {},
      rainData: {},
      cordon: [],
      rainfall: [],
      totalRainfall: [],
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
      if (this.monitor) {
        this.getStatistics(this.monitor)
      }
    }
  },
  methods: {
    getText (str) {
      return getText(str)
    },
    changeHidden (item) {
      this.select = item
    },
    handleMonitorChange (value) {
      this.getStatistics(value)
    },
    getStatistics (projPnId) {
      const params = {
        projPnId: projPnId
      }
      this.$get('web/reservoirOverview/yqStatistics', {
        ...params
      }).then((r) => {
        if (r.data.data !== null) {
          let data = r.data.data
          this.rainData = data
          this.cordon = data.cordon
          this.rainfall = data.rainfall
          this.totalRainfall = data.totalRainfall
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
