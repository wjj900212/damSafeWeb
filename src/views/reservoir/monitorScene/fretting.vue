<template>
  <!--微动监测-->
  <div class="rainTabs">
    <a-tabs @change="callback" class="tabsBox">
      <a-tab-pane v-for="rain in rainScene" :key="rain.id" :tab="rain.name">
      </a-tab-pane>
    </a-tabs>
    <div class="com">
      <a-row :gutter="24" :style="{ marginBottom: '24px' }">
        <a-col :span="12">
          <overview :data="overViewData"></overview>
        </a-col>
        <a-col :span="12">
          <scene :hiddenId="hiddenId"></scene>
        </a-col>
      </a-row>
      <a-row :gutter="24" :style="{ marginBottom: '24px' }">
        <a-col :span="24">
          <joggingStatistics :List="pnList" :hiddenId="hiddenId"></joggingStatistics>
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
import { mapState } from 'vuex'
import overview from './fretting/overview.vue'
import scene from './fretting/scene.vue'
import joggingStatistics from './fretting/joggingStatistics'
import WarnMsg from '@/components/warnMsg/warnMsg'
import Record from '@/components/devopsRecord/record'
export default {
  name: 'fretting',
  components: {
    overview,
    scene,
    joggingStatistics,
    WarnMsg,
    Record
  },
  data () {
    return {
      rainScene: [], // 渗流监测场景列表
      hiddenId: -1, // 监测场景id
      overViewData: {},
      pnList: []
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
    getMonitorConditionRain () {
      if (this.hiddenId === -1) {
        return;
      }
      this.$get('web/monitorScene/monitorConditionMove', {
        hiddenId: this.hiddenId
      }).then((res) => {
        if (res.data.code === 1) {
          this.overViewData = res.data.data
          this.pnList = res.data.data.pnList
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    callback (key) {
      this.hiddenId = key
    },
    // 获取水库下的场景
    getHiddenListByReservoir (params = {}) {
      params.reservoirId = this.reservoirId
      params.type = 14
      this.$get('web/monitorScene/getHiddenListByReservoirId', {...params}).then((res) => {
        if (res.data.code === 1) {
          this.hiddenId = res.data.data[0].id
          this.getMonitorConditionRain()
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
  @import "../../../../static/less/info.css";
  .rainTabs{
    width:100%;
  }
  .tabsBox{
    background-color: #fff;
  }
  .com {
    width: 100%;
    margin-top: 1rem;
  }
</style>
