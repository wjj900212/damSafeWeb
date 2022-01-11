<template>
  <!-- 水情监测 -->
  <div class="tabs">
    <a-tabs default-active-key="1" @change="callback" class="tabs">
      <a-tab-pane key="1" tab="Tab 1">
      </a-tab-pane>
      <a-tab-pane key="2" tab="Tab 2">
      </a-tab-pane>
      <a-tab-pane key="3" tab="Tab 3">
      </a-tab-pane>
    </a-tabs>
    <div class="com">
      <overview :pointId="pointId" style="width:48%" />
      <visual :pointId="pointId" style="width:48%"/>
      <trend-statistic :pointId="pointId" style="width:100%"/>
      <storageCapacity :pointId="pointId" style="width:100%;"/>
      <warnMsg :pointId="pointId" style="width:48%"/>
      <record :pointId="pointId" style="width:48%"/>
    </div>
  </div>
</template>

<script>
  import overview from "@/components/waterMonitor/overview.vue"
  import visual from "@/components/waterMonitor/visual.vue"
  import trendStatistic from "@/components/waterMonitor/trendStatistic.vue"
  import storageCapacity from "@/components/waterMonitor/storageCapacity.vue"
  import warnMsg from "@/components/warnMsg/warnMsg.vue"
  import record from "@/components/devopsRecord/record.vue"
  export default {
    components: {
      overview,visual,trendStatistic,storageCapacity,warnMsg,record
    },
    data() {
      return {
        pointId: '1'
      };
    },
    methods: {
      callback(key) {
        // console.log(key);
        this.pointId = key
      },
    },
    mounted() {}
  };

</script>

<style scoped>
  .tabs {
    width: 100%;
  }

  .com {
    display: flex;
    /* align-items: center; */
    justify-content: space-between;
    flex-wrap: wrap;
  }

</style>
