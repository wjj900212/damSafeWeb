<template>
  <a-card title="变形监测趋势统计">
    <div slot="extra">
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
    </div>
    <a-card-grid style="width: 100%; text-align: left; height: 500px">
      <a-row>
        <a-col :span="4">
          <div>当前&nbsp;&nbsp;{{ monitorName }}</div>
          <div>{{ monitorCode }}</div>
        </a-col>
        <a-col :span="20">
          <a-row>
            <a-col :span="14">
              <div style="margin: 20px">
                <div
                  style="
                    height: 400px;
                    position: absolute;
                    top: 50px;
                    width: 90%;
                  "
                >
                  <component
                    :is="componentName"
                    :refid="'bxchart'"
                    :name="name"
                    :data="chartsdata"
                    class="main-content"
                  ></component>
                </div>
              </div>
            </a-col>
            <a-col :span="10">
              <div style="margin: 20px">
                <a-table
                  ref="TableInfo"
                  :columns="columns"
                  :rowKey="(record) => record.id"
                  :data-source="sourceData"
                  :pagination="pagination"
                  :scroll="{ y: 190 }"
                >
                </a-table>
              </div>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-card-grid>
  </a-card>
</template>
<script>
import moment from "moment";
import EchartsWave from "@/components/echarts/EchartsWave.vue";
export default {
  name: "transshapeStatistics",
  components: { EchartsWave },
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
    getChartInfo() {
      const { monitor } = this;
      const start = moment(this.dateTimeValue[0]).format("YYYY-MM-DD");
      const end = moment(this.dateTimeValue[1]).format("YYYY-MM-DD");
      this.$get("web/monitorScene/monitorDataListVariant", {
        pnId: monitor,
        starttime: start,
        endtime: end,
      }).then((res) => {
        if (res.data.code === 1) {
          let data = res.data.data
          let sourceData = []
          let chartsdata = []
          data.map(item => {
            sourceData.push({time: item[0], x: item[1], y: item[2], z: item[3]})
            chartsdata.push([[item[0], item[1]], [item[0], item[2]], [item[0], item[3]]])
          })
          this.sourceData = sourceData
          this.chartsdata = chartsdata
          this.componentName = 'EchartsWave'
          this.name = '位移（mm）'
          console.log(chartsdata)
        } else {
          this.$message.error(res.data.msg);
        }
      });
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
