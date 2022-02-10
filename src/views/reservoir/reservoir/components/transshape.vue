<template>
  <a-card>
    <div class="safetyPlan">
      <div class="card">
        <img src="static/img/control/图层1412.png"/>
        <span>变形监测</span>
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
      <div style="display: flex;">
        <div style="width:20%;">最大位移值:</div>
        <div class="warn-value">
          <span>位移X （东）{{ info.maxx }}mm </span>
          <span>位移Y （北）{{ info.maxy }}mm </span>
          <span>位移Z （高）{{ info.maxz }}mm </span>
        </div>
      </div>
    </div>
    <!--<a-card-grid style="width: 100%; text-align: left">
      <a-row>
        <a-col :span="3">
          <img width="36" height="34" src="static/img/u209.png" alt="" />
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
            <a-col :span="16"><span :style="{ color: info.color }">{{ info.safeStatusText }}</span></a-col>
          </a-row>
          <a-row>
            <a-col :span="8"> 最大位移值 </a-col>
            <a-col :span="16">
              <a-row>
                <a-col :span="24">位移X （东）{{ info.maxx }}mm </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">位移Y （北）{{ info.maxy }}mm </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">位移Z （高）{{ info.maxz }}mm </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-card-grid>-->
    <div style="width: 100%; text-align: center;height:400px;">
      <component :is="componentName" :refid="'bxchart'" :markLine="markLine" :name="name" :data="data" class="main-content"></component>
    </div>
  </a-card>
</template>
<script>
import EchartsWave from '@/components/echarts/EchartsWave.vue'
import { getText } from '@/utils/utils'
export default {
  name: 'transfusion',
  components: {
    EchartsWave
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
      this.$get('web/reservoirOverview/bxStatistics', {
        ...params
      }).then((r) => {
        if (r.data.data !== null) {
          let data = r.data.data
          data.color = getText(data.safeStatus).color
          data.safeStatusText = getText(data.safeStatus).name
          this.info = data
          this.data = data.xlist.map((item, index) => {
            return [item, data.ylist[index], data.zlist[index]]
          })
          console.log('变形监测数据', this.data)
          // this.data = data.xlist
          // this.markLine = data.cordon
          this.componentName = 'EchartsWave'
          this.name = '位移（mm）'
          // this.piezometricList = data
          // this.treeData = data.treeData
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
