<template>
  <a-row>
    <a-col :span="14">
        <div style="margin: 20px;">

            <a-row>
                <a-col>
                <div
                    v-if="list.length >= 5"
                    style="
                    overflow-y: hidden;
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    "
                    :style="{ height: hiddenHeight }"
                >
                    <div style="width: calc(100% - 90px);z-index: 11;background: white;">
                    <template v-for="(tag, index) in list">
                        <a-checkable-tag
                        color="#585f69"
                        :closable="false"
                        :key="index"
                        :checked="selectedDevTags.indexOf(tag) > -1"
                        @change="() => onDevValueSelect(tag, index)"
                        >
                        {{ tag.devValueName }}
                        </a-checkable-tag>
                    </template>
                    </div>
                    <div class="ant-tag-more" @click="showMoreTarget()">更多</div>
                </div>
                </a-col>
            </a-row>
            <div style="height: 400px;position: absolute;top: 50px;width:90%">
                <component :is="componentName" :refid="'joggingchart'" :boundary="boundary" :data="chartsdata" class="main-content"></component>
            </div>
        </div>
    </a-col>
    <a-col :span="10">
      <div style="margin: 20px;">
        <a-table
            ref="TableInfo"
            :columns="columns"
            :rowKey="(record) => record.id"
            :data-source="sourceData"
            :customRow="onClickRow"
            :rowClassName="setRowClassName"
            :pagination="pagination"
            :scroll="{ y: 190 }"
        >
            <a slot="name" slot-scope="text">{{ text }}</a>
            <span slot="customTitle">
              {{ devItem.devValueName }}
            </span>
        </a-table>
      </div>  
    </a-col>
  </a-row>
</template>
<script>
import Echarts2D from "@/components/echarts/Echarts2D.vue";
import Echarts from "@/components/echarts/Echarts.vue";
import EchartsArr from "@/components/echarts/EchartsArr.vue";
import EchartsoLine from "@/components/echarts/EchartsoLine.vue";
import EchartsLine from "@/components/echarts/EchartsLine.vue";
import EchartsThinbar from "@/components/echarts/EchartsThinbar.vue";
import EchartsPolar from "@/components/echarts/EchartsPolar.vue";
import EchartsWave from "@/components/echarts/EchartsWave.vue";
import EchartsScatter from "@/components/echarts/EchartsScatter.vue";
import moment from "moment";
export default {
  name: "MainContent",
  components: {
    Echarts2D,
    EchartsWave,
    Echarts,
    EchartsArr,
    EchartsoLine,
    EchartsLine,
    EchartsThinbar,
    EchartsPolar,
    EchartsWave,
    EchartsScatter
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    dateTimeValue: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      devItem: {},
      chartsdata: [],
      boundary: [],
      hiddenHeight: "30px",
      selectedDevTags: [], // 指标选中列表
      selectRowId: '',
      componentName: '',
      clickable: false,
      sourceData: [],
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 10,
        size: "small",
        showTotal: (total, range) => `共 ${total} 条`,
      },
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
          width: "50%",
        },
        {
        //   title: this.devItem,
          dataIndex: "value",
          key: "value",
          width: "35%",
          scopedSlots: { title: 'customTitle' },
        },
      ]
    }
  },
  mounted() {
    if (this.list.length > 0) {
      this.devItem = this.list[0]
      this.onDevValueSelect(this.list[0])
    }
  },
  watch: {
    list(val) {
      if (val.length > 0) {
        this.devItem = val[0]
        this.onDevValueSelect(val[0])
      }
    },
  },
  updated() {},
  methods: {
    moment,
    getStringName(str) {
      let arr = str.split("_");
      let type = arr[1];
      let name = [];
      let objname = [];
      switch (type) {
        case "1":
          name = [
            "倾角",
            "倾向",
            "振动",
            "温度",
            "位移X",
            "位移Y",
            "位移Z",
            "最大速度",
          ];
          objname = [
            "inclination",
            "tendency",
            "vibration",
            "temperature",
            "x",
            "y",
            "z",
            "resVelocity",
          ];
          break;
        case "2":
          name = ["倾角"];
          objname = ["inclination"];
          break;
        case "3":
          name = ["倾向"];
          objname = ["tendency"];
          break;
        case "4":
          name = ["振动"];
          objname = ["vibration"];
          break;
        case "5":
          name = ["温度"];
          objname = ["temperature"];
          break;
        case "6":
          name = ["位移X", "位移Y", "位移Z"];
          objname = ["x", "y", "z"];
          break;
        case "43":
          name = ["位移X", "位移Y", "位移Z", "最大速度"];
          objname = ["x", "y", "z", "resVelocity"];
          break;
      }
      return { name: name, objname: objname };
    },
    onClickRow(record, index) {
      return {
        on: {
          click: () => {
            console.log("行事件", record, index);
            if (this.clickable) {
              this.selectRowId = record.id;
              let chartParams = {}
              chartParams.devValueId = this.devValueId;
              chartParams.id = record.id;
              this.updateChart2(this.chartParams);
            }
            // this.className = 'ant-table-row-selected'
            // this.rowSelection.selectedRows = []
            // this.rowSelection.selectedRowKeys = []
            // this.rowSelection.selectedRowKeys.push(this,pageDate)
          },
        },
      };
    },
    
    setRowClassName(record) {
      const tableId = this.selectRowId;
      return record.id === tableId ? "SDactive" : "";
    },
    showMoreTarget(){
      if(this.hiddenHeight === '30px'){
        this.hiddenHeight = 'auto'
      }else if(this.hiddenHeight === 'auto'){
        this.hiddenHeight = '30px'
      }
    },
    onDevValueSelect(item, index) {
      this.selectedDevTags = []
      this.selectedDevTags.push(item)
      this.devItem = item
      console.log(item);
    //   if (this.$attrs.indexValueId !== 0) {
    //     this.selected_index = this.$attrs.indexValueId;
    //   } else {
    //     this.selected_index = index;
    //   }
      switch (item.showType) {
        case "0":
        this.componentName =
            item.alarmflag === "0" ? "EchartsoLine" : "EchartsLine";
        this.chartAndListInit(item, "2D");
        this.clickable = false;
        break;
        case "1":
        this.componentName = "EchartsThinbar";
        this.chartAndListInit(item, "2D");
        this.clickable = false;
        break;
        case "2":
        this.componentName = "EchartsPolar";
        this.chartAndListInit(item, "2D");
        this.clickable = false;
        break;
        case "3":
        this.componentName = "EchartsScatter";
        this.chartAndListInit(item, "2D");
        this.clickable = false;
        break;
        case "5":
        this.componentName = "EchartsWave";
        this.chartAndListInit(item, "wave");
        this.clickable = true;
        break;
        case "6":
        this.componentName = "picShow";
        this.chartAndListInit(item, "pic");
        this.clickable = true;
        break;
      }
    },
    chartAndListInit(item, type) {
      console.log("初始化列表", item);
      this.boundary = item.boundary
      let chartParams = {}
      chartParams.pnStrId = item.devValueId
      let start = moment(this.dateTimeValue[0]).format("YYYY-MM-DD");
      let end = moment(this.dateTimeValue[1]).format("YYYY-MM-DD");
      chartParams.startTime = start
      chartParams.endTime = end
      this.updateChart(chartParams);
    //   this.searchSourceDataList(queryParams);
      this.selectedDevTags = [];
      this.selectedDevTags.push(item);
      // console.log('选中指标:',this.selectedDevTags)
    //   if (type === "2D") {
    //     this.updateChart(chartParams);
    //   }
    },
    updateChart (params) {
      // let url = '/api/data/query/' + params.projPnParentId + '/' + params.devBasicId + '/' + params.devValueStrId + '/' + params.id
      let url = 'web/reservoirOverview/wdStatistics'
      this.$get(url, {
        ...params
      }).then((r) => {
        this.chartsdata = r.data.data.list
        this.sourceData = this.chartsdata.map(item => {
          return {time: item[0], value: item[1]}   
        })
      })
    },
  },
};
</script>

<style lang="less" scoped>
  .ant-tag {
    margin: 5px;
    border: 1px solid #aaa;
    opacity: 0.8;
  }
  .ant-tag-checkable-checked {
    background: white;
    color: #1890ff;
    border-color:#1890ff;
  }
  .ant-tag-more {
    cursor: pointer;
    line-height: 30px;
    position: absolute;
    right: 30px;
  }
  .ant-tag-more:hover {
    color: #1890ff;
  }
</style>
