<template>
  <!--雨情监测-->
  <div class="rainTabs">
    <a-tabs default-active-key="1" @change="callback" class="tabs">
      <a-tab-pane key="1" tab="雨情监测1">
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

    }
  },
  methods: {
    callback (key) {
      this.pointId = key
    }
  }
}
</script>

<style lang="less" scoped>
.rainTabs{
  width:100%;
}
</style>
