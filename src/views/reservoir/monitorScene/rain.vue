<template>
  <!--雨情监测-->
  <div class="rainTabs">
    <a-tabs @change="callback" class="tabs">
      <a-tab-pane v-for="rain in rainScene" :key="rain.id" :tab="rain.name">
      </a-tab-pane>
    </a-tabs>
    <div class="com">
      <rain-monitor
        :hiddenId="hiddenId"
        :reservoirId="reservoirId"
      ></rain-monitor>
    </div>
  </div>
</template>

<script>
import RainMonitor from './rainMonitor/rainMonitor'
import { mapState } from 'vuex'
export default {
  name: 'rain',
  components: {
    RainMonitor
  },
  data () {
    return {
      rainScene: [], // 雨情监测场景列表
      hiddenId: -1 // 监测场景id
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
    }
  }
}
</script>

<style lang="less" scoped>
.rainTabs{
  width:100%;
}
</style>
