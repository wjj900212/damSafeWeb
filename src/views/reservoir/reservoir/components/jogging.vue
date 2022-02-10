<template>
  <a-card>
    <div class="safetyPlan">
      <div class="card">
        <img src="static/img/control/数据统计.png"/>
        <span>微动监测数据统计</span>
      </div>
      <div>
        <a-select
          v-model="select.hiddenId"
          placeholder="隐患点"
          option-filter-prop="children"
          @change="handleHiddenChange"
        >
          <a-select-option
            v-for="item in List"
            :value="item.hiddenId"
            :key="item.hiddenId"
          >
            {{ item.hiddenName }}
          </a-select-option>
        </a-select>
        <a-select
          v-model="monitor"
          placeholder="监测点"
          option-filter-prop="children"
          @change="handleMonitorChange"
        >
          <a-select-option
            v-for="item in monitorData"
            :value="item.projPnId"
            :key="item.projPnId"
          >
            {{ item.projPnName }}
          </a-select-option>
        </a-select>
        <a-range-picker
          v-model="dateTimeValue"
          style="width: 240px"
          @change="onDateChange"
        />
        <a-button @click="getInfo" type="primary"> 查询 </a-button>

      </div>
    </div>
    <div class="warn-info LR" style="margin-top:1rem;">
      <div><span>当前:</span><span class="warn-value">{{ monitorName }}</span></div>
      <div><span class="warn-value">指标安全说明</span><img src="static/img/control/自动对比说明书.png"/></div>
    </div>
    <div :style="{ width: '100%', height: '450px' }">
      <main-content :list="targetList" :dateTimeValue="dateTimeValue"></main-content>
    </div>
  </a-card>
</template>
<script>
import moment from "moment";
import MainContent from '@/components/jogging/MainContent.vue';

export default {
  name: 'jogging',
  components: {MainContent},
  props: {
    List: {
      type: Array,
      default: () => [],
    },
    targetList: {
      type: Array,
      default: () => [],
    }
  },
  data () {
    return {
      dateTimeValue: [
        moment(new Date(), "YYYY-MM-DD"),
        moment(new Date(), "YYYY-MM-DD"),
      ],
      select: {},
      monitor: undefined,
      monitorName: '',
      monitorCode: '',
      monitorData: [],
    }
  },
  computed: {
  },
  mounted () {
    this.select = this.List.length > 0 ? this.List[0] : {};
    this.monitorData = this.select.pnList || [];
    this.monitor =
      this.monitorData.length > 0 ? this.monitorData[0].projPnId : undefined;
    this.monitorName =
      this.monitorData.length > 0 ? this.monitorData[0].projPnName : '';
    this.monitorCode =
      this.monitorData.length > 0 ? this.monitorData[0].devCode : '';
  },
  updated () {
  },
  watch: {
    List(val) {
      this.select = this.List.length > 0 ? this.List[0] : {};
      this.monitorData = this.select.pnList || [];
      this.monitor =
        this.monitorData.length > 0 ? this.monitorData[0].projPnId : undefined;
      this.monitorName =
        this.monitorData.length > 0 ? this.monitorData[0].projPnName : '';
      this.monitorCode =
        this.monitorData.length > 0 ? this.monitorData[0].devCode : '';
    },
  },
  methods: {
    moment,
    getInfo () {
      this.$emit('getMonitorList', this.monitor)
    },
    handleHiddenChange (value) {
      this.select = value
      this.monitorData = this.select.pnList || [];
      this.monitor =
        this.monitorData.length > 0 ? this.monitorData[0].projPnId : undefined;
      this.monitorName =
        this.monitorData.length > 0 ? this.monitorData[0].projPnName : '';
      this.monitorCode =
        this.monitorData.length > 0 ? this.monitorData[0].devCode : '';
    },
    handleMonitorChange (value) {

    },
    onDateChange(dates, dateStrings) {
      console.log(this.dateTimeValue);
      const start = moment(this.dateTimeValue[0]).format("YYYY-MM-DD");
      const end = moment(this.dateTimeValue[1]).format("YYYY-MM-DD");
      console.log(start, end);
    },
  }
}
</script>

<style lang="less" scoped>
</style>
