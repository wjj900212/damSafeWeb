<template>
  <!-- 水情概况 -->
  <div style="width: 100%;">
    <a-card :bodyStyle="{ padding: '10px' }">
      <div class="safetyPlan">
        <div class="card">
          <img src="static/img/control/微动.png"/>
          <span>微动监测概况</span>
        </div>
        <a-button @click="safeVisible=true"> 安全管理预案
          <a-icon type="read" style="fontSize:1.6rem" />
        </a-button>
      </div>
      <div class="overview-top">
        <div class="overview-top-hidden">
          <div style="font-size: 1.6rem;font-weight: 400;display: flex;justify-content: flex-start;align-items: center;"><div style="width: 4px;height: 15px;background: #1890FF;margin-right:1rem;"></div><span style="color:#191E2A;">{{ data.hiddenName }}</span></div>
          <div>测站编码:<span style="color:#191E2A;">{{ data.stationCode }}</span></div>
          <div>建设时间:<span style="color:#191E2A;">{{ data.createTime }}</span></div>
          <div>联系人员:<span style="color:#191E2A;">{{ data.hiddenCharge || '无'}}</span></div>
        </div>
        <div class="overview-top-warn">
          <img v-if="data.reservoirStatus==='0'" src="static/img/正常.png"/>
          <img v-else-if="data.reservoirStatus==='1'" src="static/img/异常.png"/>
          <img v-else-if="data.reservoirStatus==='2'" src="static/img/险情.png"/>
          <div>
            <div :style="{ color: getText(data.reservoirStatus).color,fontSize: '24px' }">{{ getText(data.reservoirStatus).name }}</div>
            <div class="warn-label">安全状态</div>
          </div>
        </div>
      </div>
      <div style="width: 100%; padding: 2.3rem;">
        <div class="dataBox">
          <div class="item" v-for="(item,i) in data.pnList" :key="i">
            <span>{{ item.pnName }}</span>
            <div><span
              :style="{ color: getTypeText(item.basicOnline).color }">{{ getTypeText(item.basicOnline).name}}</span>
              / <span
                :style="{ color: getText(item.newestWarnStatus).color }">{{ getText(item.newestWarnStatus).name}}</span>
            </div>
          </div>
        </div>
      </div>
    </a-card>
    <!-- 安全管理预案 -->
    <safePlanArticle :safeVisible="safeVisible" :reserveType="15" @onClose="()=>{safeVisible=false}" />
  </div>
</template>

<script>
import { getText, getTypeText } from "@/utils/utils";
import safePlanArticle from '@/components/safePlanArticle/safePlanArticle.vue'
export default {
  components: {
    safePlanArticle
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      monitorList: [],
      safeVisible: false
    }
  },
  watch: {

  },
  mounted () {
  },
  methods: {
    getText (str) {
      return getText(str)
    },
    getTypeText (str) {
      return getTypeText(str)
    }
  }
}

</script>
<style lang="less" scoped>
  .dataBox {
    height: 23rem;
    overflow: auto;
  }
  .item {
    width: 48%;
    float: left;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .item:nth-child(even){
    float: right;
  }
  .overview-top {
    display: flex;
    padding-top:2rem;
    .overview-top-hidden {
      flex: 1;
      color:#5D6574;
      padding:1rem;
      font-size: 1.4rem;
      background: #FFFFFF;
      box-shadow: 1px 0px 18px 0px rgba(172, 200, 219, 0.3);
      border-radius: 8px;
      margin-right:1.9rem;
      div{
        line-height: 2;
      }
    }
    .overview-top-warn {
      flex: 1;
      width: 240px;
      height: 132px;
      background: #F7F8FD;
      opacity: 0.7;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        margin-right:3rem;
      }
      .warn-label{
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #5D6574;
        margin-top:0.5rem;
      }
    }
  }
</style>
