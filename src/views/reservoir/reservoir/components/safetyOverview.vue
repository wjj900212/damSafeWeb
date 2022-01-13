<template>
  <a-card title="安全概况">
    <a-card-grid style="width: 100%; text-align: left">
      <a-row>
        <a-col :span="16">
          <h2>{{ reservoirInfo.reservoirName }}</h2>
          <a-row>
            <a-col :span="4">所在地址</a-col>
            <a-col :span="20">{{ reservoirInfo.cityName }}</a-col>
          </a-row>
          <a-row>
            <a-col :span="4">管理单位</a-col>
            <a-col :span="20">{{ reservoirInfo.managerUnit }}</a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <img
            v-if="reservoirInfo.images"
            width="200"
            height="100"
            :src="reservoirInfo.images"
          />
        </a-col>
      </a-row>
    </a-card-grid>
    <a-card-grid style="width: 100%; text-align: center">
      <a-row>
        <a-col :span="12">
          <a-row>
            <a-col>综合安全等级</a-col>
          </a-row>
          <a-row>
            <a-col :style="{ color: getText(reservoirInfo.safeLevel).color }">{{ getText(reservoirInfo.safeLevel).name }}</a-col>
          </a-row>
        </a-col>
        <a-col :span="12">
          <a-row>
            <a-col :span="24">预警数</a-col>
          </a-row>
          <a-row>
            <a-col :style="{ color: 'rgba(217, 0, 27, 0.753)' }" :span="24">{{ reservoirInfo.warnCount }}</a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-card-grid>
    <a-card-grid style="width: 100%; text-align: center">
      <a-row>
        <a-col :span="12">
          <!-- <img src="static/img/u289.png" alt="" /> -->
          <div :style="{ width: '100%', height: '220px' }">
            <component
              v-if="radarData.length > 2"
              :is="'EchartsRadar'"
              refid="radar"
              :data="radarData"
              class="main-content"
            ></component>
          </div>
        </a-col>
        <a-col :span="12" :style="{ marginTop: '25px' }">
          <a-row v-for="item in reservoirInfo.monitorList" :key="item.name">
            <a-col :span="12">{{ item.name }}</a-col>
            <a-col :span="12" :style="{ color: getText(reservoirInfo.safeLevel).color }">{{ getText(item.warnLevel).name }}</a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-card-grid>
  </a-card>
</template>
<script>
import EchartsRadar from "@/components/echarts/EchartsRadar.vue";
export default {
  name: "safetyOverview",
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
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  updated() {},
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
};
</script>

<style lang="less" scoped>
</style>
