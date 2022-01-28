<template>
  <a-card>
    <div class="safetyPlan">
      <div class="card">
        <img src="static/img/control/数据统计.png"/>
        <span>微动监测数据统计</span>
      </div>
      <div>
        <a-select
          v-model="monitor"
          placeholder="监测点"
          option-filter-prop="children"
          @change="handleMonitorChange"
        >
          <a-select-option
            v-for="item in List"
            :value="item.pnId"
            :key="item.pnId"
          >
            {{ item.pnName }}
          </a-select-option>
        </a-select>
        <a-select
          style="width: 100px"
          v-model="dateModel"
          option-filter-prop="children"
          @change="handleDateModelChange"
        >
          <a-select-option
            v-for="item in dateModelData"
            :value="item.value"
            :key="item.value"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
        <a-range-picker
          v-model="dateTimeValue"
          style="width: 240px"
          @change="onDateChange"
        />

        <a-button @click="getChartInfo" type="primary"> 查询 </a-button>
        <a-button @click="exportEXcel" type="primary"> 导出 </a-button>
      </div>
    </div>
    <div style="width: 100%; text-align: left; height: 500px">
      <div class="warn-info LR" style="margin-top:1rem;">
        <div><span>当前:</span><span class="warn-value">{{monitorName}}  {{monitorCode}}</span></div>
      </div>
      <div style="width: 100%;">
        <main-content ref="jogging" :list="targetList" :dateTimeValue="dateTimeValue"></main-content>
      </div>
      <!--<a-row>
        <a-col :span="4">
          <div>当前&nbsp;&nbsp;{{ monitorName }}</div>
          <div>{{ monitorCode }}</div>
        </a-col>
        <a-col :span="20">
          <main-content ref="jogging" :list="targetList" :dateTimeValue="dateTimeValue"></main-content>
        </a-col>
      </a-row>-->
    </div>
  </a-card>
</template>
<script>
import moment from "moment";
import MainContent from '@/components/survey/MainContent.vue';
export default {
  name: "joggingStatistics",
  components: { MainContent },
  props: {
    List: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dateModel: "now",
      componentName: '',
      chartsdata: [],
      targetList: [],
      name: '',
      dateModelData: [
        { name: "今日", value: "now" },
        { name: "近三天", value: "day" },
        { name: "近一周", value: "week" },
        { name: "近一月", value: "month" },
      ],
      dateTimeValue: [
        moment(new Date(), "YYYY-MM-DD"),
        moment(new Date(), "YYYY-MM-DD"),
      ],
      sourceData: [],
      monitor: undefined,
      monitorName: "",
      monitorCode: "",
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 10,
        size: "small",
        showTotal: (total, range) => `共 ${total} 条`,
      }
    };
  },
  computed: {
    columns () {
       return [
        {
          title: "序号",
          customRender: (text, record, index) => `${index + 1}`,
          width: "15%",
        },
        {
          title: "时间",
          dataIndex: "time",
          key: "time",
          width: "40%",
        },
        {
          title: '位移X',
          dataIndex: "x",
          key: "x",
          width: "15%",
        },
        {
          title: '位移Y',
          dataIndex: "y",
          key: "y",
          width: "15%",
        },
        {
          title: '位移Z',
          dataIndex: "z",
          key: "z",
          width: "15%",
        },
      ]
    }
  },
  mounted() {
    this.monitor = this.List.length > 0 ? this.List[0].pnId : undefined;
    this.monitorName = this.List.length > 0 ? this.List[0].pnName : undefined;
    this.monitorCode =
      this.List.length > 0 ? this.List[0].devBasicStrId : undefined;
  },
  updated() {},
  watch: {
    List(val) {
      this.monitor = this.List.length > 0 ? this.List[0].pnId : undefined;
      this.monitorName = this.List.length > 0 ? this.List[0].pnName : undefined;
      this.monitorCode =
        this.List.length > 0 ? this.List[0].devBasicStrId : undefined;
    },
    monitor (val) {
      this.getChartInfo()
    }
  },
  methods: {
    moment,
    exportEXcel () {
      const { monitor } = this;
      const start = moment(this.dateTimeValue[0]).format("YYYY-MM-DD");
      const end = moment(this.dateTimeValue[1]).format("YYYY-MM-DD");
      let pnStrId = this.$refs.jogging.devItem.devValueId
      this.$export("web/monitorScene/exportMonitorData", {
        pnId: monitor,
        starttime: start,
        endtime: end,
        type: '14',
        pnStrId: pnStrId
      });
    },
    getMonitorList (pnId) {
      const params = {
        pnId: pnId
      }
      this.$get('web/monitorScene/getDevBasicTargetByPnId', {
        ...params,
      }).then((r) => {
        if (r.data.data !== null) {
          let data = r.data.data
          this.targetList = data
          // this.treeData = data.treeData
        }
      })
    },
    getChartInfo() {
      const { monitor } = this
      this.getMonitorList(monitor)
    },
    handleMonitorChange(value) {},
    handleDateModelChange(value) {
      let dateValue;
      switch (value) {
        case "now":
          dateValue = [
            moment(new Date(), "YYYY-MM-DD"),
            moment(new Date(), "YYYY-MM-DD"),
          ];
          break;
        case "day":
          dateValue = [
            moment().subtract(3, "days"),
            moment(new Date(), "YYYY-MM-DD"),
          ];
          break;
        case "week":
          dateValue = [
            moment().subtract(1, "weeks"),
            moment(new Date(), "YYYY-MM-DD"),
          ];
          break;
        case "month":
          dateValue = [
            moment().subtract(1, "months"),
            moment(new Date(), "YYYY-MM-DD"),
          ];
          break;
      }
      this.dateTimeValue = dateValue;
    },
    onDateChange(dates, dateStrings) {
      console.log(this.dateTimeValue);
      const start = moment(this.dateTimeValue[0]).format("YYYY-MM-DD");
      const end = moment(this.dateTimeValue[1]).format("YYYY-MM-DD");
      console.log(start, end);
    },
  },
};
</script>

<style lang="less" scoped>
</style>
