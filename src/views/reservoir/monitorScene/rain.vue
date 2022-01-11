<template>
  <!--雨情监测-->
  <div class="rainTabs">
    <a-tabs :default-active-key="rainScene[0].id" @change="callback" class="tabs">
      <a-tab-pane v-for="rain in rainScene" :key="rain.id" :tab="rain.name">
      </a-tab-pane>
    </a-tabs>
    <div class="com">
      <rain-monitor
        :pointId="pointId"
      ></rain-monitor>
    </div>
  </div>
</template>

<script>
import RainMonitor from './rainMonitor/rainMonitor'
export default {
  name: 'rain',
  components: {
    RainMonitor
  },
  data () {
    return {
      rainScene: [],
      pointId: -1
    }
  },
  mounted () {
    this.getHiddenListByReservoir()
  },
  methods: {
    callback (key) {
      this.pointId = key
    },
    // 获取水库下的场景
    getHiddenListByReservoir (params = {}) {
      params.reservoirId = 9
      params.type = 15
      this.$get('web/monitorScene/getHiddenListByReservoirId', {...params}).then((res) => {
        if (res.data.code === 1) {
          this.pointId = res.data.data[0].id
          this.rainScene = res.data.data
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
