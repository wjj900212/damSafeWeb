<template>
  <!-- 渗压监测 -->
  <div class="tabs Osmotic">
    <a-tabs default-active-key="1" @change="callback" class="tabsBox">
      <a-tab-pane v-for="v in hiddenArr" :key="v.id" :tab="v.name">
      </a-tab-pane>
    </a-tabs>
    <div class="com">
      <a-row :gutter="24" :style="{ marginBottom: '24px' }">
        <a-col :span="12">
          <!-- 基本信息 -->
          <overview :hiddenId="hiddenId" :overViewData="overViewData" :pnList="overViewData.pnList"></overview>
        </a-col>
        <a-col :span="12">
          <visual :hiddenId="hiddenId" :sceneList="overViewData.pnList"></visual>
        </a-col>
      </a-row>
      <a-row :gutter="24" :style="{ marginBottom: '24px' }">
        <a-col :span="24">
            <!-- 渗压监测趋势统计 -->
            <trendStatistic :hiddenId="hiddenId" :pnList="overViewData.pnList" />
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
  import overview from "./osmotic/overview.vue" // 基本信息
  import visual from "./osmotic/visual.vue" // 浸润线
  import trendStatistic from "./osmotic/trendStatistic.vue" // 渗压监测趋势统计 
  import warnMsg from "@/components/warnMsg/warnMsg.vue" // 预警信息
  import record from "@/components/devopsRecord/record.vue" // 运维记录
  export default {
    components: {
      overview,
      visual,
      trendStatistic,
      warnMsg,
      record
    },
    data() {
      return {
        text: '',
        hiddenId: '',
        hiddenArr: [],
        overViewData:{pnList:[],reservoirStatus:''}
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
        this.getMonitorCondition()
      },
      getHiddenArr() {
        let param = {
          reservoirId: this.reservoirId, //水库id
          type: 12 //12 渗压
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
            this.$message.warning('暂无渗压监测点')
            this.overViewData={pnList:[],reservoirStatus:''}
            this.hiddenId=''
            return false
          }
          this.hiddenArr = rr.data
          this.hiddenId = rr.data[0].id
          this.getMonitorCondition()
        })
      },
      
      //   查询基本信息
      getMonitorCondition() {
        let _this = this
        this.$get('/web/monitorScene/monitorConditionOsmotic', {
          hiddenId: _this.hiddenId
        }).then((res) => {
          if (res.data.code === 1) {
            _this.overViewData = res.data.data
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
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
    margin-top: 10px;
    /* display: flex;
    justify-content: space-between;
    flex-wrap: wrap; */
  }

</style>
