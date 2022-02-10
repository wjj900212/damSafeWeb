<template>
  <a-card :bodyStyle="{ padding: '10px' }">
    <div class="safetyPlan">
      <div class="card">
        <img src="static/img/渗压监测趋势统计.png">
        <span>变形监测趋势统计</span>
      </div>
      <div>
        <a-select v-model="monitor" placeholder="监测点" option-filter-prop="children" @change="handleMonitorChange">
          <a-select-option v-for="item in List" :value="item.pnId" :key="item.pnId">
            {{ item.pnName }}
          </a-select-option>
        </a-select>
        <a-select style="width: 100px" v-model="dateModel" option-filter-prop="children"
          @change="handleDateModelChange">
          <a-select-option v-for="item in dateModelData" :value="item.value" :key="item.value">
            {{ item.name }}
          </a-select-option>
        </a-select>
        <a-range-picker v-model="dateTimeValue" style="width: 240px" @change="onDateChange" />

        <a-button @click="getChartInfo" type="primary"> 查询 </a-button>
        <a-button @click="exportEXcel" type="primary"> 导出 </a-button>
      </div>
    </div>
    <div style="width: 100%; text-align: left;">
      <div
        style="background: #F9FAFE;color:#5D6574;font-size:1.6rem;line-height:40px;width:calc(100% - 20px);margin:0 auto;padding:0 1rem;margin-top:1rem">
        当前： <span style="color:#007EFE;">{{monitorName}}</span>
        <span style="margin-right:10px;;color:#007EFE;">{{monitorCode}}</span>
      </div>
      <div class="stateMsg">
        <div class="echartTU">
          <component :is="componentName" :refid="'bxchart'" :name="name" :data="chartsdata" class="main-content">
          </component>
        </div>
        <div class="s_right">
          <!-- 表格区域 -->
          <a-table ref="TableInfo" :columns="columns" :rowKey="(record) => record.id" :data-source="sourceData"
            :pagination="pagination" :scroll="{ y: 190 }">
          </a-table>
        </div>
      </div>
    </div>
  </a-card>
</template>
<script>
  import moment from "moment";
  import EchartsWave from "@/components/echarts/EchartsWave.vue";
  export default {
    name: "transshapeStatistics",
    components: {
      EchartsWave
    },
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
        dateModelData: [{
            name: "今日",
            value: "now"
          },
          {
            name: "近三天",
            value: "day"
          },
          {
            name: "近一周",
            value: "week"
          },
          {
            name: "近一月",
            value: "month"
          },
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
      columns() {
        return [{
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
      monitor(val) {
        this.getChartInfo()
      }
    },
    methods: {
      moment,
      exportEXcel() {
        const {
          monitor
        } = this;
        console.log(monitor)
        if (!monitor) {
          this.$message.error('请选择测点')
          return false
        }
        const start = moment(this.dateTimeValue[0]).format("YYYY-MM-DD");
        const end = moment(this.dateTimeValue[1]).format("YYYY-MM-DD");
        this.$export("web/monitorScene/exportMonitorDataVariant", {
          pnId: monitor,
          starttime: start,
          endtime: end,
        });
      },
      getChartInfo() {
        const {
          monitor
        } = this;

        if (!monitor) return false
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
              sourceData.push({
                time: item[0],
                x: item[1],
                y: item[2],
                z: item[3]
              })
              chartsdata.push([
                [item[0], item[1]],
                [item[0], item[2]],
                [item[0], item[3]]
              ])
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

<style scoped>
  .stateMsg {
    display: flex;
    justify-content: space-evenly;
    padding: 1rem 0;
    border-bottom: 1px solid #f2f2f2;
    font-size: 1.4rem;
  }

  .s_right {
    width: 38%;
  }

  .s_right>>>.ant-table-thead>tr>th {
    background-color: #188FFF;
    color: #fff;
    border-color: rgba(59, 173, 255, 0.12);
  }

  .s_right>>>.ant-table-tbody>tr>td {
    border-color: rgba(59, 173, 255, 0.12);
  }


  .echartTU {
    width: 60%;
    height: 380px;
    margin: 0 1rem;
  }

</style>
