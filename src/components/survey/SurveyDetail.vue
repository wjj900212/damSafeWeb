<!--suppress ALL -->
<template>
  <div style="width: 100%">
    <div
      style="
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-content: space-between;
      "
    >
      <div class="titleIcon" style="padding-left: 0.5rem">
        <img class="s-img" src="static/imgs/形状1254.png" />
        <span class="s-title">监测数据详情</span>
      </div>
    </div>
    <div v-if="dataType === 'normal'" style="width: 100%; height: 100%">
      <!-- <div style="margin:0.5rem 0px 0px 1rem;">
        <span style="font-family: 'Microsoft YaHei UI';font-size: 1.4rem;font-weight: 400;color:#99C8CC;">时间</span>
        <a-range-picker  :defaultValue="[moment(startDate, dateFormat), moment(endDate, dateFormat)]" @change="changeDate" style="margin-left:2rem;"></a-range-picker>
      </div> -->
      <div
        style="
          margin: 0.5rem 1rem 0px 1rem;
          display: flex;
          justify-content: space-between;
        "
      >
        <div>
          <span
            style="
              font-family: 'Microsoft YaHei UI';
              font-size: 1.4rem;
              font-weight: 400;
              color: #99c8cc;
            "
            >时间</span
          >
          <a-range-picker
            :defaultValue="[
              moment(startDate, dateFormat),
              moment(endDate, dateFormat),
            ]"
            @change="changeDate"
            style="margin-left: 2rem"
          ></a-range-picker>
        </div>
      </div>
        <!-- </div> -->
        <div style="display: flex; flex-direction: column">
          <div class="HPDevValueName">
            <div
              v-if="HPDevValueNameList.length >= 8"
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
              "
            >
              <div
                style="
                  font-family: 'Microsoft YaHei UI';
                  font-size: 1.4rem;
                  font-weight: 400;
                  color: #99c8cc;
                  padding-top: 1rem;
                "
              >
                筛选
              </div>
              <div
                style="
                  overflow-y: hidden;
                  display: flex;
                  flex-direction: row;
                  position: absolute;
                  margin-left: 4rem;
                  background-color: #000c17;
                "
                :style="{ height: hiddenHeight, zIndex: tagZIndex }"
              >
                <div style="width: 80rem">
                  <template v-for="(tag, index) in HPDevValueNameList">
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
              </div>
              <div class="ant-tag-more" @click="showMoreTarget()">
                {{ moreIndex }}
              </div>
            </div>
            <div v-else>
              <template v-for="(tag, index) in HPDevValueNameList">
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
          </div>
          <div style="width: 100%; height: 300px" v-if="data.length !== 0">
            <component
              :is="componentName"
              refid="sDetail"
              :name="yname"
              :data="data"
              :boundary="boundary"
              :objname="objname"
              :pnDevId="chartsID(devValueId)"
              class="main-content"
            ></component>
          </div>
          <div v-else>
            <a-empty :image="simpleImage" />
          </div>
          <div style="position: relative">
            <a-table
              ref="TableInfo"
              :columns="columns"
              :rowKey="(record) => record.id"
              :data-source="sourceData"
              :customRow="onClickRow"
              :rowClassName="setRowClassName"
              :pagination="pagination"
              @change="handleTableChange"
              :scroll="{ y: 190 }"
            >
              <a slot="name" slot-scope="text">{{ text }}</a>
            </a-table>
            <div
              v-if="sourceData.length !== 0"
              style="position: absolute; bottom: 0px"
            >
              <div class="pnExport" @click="exportPn()">
                <img src="static/imgs/形状1253.png" />
                <span>导出</span>
              </div>
            </div>
            <!--<div class="pnExport" @click="exportPn()">
            <img src="static/images/Download拷贝2@2x.png" style="width:19px;height:16px;"/>
            <span style="font-family: 'PingFang SC Heavy';color:#00ebc0;font-size:18px;">导出</span>
          </div>-->
          </div>
        </div>
    </div>
    <div v-else>
      <!-- <div class="survey-tabs-bar">
        <div @click="changeActive(item.key)" v-for="item in tabsBars[showKey]" :key="item.key" :class="{active: activeKey === item.key}">{{ item.name }}</div>
      </div> -->
      <div class="nodebox">
        <a-select
          v-model="nodeValue"
          option-filter-prop="children"
          style="width: 120px"
          @change="handleNodeChange"
        >
          <a-select-option v-for="i in nodeMap" :value="i.key" :key="i.key">
            {{ i.name }}
          </a-select-option>
        </a-select>
      </div>
      <div
        v-for="item in tabsBars[showKey]"
        :class="[{ active: activeKey === item.key }, 'survey-tabs-panel']"
        :key="item.key + 'panel'"
      >
        <div v-if="item.key === 'zh'">
          <div>
            <div class="funcboxall">
              <label for="">时间</label>
              <a-date-picker
                style="width: 200px"
                v-model="dateTimes"
                placeholder="请选择日期"
                @change="onChange"
              />
              &nbsp;&nbsp;-&nbsp;&nbsp;
              <a-select
                v-model="timeQuantum"
                :open="openMenu"
                :disabled="!dateTimes"
                placeholder="选择时间段"
                option-filter-prop="children"
                style="width: 180px"
                :filter-option="filterOption"
                @change="handleChange"
                @dropdownVisibleChange="inputKeydown"
                @blur="handleBlurChange"
              >
                <a-select-option
                  v-for="i in timesMap"
                  :value="i.key"
                  :key="i.key"
                >
                  {{ i.name }}
                </a-select-option>
              </a-select>
              <a-button
                style="margin-left: 10px"
                @click="getDataForChart"
                type="primary"
                icon="search"
              >
                查询
              </a-button>
              <a-button @click="exportAllPn()" type="primary" icon="export">
                导出
              </a-button>
              <!-- <a-button-group v-if="showKey === 'cx'">
                <a-button :size="'small'" @click="changeSelect('left')" :class="['buttonstyle', 'left', { buttonactive: selected === 'left' }]">X-Z</a-button>
                <a-button :size="'small'" @click="changeSelect('right')" :class="['buttonstyle', 'right', { buttonactive: selected === 'right' }]">Y-Z</a-button>
              </a-button-group> -->
            </div>
            <div style="margin-top: 2px; display: inline-block; width: 100%">
              <div
                v-for="(int, index) in dateMap"
                :key="int.key"
                class="datebox"
              >
                <a-col :span="22">
                  <a-row>
                    <div>{{ int.date }}</div>
                    <div>{{ int.time }}</div>
                  </a-row>
                </a-col>
                <a-col :span="2" style="margin-top: 6px">
                  <a-icon @click="deleteDateTimes(index)" type="close-circle" />
                </a-col>
              </div>
            </div>
            <div style="width: 100%; height: 300px;position: relative;">
              <a-icon v-if="showKey === 'cx'" type="left-circle" @click="changeSelect('left')" :class="{ buttonactive: selected === 'left' }" :style="{ fontSize: '5px', color: '#3CDB95', position: 'absolute', left: '10px', top: '120px', cursor: 'pointer', zIndex: '3' }" />
              <component
                :is="componentName"
                :data="alldata"
                :refid="'allchart'"
                :type="chartsType"
                class="main-content"
              ></component>
              <a-icon v-if="showKey === 'cx'" type="right-circle" @click="changeSelect('right')" :class="{ buttonactive: selected === 'right' }" :style="{ fontSize: '5px', color: '#3CDB95', position: 'absolute', right: '10px', top: '120px', cursor: 'pointer', zIndex: '3' }" />
            </div>
            <div>
              <a-table
                :columns="LineColumns[showKey]"
                :rowKey="(record) => record.id"
                :data-source="sourceAllData"
                :pagination="pagination"
                :scroll="{ y: 180 }"
              >
                <a slot="name" slot-scope="text">{{ text }}</a>
              </a-table>
              <!-- <div class="pnExport" @click="exportAllPn()">
                <img src="static/images/Download拷贝2@2x.png" style="width:19px;height:16px;"/>
                <span style="font-family: 'PingFang SC Heavy';color:#00ebc0;font-size:18px;">导出</span>
              </div> -->
            </div>
          </div>
        </div>
        <div v-else-if="item.key === 'dd'">
          <div>
            <div class="funcboxsingle">
              <label for="">时间</label>
              <a-range-picker
                style="width: 250px"
                :defaultValue="[
                  moment(startDate, dateFormat),
                  moment(endDate, dateFormat),
                ]"
                @change="changeSingleDate"
              ></a-range-picker>
              <a-button
                style="margin-left: 10px"
                @click="getSingleChartData"
                type="primary"
                icon="search"
              >
                查询
              </a-button>
              <a-button @click="exportSinglePn()" type="primary" icon="export">
                导出
              </a-button>
            </div>
            <div style="width: 100%; height: 300px;position: relative;">
              <component
                :is="componentSingleName"
                :refid="'singlechart'"
                :data="singledata"
                :type="chartsType"
                class="main-content"
              ></component>
            </div>
            <div>
              <a-table
                :columns="LineSingleColumns[showKey]"
                :rowKey="(record) => record.id"
                :data-source="sourceSingleData"
                :pagination="pagination"
                :scroll="{ y: 220 }"
              >
                <a slot="name" slot-scope="text">{{ text }}</a>
              </a-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RangeDate from "@/components/datetime/RangeDate";
import Echarts2D from "@/components/echarts/Echarts2D.vue";
import Echarts from "@/components/echarts/Echarts.vue";
import EchartsArr from "@/components/echarts/EchartsArr.vue";
import EchartsoLine from "@/components/echarts/EchartsoLine.vue";
import EchartsLine from "@/components/echarts/EchartsLine.vue";
import EchartsThinbar from "@/components/echarts/EchartsThinbar.vue";
import EchartsPolar from "@/components/echarts/EchartsPolar.vue";
import EchartsWave from "@/components/echarts/EchartsWave.vue";
import EchartsScatter from "@/components/echarts/EchartsScatter.vue";
import EchartsArrLine from "@/components/echarts/EchartsArrLine.vue";
import moment from "moment";
import { Empty } from 'ant-design-vue';
export default {
  name: "SurveyDetail",
  components: {
    Echarts2D, // 二维折线图
    EchartsWave,
    Echarts,
    EchartsArr,
    RangeDate,
    EchartsoLine,
    EchartsLine,
    EchartsThinbar,
    EchartsPolar,
    EchartsScatter,
    EchartsArrLine
  },
  data() {
    return {
      openMenu: false,
      nodeValue: 0,
      singledata: [],
      alldata: [],
      nodeMap: [
        {
          key: 0,
          name: "全部节点",
        },
        {
          key: 1,
          name: "节点1",
        },
      ],
      filters: [],
      sourceAllData: [],
      sourceSingleData: [],
      chartsType: "x",
      selected: "left",
      timeQuantum: "",
      dateMap: [],
      LineSingleColumns: {
        cj: [
          {
            title: "时间",
            dataIndex: "time",
            key: "time",
            width: "50%",
          },
          {
            title: "沉降Z",
            dataIndex: "z",
            key: "z",
            width: "25%",
          },
        ],
        cx: [
          {
            title: "时间",
            dataIndex: "time",
            key: "time",
            width: "30%",
          },
          {
            title: "测斜X",
            dataIndex: "x",
            key: "x",
            width: "20%",
          },
          {
            title: "测斜Y",
            dataIndex: "y",
            key: "y",
            width: "20%",
          },
          {
            title: "测斜Z",
            dataIndex: "z",
            key: "z",
            width: "20%",
          },
        ],
      },
      timesMap: [
        { key: "00:00:00", name: "0:00 - 1:00" },
        { key: "01:00:00", name: "1:00 - 2:00" },
        { key: "02:00:00", name: "2:00 - 3:00" },
        { key: "03:00:00", name: "3:00 - 4:00" },
        { key: "04:00:00", name: "4:00 - 5:00" },
        { key: "05:00:00", name: "5:00 - 6:00" },
        { key: "06:00:00", name: "6:00 - 7:00" },
        { key: "07:00:00", name: "7:00 - 8:00" },
        { key: "08:00:00", name: "8:00 - 9:00" },
        { key: "09:00:00", name: "9:00 - 10:00" },
        { key: "10:00:00", name: "10:00 - 11:00" },
        { key: "11:00:00", name: "11:00 - 12:00" },
        { key: "12:00:00", name: "12:00 - 13:00" },
        { key: "13:00:00", name: "13:00 - 14:00" },
        { key: "14:00:00", name: "14:00 - 15:00" },
        { key: "15:00:00", name: "15:00 - 16:00" },
        { key: "16:00:00", name: "16:00 - 17:00" },
        { key: "17:00:00", name: "17:00 - 18:00" },
        { key: "18:00:00", name: "18:00 - 19:00" },
        { key: "19:00:00", name: "19:00 - 20:00" },
        { key: "20:00:00", name: "20:00 - 21:00" },
        { key: "21:00:00", name: "21:00 - 22:00" },
        { key: "22:00:00", name: "22:00 - 23:00" },
        { key: "23:00:00", name: "23:00 - 24:00" },
      ],
      tabsBars: {
        cj: [
          { key: "zh", name: "综合展示" },
          { key: "dd", name: "单节点展示" },
        ],
        cx: [
          { key: "zh", name: "综合展示" },
          { key: "dd", name: "单节点展示" },
        ],
      },
      showKey: "cj",
      dateTimes: undefined,
      activeKey: "zh",
      dataType: "normal",
      dateFormat: "YYYY-MM-DD",
      startDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 1,
        new Date().getDate()
      ).format("yyyy-MM-dd"),
      endDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ).format("yyyy-MM-dd"),
      name: "",
      yname: "",
      selected_index: 0,
      objname: "",
      clickable: false,
      _type: "2D",
      devValueId: "",
      data: [],
      selectRowId: "",
      boundary: [],
      componentName: "",
      componentSingleName: "",
      selectedDevTags: [], // 指标选中列表
      sourceData: [],
      devValueName: "",
      projPnParentId: "",
      queryParams: {},
      chartParams: {},
      className: "",
      rowSelection: {
        type: "radio",
        selectedRows: [],
        selectedRowKeys: [],
        onChange: this.radioChange,
        getCheckboxProps: (record) => ({
          // 单行禁用
          disabled: 1 === 1,
        }),
      },
      moreIndex: "更多",
      columns: [
        {
          title: "序号",
          customRender: (text, record, index) => `${index + 1}`,
          width: "15%",
        },
        {
          title: "时间",
          dataIndex: "time",
          key: "time",
        },
        {
          title: "值",
          dataIndex: "value",
          key: "value",
          width: "15%",
        },
      ],
      paginationInfo: null,
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 10,
        size: "small",
        showTotal: (total, range) => `共 ${total} 条`,
      },
      loading: false,
      hiddenHeight: "35px",
      tagZIndex: 0,
      warnDetailData: {}
    };
  },
  props: {
    HPDevValueNameList: {
      require: true,
    },
    HPPnDetail: {
      require: true,
    },
    HPDevBasic: {
      require: true,
    },
  },
  computed: {
    LineColumns() {
      return {
        cj: [
          {
            title: "时间",
            dataIndex: "time",
            key: "time",
            width: "50%",
            filters: this.filters,
            onFilter: (value, record) => {
              return record.time.indexOf(value) === 0;
            },
          },
          {
            title: "节点号",
            dataIndex: "num",
            key: "num",
            width: "25%",
          },
          {
            title: "沉降Z",
            dataIndex: "z",
            key: "z",
            width: "25%",
          },
        ],
        cx: [
          {
            title: "时间",
            dataIndex: "time",
            key: "time",
            width: "30%",
            filters: this.filters,
            onFilter: (value, record) => {
              return record.time.indexOf(value) === 0;
            },
          },
          {
            title: "节点号",
            dataIndex: "num",
            key: "num",
            width: "20%",
          },
          {
            title: "测斜X",
            dataIndex: "x",
            key: "x",
            width: "20%",
          },
          {
            title: "测斜Y",
            dataIndex: "y",
            key: "y",
            width: "20%",
          },
          {
            title: "测斜Z",
            dataIndex: "z",
            key: "z",
            width: "20%",
          },
        ],
      };
    },
  },
  beforeCreate() {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  },
  created() {
    let indexValueId = this.$attrs.indexValueId;
    console.log("指标id:", this.$attrs);
    console.log("设备信息", this.HPDevBasic);
    console.log("监测点详情", this.HPPnDetail);
    console.log("指标列表", this.HPDevValueNameList);
    if(this.HPDevValueNameList.length !== 0){
      this.warnDetailData.devBasicId = this.HPDevBasic.devBasicId;
      this.warnDetailData.devValueList = this.HPDevValueNameList;
      this.devValueName = this.HPDevValueNameList.find(
        (item) => item.devValueId === indexValueId
      ).devValueName;
      for (let i = 0; i < this.HPDevValueNameList.length; i++) {
        if (this.HPDevValueNameList[i].devValueId === indexValueId) {
          this.devValueId = indexValueId;
          this.onDevValueSelect(this.HPDevValueNameList[i], i);
          return;
        }
      }
    }
  },
  methods: {
    moment,
    handleNodeChange(value) {
      this.openMenu = false
      if (value === 0) {
        this.activeKey = "zh"
      } else {
        this.activeKey = "dd"
      }
      // this.openMenu = false
    },
    handleChangeTable(pagination, filters, sorter) {
      // 将这两个参数赋值给Vue data，用于后续使用
      // this.fetch({
      //   sortField: sortField,
      //   sortOrder: sortOrder,
      //   ...this.queryParams,
      //   ...filters
      // })
    },
    changeSelect(type) {
      console.log(type)
      this.selected = type;
      if (type === "left") {
        this.chartsType = "x";
      } else {
        this.chartsType = "y";
      }
    },
    getDataForChart() {
      let indexValueId = this.$attrs.indexValueId;
      let data = [];
      if (this.dateMap.length > 0) {
        // data.push(moment().format('YYYY-MM-DD HH:mm:ss'))
        this.dateMap.map((item) => {
          data.push(item.key);
        });
      }
      console.log(data.join(","));
      console.log("指标id：", indexValueId);
      let params = {
        devValueId: indexValueId,
        times: data.join(","),
      };
      let url = "warnWeb/wxcWxlAnalysis/analysisWXC";
      this.$post(url, {
        ...params,
      }).then((r) => {
        this.alldata = [];
        this.sourceAllData = [];
        this.filters = [];
        if (JSON.stringify(r.data.data) !== "{}") {
          let data = r.data.data;
          Object.keys(data).map((item) => {
            // this.data.push({data[item].list})
            this.filters.push({
              text: data[item].time,
              value: data[item].time,
            });
            this.nodeMap = [
              {
                key: 0,
                name: "全部节点",
              },
            ];
            data[item].list.map((i, index) => {
              i.time = data[item].time;
              i.num = index + 1;
              this.nodeMap.push({ key: i.num, name: "节点" + i.num });
            });
            this.sourceAllData.push(...data[item].list);
            this.alldata.push(data[item].list);
          });
          console.log('alldata', this.alldata);
          console.log('this.componentName', this.componentName)
          // this.chartsType = this.selected === 'left' ? 'x' : 'y'
          // this.yname = r.data.rightY + ' (' + r.data.unitRight + ')'
          // 数据加载完毕，关闭loading
          this.loading = false;
        } else {
          this.alldata = [];
        }
        this.getSingleChartData();
      });
    },
    getSingleChartData() {
      let indexValueId = this.$attrs.indexValueId;
      let data = [];
      let params = {
        devValueId: indexValueId,
        endTime: this.endDate,
        nodeNum: this.nodeValue,
        startTime: this.startDate,
      };
      let url = "warnWeb/wxcWxlAnalysis/analysisSingleWXC";
      this.$post(url, {
        ...params,
      }).then((r) => {
        if (JSON.stringify(r.data.data) !== "{}") {
          let data = r.data.data;
          this.sourceSingleData = data.list.reverse();
          this.singledata = data.list;
          // this.data = []
          // this.sourceAllData = []
          // this.filters = []
          // Object.keys(data).map(item => {
          //   // this.data.push({data[item].list})
          //   this.filters.push({text: data[item].time, value: data[item].time})
          //   this.nodeMap = []
          //   data[item].list.map((i, index) => {
          //     i.time = data[item].time
          //     i.num = index + 1
          //     this.nodeMap.push({key: i.num, name: '节点' + i.num})
          //   })
          //   this.sourceAllData.push(...data[item].list)
          //   this.data.push(data[item].list)
          // })
          // console.log(this.data)
          // this.chartsType = this.selected === 'left' ? 'x' : 'y'
          // this.yname = r.data.rightY + ' (' + r.data.unitRight + ')'
          // 数据加载完毕，关闭loading
          this.loading = false;
        } else {
          this.singledata = [];
          this.sourceSingleData = [];
        }
      });
    },
    deleteDateTimes(index) {
      this.dateMap.splice(index, 1);
    },
    inputKeydown() {
      this.openMenu = true;
    },
    handleBlurChange() {
      this.openMenu = false;
    },
    handleChange(value) {
      let date = moment(this.dateTimes).format("YYYY-MM-DD");
      let time = value;
      let key = date + " " + time;
      let arr = this.dateMap.filter((item) => item.key === key);
      if (arr.length === 0 && this.dateMap.length < 10) {
        this.dateMap.push({
          key: key,
          date: date,
          time: time,
        });
      }
      this.openMenu = false;
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    onChange(date, dateString) {
      console.log(date, dateString);
      console.log(moment(this.dateTimes).format("YYYY-MM-DD"));
      // this.tempdate = dateString
      this.timeQuantum = "";
      this.openMenu = true;
    },
    changeActive(key) {
      this.activeKey = key;
    },
    changeSingleDate(dates, dateStrings) {
      this.startDate = dateStrings[0];
      this.endDate = dateStrings[1];
    },
    changeDate(dates, dateStrings) {
      this.startDate = dateStrings[0];
      this.endDate = dateStrings[1];
      console.log(this.startDate);
      console.log(this.endDate);
      this.onDevValueSelect(
        this.HPDevValueNameList[this.selected_index],
        this.selected_index
      );
    },
    onClickRow(record, index) {
      return {
        on: {
          click: () => {
            console.log("行事件", record, index);
            if (this.clickable) {
              this.selectRowId = record.id;
              this.chartParams.devValueId = this.devValueId;
              this.chartParams.id = record.id;
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
    onDevValueSelect(item, index) {
      if (this.$attrs.indexValueId !== 0) {
        this.selected_index = this.$attrs.indexValueId;
      } else {
        this.selected_index = index;
      }
      this.hiddenHeight = "35px";
      this.tagZIndex = 0;
      this.moreIndex = "更多";
      console.log('onDevValueSelect', item)
      console.log("-------", this.HPPnDetail);
      this.dataType = "normal";
      // switch (item.devValueDatatype) {
      //   case '0' : this.componentName = 'Echarts2D'
      //     this.chartAndListInit(item, '2D')
      //     this.clickable = false
      //     break
      //   case '1' : this.componentName = 'picShow'
      //     this.chartAndListInit(item, 'pic')
      //     this.clickable = true
      //     break
      //   case 2 : this.componentName = 'EchartsWave'
      //     this.chartAndListInit(item, 'wave')
      //     this.clickable = true
      //     break
      //   case 3 : let arr = item.devValueParam2.split(';')
      //     let type = arr[3]
      //     if (type === '1') {
      //       this.componentName = 'Echarts3D'
      //     } else if (type === '0') {
      //       this.componentName = 'Echarts'
      //       this.name = 'z'
      //       this.objname = 'z'
      //     }
      //     this.chartAndListInit(item, '3D')
      //     this.clickable = true
      //     break
      //   case 4 : this.componentName = 'EchartsArr'
      //     this.chartAndListInit(item, 'arr')
      //     this.clickable = true
      //     break
      // }
      let devModelId = this.HPPnDetail.devModelId;
      console.log('devModelId', devModelId)
      let type = this.HPPnDetail.setInclin;
      if (devModelId === 33) {
        this.dataType = "line";
        if (type === "1") {
          //测斜
          this.componentName = "EchartsArrLine";
          this.componentSingleName = "EchartsXYLine";
          this.showKey = "cx";
          console.log("测斜");
          this.chartsType = "x";
        } else if (type === "0") {
          // 沉降
          this.componentName = "EchartsArrLine";
          this.componentSingleName = "EchartsZLine";
          this.showKey = "cj";
          console.log("沉降");
          this.chartsType = "节点";
        }
        this.getDataForChart();
      } else {
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
      }
    },
    chartAndListInit(item, type) {
      console.log("初始化列表", item);
      // this.queryParams.projPnParentId = this.HPPnDetail.projPnParentId
      // this.queryParams.devValueStrId = item.devValueStrId
      this.queryParams.devValueId = item.devValueId;
      this.devValueId = item.devValueId;
      this.boundary = item.boundary;
      // this.queryParams.devBasicId = this.HPDevBasic.devBasicId
      this.queryParams.pnId = this.HPPnDetail.projPnId;
      this.queryParams.startDate = this.startDate;
      this.queryParams.endDate = this.endDate;
      this.queryParams.type = type;
      this._type = type;
      // this.chartParams.projPnParentId = this.HPPnDetail.projPnParentId
      this.chartParams.devBasicId = this.HPDevBasic.devBasicId;
      this.chartParams.pnId = this.HPPnDetail.projPnId;
      // this.chartParams.devValueStrId = item.devValueStrId
      this.chartParams.devValueId = item.devValueId;
      this.chartParams.devValueName = item.devValueName;
      this.chartParams.startDate = this.startDate;
      this.chartParams.endDate = this.endDate;
      this.devValueName = item.devValueName;
      this.projPnParentId = this.HPPnDetail.projPnParentId;
      //  this.devValueStrId = item.devValueStrId
      this.searchSourceDataList(this.queryParams);
      this.selectedDevTags = [];
      this.selectedDevTags.push(item);
      // console.log('选中指标:',this.selectedDevTags)
      if (type === "2D") {
        this.updateChart(this.chartParams);
      }
    },
    handleTableChange(pagination) {
      let _this = this;
      this.fetch({
        pnId: _this.HPPnDetail.projPnId,
        //devBasicId: _this.HPDevBasic.devBasicId,
        devValueId: _this.devValueId,
        // projPnParentId: _this.HPPnDetail.projPnParentId,
        // devValueStrId: _this.devValueStrId,
        pageSize: pagination.pageSize,
        pageNum: pagination.current,
        type: _this._type,
      });
    },
    searchSourceDataList(queryParams = {}) {
      if (queryParams) {
        this.queryParams = queryParams;
      }
      this.fetch({
        ...this.queryParams,
      });
    },
    fetch(params = {}) {
      this.loading = true;
      if (typeof params.pageSize === "undefined") {
        params.pageSize = this.pagination.defaultPageSize;
        params.pageNum = this.pagination.defaultCurrent;
      }
      // params.devBasicId = this.HPDevBasic.devBasicId
      params.pnId = this.HPPnDetail.projPnId;
      params.devValueId = this.devValueId;
      params.startDate = this.startDate;
      params.endDate = this.endDate;
      this.$get("warnWeb/homePage/devValueDataList", { ...params }).then(
        (r) => {
          let data = r.data.data;
          // if (data.result.length === 0) {
          //   return
          // }
          const pagination = { ...this.pagination };
          pagination.total = data.count;
          this.sourceData = data.result;
          this.pagination = pagination;
          // 数据加载完毕，关闭loading
          this.loading = false;
          this.chartParams.devValueId = params.devValueId;
          if (data.result.length === 0) {
            this.data = "";
          } else {
            this.chartParams.type = params.type;
            let type = params.type;
            this.chartParams.id = data.result[0].id;
            console.log(type);
            if (type !== "2D") {
              this.selectRowId = data.result[0].id;
              this.updateChart2(this.chartParams);
            }
          }
        }
      );
      /* if (!params.projPnParentId || !params.devBasicId || !params.devValueStrId) {
        return
      }
      // 显示loading
      this.loading = true
      if (typeof (params.pageSize) === 'undefined') {
        params.pageSize = this.pagination.defaultPageSize
        params.pageNum = this.pagination.defaultCurrent
      }
      params.sortField = 'time'
      params.sortOrder = 'desc'
      let url = '/api/data/query/' + params.projPnParentId + '/' + params.devBasicId + '/' + params.devValueStrId
      this.$get(url, {
        ...params
      }).then((r) => {
        let data = r.data.result
        const pagination = { ...this.pagination }
        pagination.total = data.count
        this.sourceData = data.result
        this.pagination = pagination
        // 数据加载完毕，关闭loading
        this.loading = false
        this.chartParams.devValueId = params.devValueId
        this.chartParams.id = data.result[0].id
        if (type !== '2D') {
          this.selectRowId = data.result[0].id
          this.updateChart2(this.chartParams)
        }
      }) */
    },
    updateChart(params = {}) {
      this.loading = true;
      // let url = '/api/data/query/' + params.projPnParentId + '/' + params.devBasicId + '/' + params.devValueStrId + '/' + params.id
      let url = "warnWeb/processLine/timeValue";
      this.$get(url, {
        ...params,
      }).then((r) => {
        if (JSON.stringify(r.data) !== "{}") {
          this.data = r.data.list;
          this.yname = r.data.rightY + " (" + r.data.unitRight + ")";
          // 数据加载完毕，关闭loading
          this.loading = false;
        }
      });
    },
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
    updateChart2(params = {}) {
      this.loading = true;
      // let url = '/api/data/query/' + params.projPnParentId + '/' + params.devBasicId + '/' + params.devValueStrId + '/' + params.id
      let url = "warnWeb/homePage/valueDetail";
      this.$get(url, {
        ...params,
      }).then((r) => {
        if (JSON.stringify(r.data) !== "{}" && r.data.code !== -1) {
          if (params.type === "pic") {
            let url = r.data.data.b64data;
            this.data = "data:image/png;base64," + url;
          } else if (params.type === "arr") {
            let data = r.data.data.wxStringList;
            this.data = data;
            let name = this.getStringName(params.devValueStrId).name;
            let objname = this.getStringName(params.devValueStrId).objname;
            this.name = name;
            this.objname = objname;
            console.log(data);
            console.log(name);
            console.log(objname);
          } else {
            let arr = r.data.data.shiftList;
            let data = [];
            arr.forEach((item, index, array) => {
              data.push([item.x, item.y, item.z]);
            });
            this.data = data;
            console.log(data);
          }
          // 数据加载完毕，关闭loading
          this.loading = false;
        }
      });
    },
    showMoreTarget() {
      if (this.hiddenHeight === "35px") {
        this.hiddenHeight = "auto";
        this.tagZIndex = 9999999999;
        this.moreIndex = "收起";
      } else if (this.hiddenHeight === "auto") {
        this.hiddenHeight = "35px";
        this.tagZIndex = 0;
        this.moreIndex = "更多";
      }
    },
    // 监测数据导出
    exportPn() {
      let _this = this;
      let params = {};
      params.devValueId = _this.devValueId;
      params.startDate = _this.startDate;
      params.endDate = _this.endDate;
      // params.devBasicId = _this.HPDevBasic.devBasicId
      params.pnId = _this.HPPnDetail.projPnId;
      this.$export("warnWeb/homePage/pnDetailsToExcel", { ...params }).then(
        (r) => {
          console.log(r.data);
        }
      );
    },
    exportAllPn() {
      let indexValueId = this.$attrs.indexValueId;
      let data = [];
      if (this.dateMap.length > 0) {
        // data.push(moment().format('YYYY-MM-DD HH:mm:ss'))
        this.dateMap.map((item) => {
          data.push(item.key);
        });
      }
      let params = {};
      params.devValueId = indexValueId;
      params.times = data.join(",");
      this.$export("warnWeb/wxcWxlAnalysis/exportAnalysisWXC", {
        ...params,
      }).then((r) => {});
    },
    exportSinglePn() {
      let indexValueId = this.$attrs.indexValueId;
      let params = {};
      params.devValueId = indexValueId;
      params.startTime = this.startDate;
      params.endTime = this.endDate;
      params.nodeNum = this.nodeValue;
      this.$export("warnWeb/wxcWxlAnalysis/exportAnalysisSingleWXC", {
        ...params,
      }).then((r) => {});
    },
    chartsID(index) {
      return "charts_" + index;
    },
  },
  watch: {
    HPDevValueNameList(val) {
      console.log("指标列表HPDevValueNameList", val);
      let indexValueId = this.$attrs.indexValueId;
      this.warnDetailData.devBasicId = this.HPDevBasic.devBasicId;
      this.warnDetailData.devValueList = val;
      if(val.length !== 0){
        this.devValueName = val.find(
          (item) => item.devValueId === indexValueId
        ).devValueName;
        for (let i = 0; i < val.length; i++) {
          if (val[i].devValueId === indexValueId) {
            console.log("监听指标id:", indexValueId);
            this.onDevValueSelect(val[i], i);
            return;
          }
        }
      }
    },
  },
};
/**
 *对Date的扩展，将 Date 转化为指定格式的String
 *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *例子：
 *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, // 月份
    "d+": this.getDate(), // 日
    "h+": this.getHours(), // 小时
    "m+": this.getMinutes(), // 分
    "s+": this.getSeconds(), // 秒
    "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  }
  return fmt;
};
</script>

<style lang="less" scoped>
.funcboxall {
  margin-left: 330px;
}
.funcboxall label {
  width: 27px;
  height: 14px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #99c8cc;
  margin-right: 5px;
}
.funcboxsingle {
  margin-left: 490px;
}
.funcboxsingle label {
  width: 27px;
  height: 14px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #99c8cc;
  margin-right: 5px;
}
.nodebox {
  position: absolute;
  margin-top: 10px;
  margin-left: 35px;
}
.buttonactive {
  color: #65716e !important;
}
.ant-calendar-picker-icon {
  display: inline-block;
  color: rgba(255, 255, 255, 0.25) !important;
  font-size: 14px;
  line-height: 1;
}
.survey-tabs-bar {
  height: 35px;
}
.survey-tabs-bar > div {
  float: left;
  color: rgba(162, 233, 225, 0.5);
  border: 1px solid;
  margin: 1px;
  padding: 5px;
  cursor: pointer;
}
.datebox {
  float: left;
  margin: 5px;
  padding: 0px 10px;
  background: rgba(8, 60, 64, 0.5);
  border: 1px solid #1f7354;
  border-radius: 3px;
}
.datebox > div {
  font-size: 10px;
}
.survey-tabs-bar > div.active {
  color: #46ffac;
}
.survey-tabs-panel {
  width: 99%;
  height: calc(100vh - 210px);
  float: left;
  display: none;
}
.survey-tabs-panel > div {
  padding: 10px;
  height: 100%;
  width: 100%;
  color: white;
}
.survey-tabs-panel.active {
  display: block;
}
.SDactive {
  background-color: rgba(197, 243, 255, 0.5) !important;
}
.HPDevValueName div {
  margin: 5px;
}
.ant-tag-more {
  font-family: "PingFang SC Medium";
  font-size: 14px;
  color: #f79241;
  padding: 0 5px;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  border: 1px solid rgba(247, 146, 65, 0.6);
  box-shadow: 0 0 5px rgba(247, 146, 65, 0.7) inset;
  -webkit-box-shadow: 0 0 5px rgb(247, 146, 65, 0.7) inset;
  -moz-box-shadow: 0 0 5px rgba(247, 146, 65, 0.7) inset;
  -o-box-shadow: 0 0 5px rgba(247, 146, 65, 0.7) inset;
}
.pnExport {
  border: 1px solid #3cdb95;
  background: rgba(70, 255, 172, 0.2);
  padding: 0.5rem;
  cursor: pointer;
  opacity: 0.8;
  margin-left: 1rem;
  border-radius: 2;
  span {
    color: #46ffac;
    font-size: 1.6rem;
    font-family: "Microsoft YaHei UI";
    font-weight: 400;
  }
  &:hover {
    opacity: 1;
  }
}
.index-safety {
  border: 1px solid #0c666a;
  margin-left: 1rem;
  padding: 0 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>
