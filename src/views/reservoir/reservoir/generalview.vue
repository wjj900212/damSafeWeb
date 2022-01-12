<template>
  <div style="width: 100%; height: 100%">
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="12" :style="{ height: '100%' }">
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
                <img v-if="reservoirInfo.images" width="200" height="100" :src="reservoirInfo.images" />
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
                  <a-col>{{ reservoirInfo.safeLevel }}</a-col>
                </a-row>
              </a-col>
              <a-col :span="12">
                <a-row>
                  <a-col :span="24">预警数</a-col>
                </a-row>
                <a-row>
                  <a-col :span="24">{{ reservoirInfo.warnCount }}</a-col>
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
                  <a-col :span="12">{{ item.warnLevel }}</a-col>
                </a-row>
                <!-- <a-row>
                  <a-col :span="12">水情监测</a-col>
                  <a-col :span="12">正常</a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">渗流监测</a-col>
                  <a-col :span="12">正常</a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">渗压监测</a-col>
                  <a-col :span="12">正常</a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">变形监测</a-col>
                  <a-col :span="12">正常</a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">微动监测</a-col>
                  <a-col :span="12">正常</a-col>
                </a-row> -->
              </a-col>
            </a-row>
          </a-card-grid>
        </a-card>
      </a-col>
      <a-col :span="12" :style="{ height: '100%' }">
        <a-card title="水库可视化" :bodyStyle="{ padding: '5px' }">
          <a-select
            slot="extra"
            v-model="scene"
            placeholder="选择场景"
            option-filter-prop="children"
            @change="handleSceneChange"
          >
            <a-select-option
              v-for="item in sceneData"
              :value="item.sceneId"
              :key="item.sceneId"
            >
              {{ item.sceneName }}
            </a-select-option>
          </a-select>
          <div style="width: 100%;height:420px; text-align: center;overflow: auto;padding: 5px;">
            <design :data="designData"></design>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="24">
        <a-card title="安全管理预案">
          <a-select
            slot="extra"
            style="width:120px;"
            v-model="plan"
            placeholder="预案类型"
            option-filter-prop="children"
            @change="handlePlanChange"
          >
            <a-select-option
              v-for="item in planData"
              :value="item.id"
              :key="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-card-grid style="width: 100%; text-align: center">
            <a-table
              bordered
              :data-source="aqglyadataSource"
              :columns="aqglyacolumns"
            >
            </a-table>
          </a-card-grid>
        </a-card>
      </a-col>
    </a-row>
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="24">
        <a-card title="综合趋势统计">
          <div slot="extra">
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
            <a-button @click="getTrendStatistics" type="primary"> 查询 </a-button>
            <a-button type="primary"> 导出 </a-button>
          </div>
          <a-card-grid style="width: 100%">
            <a-row>
              <a-col :span="6">
                <div>
                  <a-input-search
                    v-model="searchStr"
                    style="margin-bottom: 8px"
                    placeholder="搜索监测点"
                    @change="onChange"
                  />
                  <a-tree
                    checkable
                    @check="onChecked"
                    :checkedKeys="checkedKeys"
                    :expandedKeys="expandedKeys"
                    :autoExpandParent="autoExpandParent"
                    :replaceFields="replaceFields"
                    :defaultExpandAll="defaultExpandAll"
                    :treeData="treeData"
                    @expand="onExpand"
                  >
                    <template slot="title" slot-scope="{ name }">
                      <span
                        v-html="
                          name.replace(
                            new RegExp(searchValue, 'g'),
                            '<span style=color:#f50>' + searchValue + '</span>'
                          )
                        "
                      ></span>
                    </template>
                  </a-tree>
                </div>
              </a-col>
              <a-col :span="18">
                <div :style="{width: '100%', height: '300px'}">
                  <component
                    :is="'EchartsRelationship'"
                    refid="Relationship"
                    :data="relationshipData"
                    class="main-content"
                  ></component>
                </div>
              </a-col>
            </a-row>
          </a-card-grid>
        </a-card>
      </a-col>
    </a-row>
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="12">
        <a-card title="雨情监测">
          <a slot="extra" href="#">查看详情</a>
          <a-card-grid style="width: 100%; text-align: left">
            <a-row>
              <a-col :span="2">
                <img width="36" height="34" src="static/img/u295.png" alt="" />
              </a-col>
              <a-col :span="19">
                <a-row>
                  <a-col>
                    <h4 style="float: left">雨情</h4>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="4"> 安全状态 </a-col>
                  <a-col :span="3"> 正常 </a-col>
                  <a-col :span="4"> 当前降水量 </a-col>
                  <a-col :span="3"> 29.2mm </a-col>
                  <a-col :span="4"> 日降水量 </a-col>
                  <a-col :span="6"> 52.2mm </a-col>
                </a-row>
              </a-col>
              <a-col :span="3">
                <a-select
                  v-model="monitor"
                  placeholder="监测点"
                  option-filter-prop="children"
                  @change="handleMonitorChange"
                >
                  <a-select-option
                    v-for="item in monitorData"
                    :value="item.id"
                    :key="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-card-grid>
          <a-card-grid style="width: 100%; text-align: center">
            <div :style="{ width: '100%', height: '320px' }">
              <component
                :is="'EchartsBarLine'"
                refid="BarLine"
                :data="radarData"
                class="main-content"
              ></component>
            </div>
          </a-card-grid>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="水情监测">
          <a slot="extra" href="#">查看详情</a>
          <a-card-grid style="width: 100%; text-align: left">
            <a-row>
              <a-col :span="2">
                <img width="36" height="34" src="static/img/u319.png" alt="" />
              </a-col>
              <a-col :span="19">
                <a-row>
                  <a-col>
                    <h4 style="float: left">水情</h4>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="4"> 安全状态 </a-col>
                  <a-col :span="3"> 正常 </a-col>
                  <a-col :span="4"> 当前水位 </a-col>
                  <a-col :span="3"> 29.2mm </a-col>
                  <a-col :span="5"> 历史最大水位 </a-col>
                  <a-col :span="5"> 39.2mm </a-col>
                </a-row>
              </a-col>
              <a-col :span="3">
                <a-select
                  v-model="monitor"
                  placeholder="监测点"
                  option-filter-prop="children"
                  @change="handleMonitorChange"
                >
                  <a-select-option
                    v-for="item in monitorData"
                    :value="item.id"
                    :key="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-card-grid>
          <a-card-grid style="width: 100%; text-align: center"></a-card-grid>
        </a-card>
      </a-col>
    </a-row>
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="24">
        <a-card title="微动监测数据统计">
          <div slot="extra">
            <a-button type="primary"> 查询 </a-button>
            <a-button type="primary"> 导出 </a-button>
          </div>
          <a-card-grid style="width: 100%; text-align: center">

          </a-card-grid>
        </a-card>
      </a-col>
    </a-row>
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="8">
        <a-card title="渗流监测">
          <a slot="extra" href="#">查看详情</a>
          <a-card-grid style="width: 100%; text-align: left">
            <a-row>
              <a-col :span="3">
                <img width="36" height="34" src="static/img/u309.png" alt="" />
              </a-col>
              <a-col :span="15">
                <a-row>
                  <a-col>
                    <h4 style="float: left">渗流</h4>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="8"> 安全状态 </a-col>
                  <a-col :span="16"> 正常 </a-col>
                </a-row>
                <a-row>
                  <a-col :span="8"> 当前降水量 </a-col>
                  <a-col :span="16"> 29.2mm </a-col>
                </a-row>
                <a-row>
                  <a-col :span="8"> 日降水量 </a-col>
                  <a-col :span="16"> 52.2mm </a-col>
                </a-row>
              </a-col>
              <a-col :span="6">
                <a-select
                  v-model="monitor"
                  placeholder="监测点"
                  option-filter-prop="children"
                  @change="handleMonitorChange"
                >
                  <a-select-option
                    v-for="item in monitorData"
                    :value="item.id"
                    :key="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-card-grid>
          <a-card-grid style="width: 100%; text-align: center"></a-card-grid>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="渗压监测">
          <a slot="extra" href="#">查看详情</a>
          <a-card-grid style="width: 100%; text-align: left">
            <a-row>
              <a-col :span="3">
                <img width="36" height="34" src="static/img/u550.png" alt="" />
              </a-col>
              <a-col :span="15">
                <a-row>
                  <a-col>
                    <h4 style="float: left">240断面渗压</h4>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="8"> 安全状态 </a-col>
                  <a-col :span="16"> 正常 </a-col>
                </a-row>
                <a-row>
                  <a-col :span="8"> 水位高程 </a-col>
                  <a-col :span="16">
                    <a-row>
                      <a-col :span="8">45m(坝顶) </a-col>
                      <a-col :span="8">34m(坝中) </a-col>
                      <a-col :span="8">23m(坝底)</a-col>
                    </a-row>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="8"> 水头 </a-col>
                  <a-col :span="16">
                    <a-row>
                      <a-col :span="8">5m(坝顶) </a-col>
                      <a-col :span="8">4m(坝中) </a-col>
                      <a-col :span="8">3m(坝底)</a-col>
                    </a-row>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="6">
                <a-select
                  v-model="monitor"
                  placeholder="监测点"
                  option-filter-prop="children"
                  @change="handleMonitorChange"
                >
                  <a-select-option
                    v-for="item in monitorData"
                    :value="item.id"
                    :key="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-card-grid>
          <a-card-grid style="width: 100%; text-align: center"></a-card-grid>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="变形监测">
          <a slot="extra" href="#">查看详情</a>
          <a-card-grid style="width: 100%; text-align: left">
            <a-row>
              <a-col :span="3">
                <img width="36" height="34" src="static/img/u209.png" alt="" />
              </a-col>
              <a-col :span="15">
                <a-row>
                  <a-col>
                    <h4 style="float: left">变形监测-01</h4>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="8"> 安全状态 </a-col>
                  <a-col :span="16"> 正常 </a-col>
                </a-row>
                <a-row>
                  <a-col :span="8"> 最大位移值 </a-col>
                  <a-col :span="16">
                    <a-row>
                      <a-col :span="24">位移X （东）+0.2mm </a-col>
                    </a-row>
                    <a-row>
                      <a-col :span="24">位移Y （北）+0.2mm </a-col>
                    </a-row>
                    <a-row>
                      <a-col :span="24">位移Z （高）+0.2mm </a-col>
                    </a-row>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="6">
                <a-select
                  v-model="monitor"
                  placeholder="监测点"
                  option-filter-prop="children"
                  @change="handleMonitorChange"
                >
                  <a-select-option
                    v-for="item in monitorData"
                    :value="item.id"
                    :key="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-card-grid>
          <a-card-grid style="width: 100%; text-align: center"></a-card-grid>
        </a-card>
      </a-col>
    </a-row>
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="12">
        <a-card>
          <div slot="title">
            <span>预警消息</span
            ><span style="font-size: 10px; margin-left: 10px; color: darkgray"
              >今日 246条消息</span
            >
          </div>
          <a slot="extra" href="#">更多消息</a>
          <a-card-grid style="width: 100%; text-align: center; padding: 0px">
            <a-list bordered :dataSource="warnData">
              <a-list-item slot="renderItem" slot-scope="item">
                {{ item }}
              </a-list-item>
            </a-list>
          </a-card-grid>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="运维记录">
          <a slot="extra" href="#">查看更多</a>
          <a-card-grid style="width: 100%; text-align: center"></a-card-grid>
        </a-card>
      </a-col>
    </a-row>
    <a-modal v-model="planVisible" title="安全预案管理">
      <div v-html="planDetail"></div>
      <template slot="footer">
        <a-button type="primary">
          关闭
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import design from "@/components/design/design.vue";
import EchartsRadar from "@/components/echarts/EchartsRadar.vue";
import EchartsRelationship from "@/components/echarts/EchartsRelationship.vue";
import EchartsBarLine from "@/components/echarts/EchartsBarLine.vue";
import { mapState } from 'vuex'
import moment from "moment";

export default {
  name: "generalview",
  components: {
    design,
    EchartsRadar,
    EchartsRelationship,
    EchartsBarLine
  },
  data() {
    return {
      autoExpandParent: true,
      defaultExpandAll: true,
      planVisible: false,
      planDetail: '',
      reservoirInfo: {},
      radarData: [],
      relationshipData: [],
      dateTimeValue: [
        moment(new Date(), "YYYY-MM-DD"),
        moment(new Date(), "YYYY-MM-DD"),
      ],
      dateModel: "now",
      dateModelData: [
        { name: "今日", value: "now" },
        { name: "近三天", value: "day" },
        { name: "近一周", value: "week" },
        { name: "近一月", value: "month" },
      ],
      designData: {},
      warnData: [],
      monitor: 1,
      monitorData: [],
      dataSource: [],
      checkedKeys: [],
      expandedKeys: [],
      replaceFields: { title: "name" },
      searchValue: "",
      searchStr: "",
      treeData: [],
      aqglyadataSource: [],
      scene: undefined,
      sceneData: [],
      monitorData: [
        { id: 1, name: "监测点1" },
        { id: 2, name: "监测点2" },
        { id: 3, name: "监测点3" },
      ],
      plan: 'all',
      planData: [
        { id: 'all', name: "全部预案" },
        { id: '0', name: "综合预案" },
        { id: '11', name: "渗流监测" },
        { id: '12', name: "渗压监测" },
        { id: '13', name: "大坝变形监测" },
        { id: '14', name: "大坝微动监测" },
        { id: '15', name: "雨情监测" },
        { id: '16', name: "水情监测" }
      ],
    };
  },
  computed: {
    ...mapState({
      reservoirId: state => state.account.reservoirId
    }),
    aqglyacolumns() {
      return [
        {
          title: "序号",
          width: "5%",
          align: "center",
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: "预案名称",
          dataIndex: "reserveName",
          align: "center",
          width: "15%",
        },
        {
          title: "预案类型",
          dataIndex: "reserveType",
          align: "center",
          width: "10%",
          customRender: (text, record, index) => `${this.planData.find(item => item.id === text).name}`
        },
        {
          title: "创建人",
          dataIndex: "username",
          align: "center",
          width: "10%",
        },
        {
          title: "描述",
          dataIndex: "desc",
          align: "center",
          width: "50%",
        },
        {
          title: "操作",
          width: "100px",
          align: "center",
          customRender: (record) => (
            record.details ? 
            (
              <div>
                <a
                  onClick={() => {
                    this.showPlanDetail(record.details)
                  }}
                >
                  查看
                </a>
              </div> 
            ) : 
            (
              ''
            )
          ),
        },
      ];
    },
  },
  mounted() {
    this.getReservoirInfo()
    this.getDesignConfig()
    this.getPlanList()
    this.getTrendStatistics()
    this.getProjPnTreeList()
  },
  watch: {
    reservoirId (val) { // 监听数据发生改变 刷新图表数据
      this.getReservoirInfo()
      this.getDesignConfig()
      this.getPlanList()
      this.getTrendStatistics()
      this.getProjPnTreeList()
    }
  },
  updated() {},
  methods: {
    moment,
    showPlanDetail (content) {
      this.planVisible = true
      this.planDetail = content
    },
    getProjPnTreeList () {
      const { reservoirId } = this
      const params = {
        reservoirId: reservoirId
      }
      this.$get('web/reservoirOverview/getProjPnList', {
        ...params,
      }).then((r) => {
        if (r.data.data !== null) {
          let data = r.data.data
          this.treeData = data.treeData
        }
      })
    },
    getDesignConfig () {
      const { reservoirId } = this
      const params = {
        hiddenId: reservoirId,
        sceneType: '0'
      }
      this.$get('web/hiddenScene/getHiddenConfigInfo', {
        ...params,
      }).then((r) => {
        if (r.data.data !== null) {
          let data = r.data.data
          this.sceneData = data
          if (data.length > 0) {
            this.scene = data[0].sceneId
            this.designData = data[0]
          } else {
            this.designData = {}
          }
          // data.safeLevelObj = this.getWarnText(data.safeLevel)
          // this.reservoirInfo = data
          // this.radarData = data.monitorList
        }
      })
    },
    getReservoirInfo () {
      const { reservoirId } = this
      const params = {
        reservoirId: reservoirId
      }
      this.$get('web/reservoirOverview/safetyOverview', {
        ...params,
      }).then((r) => {
        if (JSON.stringify(r.data.data) !== "{}" && r.data.data !== null) {
          let data = r.data.data
          // data.safeLevelObj = this.getWarnText(data.safeLevel)
          this.reservoirInfo = data
          this.radarData = data.monitorList
        } else {
          this.reservoirInfo = {}
          this.radarData = []
        }
      })
    },
    getWarnText () {
    },
    getTrendStatistics () {
      const { reservoirId } = this
      const start = moment(this.dateTimeValue[0]).format("YYYY-MM-DD");
      const end = moment(this.dateTimeValue[1]).format("YYYY-MM-DD");
      const ids = this.getCheckedIds()
      console.log(this.checkedKeys)
      let params = {
        reservoirId: reservoirId,
        startTime: start,
        endTime: end
      }
      if (ids.length > 0) {
        params.projPnIds = ids.join(',')
      }
      this.$get('web/reservoirOverview/trendStatistics', {
        ...params,
      }).then((r) => {
        if (JSON.stringify(r.data.data) !== "{}" && r.data.data !== null) {
          this.relationshipData = r.data.data
        } else {
          this.relationshipData = []
        }
      })
    },
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
      this.dateModel = undefined;
    },
    handleMonitorChange() {},
    handleSceneChange(value) {
      const data = this.sceneData.find(item => item.sceneId === value)
      this.designData = data
    },
    handlePlanChange(value) {
      this.getPlanList(value)
    },
    getPlanList (type) {
      let params = {}
      if (type && type !== 'all') {
        params.reserveType = type
      }
      this.$get('web/reservoirPlan/getPlanListNoPage', {
        ...params,
      }).then((r) => {
        if (JSON.stringify(r.data.data) !== "{}" && r.data.data !== null) {
          this.aqglyadataSource = r.data.data
        } else {
          this.aqglyadataSource = []
        }
      })
    },
    getCheckedIds () {
      let ids = []
      let pids = this.treeData.map(item => item.key)
      let checkedKeys = this.checkedKeys
      for (let i = 0; i < checkedKeys.length; i++) {
        if (!pids.includes(checkedKeys[i])) {
          ids.push(checkedKeys[i])
        }
      }
      return ids
    },
    onChecked (checkedKeys, e) {
      this.checkedKeys = checkedKeys
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    // 获取节点中含有value的所有key集合
    getkeyList(value, tree, keyList) {
      // 遍历所有同一级的树
      for (let i = 0; i < tree.length; i++) {
        let node = tree[i];
        // 如果该节点存在value值则push
        if (node.name.indexOf(value) > -1) {
          keyList.push(node.key);
        }
        // 如果拥有孩子继续遍历
        if (node.children) {
          this.getkeyList(value, node.children, keyList);
        }
      }
      // 因为是引用类型，所有每次递归操作的都是同一个数组
      return keyList;
    },
    // 该递归主要用于获取key的父亲节点的key值
    getParentKey(key, tree) {
      let parentKey, temp;
      // 遍历同级节点
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          // 如果该节点的孩子中存在该key值，则该节点就是我们要找的父亲节点
          // 如果不存在，继续遍历其子节点
          if (node.children.some((item) => item.key === key)) {
            parentKey = node.key;
          } else if ((temp = this.getParentKey(key, node.children))) {
            // parentKey = this.getParentKey(key,node.children)
            // 改进，避免二次遍历
            parentKey = temp;
          }
        }
      }
      return parentKey;
    },
    // 获取该节点的所有祖先节点
    getAllParentKey(key, tree) {
      var parentKey;
      if (key) {
        // 获得父亲节点
        parentKey = this.getParentKey(key, tree);
        if (parentKey) {
          // 如果父亲节点存在，判断是否已经存在于展开列表里，不存在就进行push
          if (!this.backupsExpandedKeys.some((item) => item === parentKey)) {
            this.backupsExpandedKeys.push(parentKey);
          }
          // 继续向上查找祖先节点
          this.getAllParentKey(parentKey, tree);
        }
      }
    },
    getTreeDataByKey(childs = [], findKey) {
      // 根据key找到数据对象
      let finditem = null;
      for (let i = 0, len = childs.length; i < len; i++) {
        let item = childs[i];
        if (item.key !== findKey && item.children && item.children.length > 0) {
          finditem = this.getTreeDataByKey(item.children, findKey);
        }
        if (item.key == findKey) {
          finditem = item;
        }
        if (finditem != null) {
          break;
        }
      }
      return finditem;
    },
    getTreeParentChilds(childs = [], findKey) {
      // 根据key获取父级节点children数组
      let parentChilds = [];
      for (let i = 0, len = childs.length; i < len; i++) {
        let item = childs[i];
        if (item.key !== findKey && item.children && item.children.length > 0) {
          parentChilds = this.getTreeParentChilds(item.children, findKey);
        }
        if (item.key == findKey) {
          parentChilds = childs;
        }
        if (parentChilds.length > 0) {
          break;
        }
      }
      return parentChilds;
    },
    onChange() {
      var vm = this;
      // 添加这行代码是为了只点击搜索才触发
      vm.searchValue = vm.searchStr;
      // 如果搜索值为空，则不展开任何项，expandedKeys置为空
      // 如果搜索值不位空，则expandedKeys的值要为搜索值的父亲及其所有祖先
      if (vm.searchValue === "") {
        vm.expandedKeys = [];
      } else {
        // 首先将展开项与展开项副本置为空
        vm.expandedKeys = [];
        vm.backupsExpandedKeys = [];
        // 获取所有存在searchValue的节点
        let candidateKeysList = vm.getkeyList(vm.searchValue, vm.treeData, []);
        // 遍历满足条件的所有节点
        candidateKeysList.map((item) => {
          // 获取每个节点的母亲节点
          var key = vm.getParentKey(item, vm.treeData);
          // 当item是最高一级，父key为undefined，将不放入到数组中
          // 如果母亲已存在于数组中，也不放入到数组中
          if (key && !vm.backupsExpandedKeys.some((item) => item === key)) {
            vm.backupsExpandedKeys.push(key);
          }
        });
        let length = this.backupsExpandedKeys.length;
        for (let i = 0; i < length; i++) {
          vm.getAllParentKey(vm.backupsExpandedKeys[i], vm.treeData);
        }
        vm.expandedKeys = vm.backupsExpandedKeys.slice();
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>
