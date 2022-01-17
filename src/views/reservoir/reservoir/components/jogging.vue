<template>
  <a-card title="微动监测数据统计">
    <div slot="extra">
    <a-select
      v-model="select.hiddenId"
      placeholder="监测点"
      option-filter-prop="children"
      @change="handleMonitorChange"
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
    <a-button type="primary"> 查询 </a-button>
    <a-button type="primary"> 导出 </a-button>
    </div>
    <a-card-grid style="width: 100%; text-align: center">

    </a-card-grid>
    </a-card>
</template>
<script>
export default {
  name: 'jogging',
  components: {},
  props: {
    List: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      dateTimeValue: [
        moment(new Date(), "YYYY-MM-DD"),
        moment(new Date(), "YYYY-MM-DD"),
      ],
      select: {},
      monitor: undefined,
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
  },
  updated () {
  },
  watch: {
    List(val) {
      this.select = val.length > 0 ? val[0] : {};
      this.monitorData = this.select.pnList || [];
      this.monitor =
        this.monitorData.length > 0 ? this.monitorData[0].projPnId : undefined;
    },
  },
  methods: {
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
