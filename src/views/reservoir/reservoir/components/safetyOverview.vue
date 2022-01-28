<template>
  <a-card>
    <div class="safetyPlan">
      <div class="card">
        <img src="static/img/control/概况.png"/>
        <span>安全概况</span>
      </div>
    </div>
    <div class="overview-top">
      <div class="overview-top-hidden">
        <div style="font-size: 1.6rem;font-weight: 400;" :title="reservoirInfo.reservoirName">{{ reservoirInfo.reservoirName | ellipsis(10) }}</div>
        <div :title="reservoirInfo.cityName">所在地址:{{ reservoirInfo.cityName | ellipsis(10)}}</div>
        <div :title="reservoirInfo.managerUnit">管理单位:{{ reservoirInfo.managerUnit | ellipsis(10) }}</div>
      </div>
      <div class="overview-top-warn" style=" margin-right:1.9rem;">
        <img src="static/img/control/组125.png"/>
        <div>
          <div><span class="warn-num">{{ reservoirInfo.warnCount }}</span><span class="warn-unit">个</span></div>
          <div class="warn-label">预警数量</div>
        </div>
      </div>
      <div class="overview-top-warn">
        <img v-if="reservoirInfo.safeLevel==='0'" src="static/img/正常.png"/>
        <img v-else-if="reservoirInfo.safeLevel==='1'" src="static/img/异常.png"/>
        <img v-else-if="reservoirInfo.safeLevel==='2'" src="static/img/险情.png"/>
        <div>
          <div :style="{ color: getText(reservoirInfo.safeLevel).color,fontSize: '24px' }">{{ getText(reservoirInfo.safeLevel).name }}</div>
          <div class="warn-label">综合安全等级</div>
        </div>
      </div>
    </div>
    <div class="overview-bottom">
      <div class="bottom-left" :style="{ width: '100%', height: '220px' }">
        <component
          v-if="radarData.length > 2"
          :is="'EchartsRadar'"
          refid="radar"
          :data="radarData"
          class="main-content"
        ></component>
      </div>
      <div class="bottom-right">
        <div v-for="item in reservoirInfo.monitorList" :key="item.name" style="display: flex;justify-content: space-between;align-content: space-between;">
          <div style="display: flex;justify-content: center;align-items: center;"><div class="ract"></div>{{ item.name }}</div>
          <div :style="{ color: getText(item.warnLevel).color }">{{ getText(item.warnLevel).name }}</div>
        </div>
      </div>
    </div>
  </a-card>
</template>
<script>
import EchartsRadar from '@/components/echarts/EchartsRadar.vue'
export default {
  name: 'safetyOverview',
  components: {
    EchartsRadar
  },
  props: {
    reservoirInfo: {
      type: Object,
      default: () => {}
    },
    radarData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  updated () {},
  methods: {
    getText (str) {
      let obj = {}
      switch (str) {
        case '0':
          obj = { name: '正常', color: '#16D1AE' }
          break
        case '1':
          obj = { name: '异常', color: '#FF9500' }
          break
        case '2':
          obj = { name: '异常', color: '#FF9500' }
          break
        case '3':
          obj = { name: '异常', color: '#FF9500' }
          break
        case '4':
          obj = { name: '险情', color: '#FE5736' }
          break
      }
      return obj
    }
  },
  filters: {
    // 名称过长时用...代替
    ellipsis (value, num) {
      if (!value) {
        return ''
      }
      if (value.length > num) {
        return value.slice(0, num) + '...'
      }
      return value
    }
  }
}
</script>

<style lang="less" scoped>
  /* @import "../../../../../static/less/info.css";*/
    .overview-top {
      display: flex;
      padding-top:1rem;
      .overview-top-hidden {
        flex: 1;
        color:#FFFFFF;
        padding:2rem;
        font-size: 1.4rem;
        background: url("../../../../../static/img/control/组109.png") no-repeat;
        background-size: 100% 100%;
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
        .warn-num{
          font-size: 30px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #EB623B;
          line-height: 28px;
          background: linear-gradient(180deg, #FEA7A5 0%, #FE5230 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .warn-unit{
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #EB623B;
        }
      }
    }
  .overview-bottom{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top:2rem;
    padding: 1.3rem 0px;
    .bottom-left{
      flex: 1;
      margin-right:1rem;
    }
    .bottom-right{
      flex: 1;
      line-height: 2.5;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #5D6876;
      .ract{
        width: 8px;
        height: 8px;
        background: #3486FF;
        margin-left: 2rem;
        margin-right: 3rem;
      }
    }
  }
</style>
