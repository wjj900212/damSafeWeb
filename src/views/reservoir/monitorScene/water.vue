<template>
  <!-- 水情监测 -->
  <div class="tabs">
    <a-tabs default-active-key="1" @change="callback" class="tabsBox">
      <a-tab-pane v-for="v in hiddenArr" :key="v.id" :tab="v.name">
      </a-tab-pane>
    </a-tabs>
    <div class="com">
      <a-row :gutter="24" :style="{ marginBottom: '24px' }">
        <a-col :span="12">
          <!-- 基本信息 -->
          <overview :hiddenId="hiddenId" :hiddenMsg="hiddenMsg" :pnList="hiddenMsg.pnList" />
        </a-col>
        <a-col :span="12">
          <!-- 场景可视化 -->
          <visual :hiddenId="hiddenId" />
        </a-col>
      </a-row>
      <a-row :gutter="24" :style="{ marginBottom: '24px' }">
        <a-col :span="24">
          <!-- 库水位趋势统计 -->
          <trend-statistic :hiddenId="hiddenId" :pnList="hiddenMsg.pnList" style="width:100%" />
        </a-col>
      </a-row>
      <a-row :gutter="24" :style="{ marginBottom: '24px' }">
        <a-col :span="24">
          <!-- 水位库容曲线 -->
          <storageCapacity :waterValue="hiddenMsg" style="width:100%;" />
        </a-col>
      </a-row>
      <a-row :gutter="24" :style="{ marginBottom: '24px' }">
        <a-col :span="12">
          <!-- 预警信息 -->
          <warnMsg :hiddenId="hiddenId" />
        </a-col>
        <a-col :span="12">
          <!-- 运维记录 -->
          <record :hiddenId="hiddenId" />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  import overview from "./waterMonitor/overview.vue" //基本信息
  import visual from "./waterMonitor/visual.vue" //场景可视化
  import trendStatistic from "./waterMonitor/trendStatistic.vue" // 库水位趋势统计
  import storageCapacity from "./waterMonitor/storageCapacity.vue" // 水位库容曲线
  import warnMsg from "@/components/warnMsg/warnMsg.vue" // 预警信息
  import record from "@/components/devopsRecord/record.vue" // 运维记录
  export default {
    components: {
      overview,
      visual,
      trendStatistic,
      storageCapacity,
      warnMsg,
      record
    },
    data() {
      return {
        text: '',
        hiddenId: '',
        hiddenArr: [],
        hiddenMsg: {}
      };
    },
    computed: {
      ...mapState({
        reservoirId: state => state.account.reservoirId
      }),
    },
    watch: {
      reservoirId(n) {
        this.getHiddenArr()
      }
    },
    methods: {
      callback(key) {
        // console.log(key);
        this.hiddenId = key
        this.getHiddenMsg()
      },
      getHiddenArr() {
        let param = {
          reservoirId: this.reservoirId, //水库id
          type: 16 //16 水情
        }
        this.hiddenArr = []
        this.hiddenId = ''
        this.hiddenMsg = {}
        this.$get("/web/monitorScene/getHiddenListByReservoirId", param).then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return
          }
          if (rr.data.length == 0) {
            this.$message.warning('暂无水情监测点')
            return false
          }
          this.hiddenArr = rr.data.map(v => {
            return {
              id: v.id,
              name: v.name
            }
          })
          this.hiddenId = rr.data[0].id
          this.getHiddenMsg()
        })
      },
      // 获取隐患点信息
      getHiddenMsg() {
        this.$get("/web/monitorScene/monitorConditionWater?hiddenId=" + this.hiddenId).then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return
          }
          this.hiddenMsg = rr.data
        })
      }
    },
    mounted() {
      this.getHiddenArr()
    }
  };

</script>

<style scoped>
  .tabs {
    width: 100%;
  }
  .tabsBox{
    background-color: #fff;
  }

  .com {
    width: 100%;
    margin-top: 1rem;
    /* display: flex;
    justify-content: space-between;
    flex-wrap: wrap; */
  }

</style>
