<template>
  <!--雨情监测-->
  <div class="rainTabs">
    <a-tabs @change="callback" class="tabs">
      <a-tab-pane v-for="rain in rainScene" :key="rain.id" :tab="rain.name">
      </a-tab-pane>
    </a-tabs>
    <div class="com">
      <a-row :gutter="24" :style="{ marginBottom: '24px' }">
        <a-col :span="12">
          <overview :hiddenId="hiddenId" :overViewData="overViewData" :pnList="overViewData.pnList"></overview>
        </a-col>
        <a-col :span="12">
          <visual :hiddenId="hiddenId"></visual>
        </a-col>
      </a-row>
      <a-row :gutter="24" :style="{ marginBottom: '24px' }">
        <a-col :span="24">
          <trendStatistic :hiddenId="hiddenId" :pnList="overViewData.pnList"></trendStatistic>
        </a-col>
      </a-row>
      <a-row :gutter="24" :style="{ marginBottom: '24px' }">
        <a-col :span="24">
          <weather :hiddenId="hiddenId"></weather>
        </a-col>
      </a-row>
      <a-row :gutter="24" :style="{ marginBottom: '24px' }">
        <a-col :span="12">
          <warn-msg :hiddenId="hiddenId"></warn-msg>
        </a-col>
        <a-col :span="12">
          <record :hiddenId="hiddenId"></record>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import overview from './rainMonitor/overview.vue'
import Visual from './rainMonitor/visual'
import TrendStatistic from './rainMonitor/trendStatistic'
import Weather from './rainMonitor/weather'
import WarnMsg from '@/components/warnMsg/warnMsg'
import Record from '@/components/devopsRecord/record'
import { mapState } from 'vuex'
export default {
  name: 'rain',
  components: {
    overview,
    Visual,
    TrendStatistic,
    Weather,
    WarnMsg,
    Record
  },
  data () {
    return {
      rainScene: [], // 雨情监测场景列表
      hiddenId: -1, // 监测场景id
      overViewData: {}
    }
  },
  computed: {
    ...mapState({
      reservoirId: state => state.account.reservoirId
    })
  },
  watch: {
    hiddenId (newVal) {
      this.hiddenId = newVal
      this.getMonitorConditionRain(newVal)
    },
    reservoirId (newVal) {
      if (newVal) {
        this.getHiddenListByReservoir()
      }
    }
  },
  mounted () {
    this.getHiddenListByReservoir()
  },
  methods: {
    callback (key) {
      this.hiddenId = key
    },
    // 获取水库下的场景
    getHiddenListByReservoir (params = {}) {
      params.reservoirId = this.reservoirId
      params.type = 15
      this.$get('web/monitorScene/getHiddenListByReservoirId', {...params}).then((res) => {
        if (res.data.code === 1) {
          this.hiddenId = res.data.data[0].id
          this.rainScene = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    getMonitorConditionRain (hiddenId) {
      let _this = this
      this.$get('web/monitorScene/monitorConditionRain', {
        hiddenId: hiddenId
      }).then((res) => {
        if (res.data.code === 1) {
          _this.overViewData = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.rainTabs{
  width:100%;
}
</style>
