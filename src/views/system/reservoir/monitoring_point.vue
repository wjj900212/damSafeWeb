<template>
  <a-card :bordered="false" class="card-area" v-if="$route.path === '/system/reservoir/monitoring_point'">
    <div>
      <!-- 搜索区域 -->
      <a-form layout="horizontal">
        <a-row>
          <div class="fold">
            <a-col :md="6" :sm="24">
              <a-form-item label="水库" :labelCol="{span: 4}" :wrapperCol="{span: 18, offset: 1}">
                <a-select
                  placeholder="选择水库"
                  show-search
                  allowClear
                  :disabled="disabledFlag"
                  v-model="reservoirName"
                  :filterOption="filterOption"
                  @change="setReservoir"
                >
                  <a-select-option v-for="(item,index) in reservoirList" :key="'reservoirId' + index" :value="item.reservoirId">
                    {{ item.reservoirName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="设备类型" :labelCol="{span: 6}" :wrapperCol="{span: 16, offset: 1}">
                <a-select
                  placeholder="选择设备类型"
                  show-search
                  allowClear
                  v-model="queryParams.modelId"
                  :filterOption="filterOption"
                  @change="setDeviceType"
                >
                  <a-select-option v-for="(item,index) in devTypeList" :key="'deviceType' + index" :value="item.devModelId">
                    {{ item.devModelName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="测点名称" :labelCol="{span: 6}" :wrapperCol="{span: 16, offset: 1}">
                <a-input v-model="queryParams.projPnName" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="设备ID" :labelCol="{span: 4}" :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.devCode" placeholder="请输入" />
              </a-form-item>
            </a-col>
          </div>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary">查询</a-button>
          </span>
        </a-row>
      </a-form>
    </div>
    <div style="display: flex;flex-direction: row;">
      <div style="flex:0.2;border:1px solid #e9e9e9;border-radius:4px;margin-right:10px;">
        <div style="margin:5px;">
          <a-input-search v-model="searchStr" placeholder="请输入关键字搜索场景" enter-button @search="onSearch"  />
        </div>
        <div v-if="hiddenPointTreeList.length > 0" style="min-height: calc(100% - 80px);overflow-y: scroll;">
          <a-tree
            :selectedKeys="selectedKeys"
            :treeData="hiddenPointTreeList"
            :showIcon="showIcon"
            :showLine="showLine"
            :defaultExpandAll="true"
            @select="onSelect"
            @expand="onExpand"
          >
            <template slot="title" slot-scope="record">
              {{ record.title }} <a-icon type="file-image" v-if="record.img" @click="showImg(record)" class="bzimg" />
            </template>
          </a-tree>
        </div>
      </div>
      <div style="flex: 1;">
      <!-- 表格区域 -->
      <a-table ref="TableInfo"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :loading="loading"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               :scroll="{ x: 900 }"
               @change="handleTableChange">

        <template slot="devBonline" slot-scope="text, record">
          <div v-if="text === ''"></div>
          <div v-if="text === '0'">
            在线
            <a-badge status="success" />
          </div>
          <div v-if="text === '1'">
            离线
            <a-badge status="error" />
          </div>
        </template>
        <template slot="installInfo" slot-scope="text, record">
          <a @click="getInstallInfo(record)">点击查看</a>
        </template>
      </a-table>
    </div>
    </div>
    <!--安装信息-->
    <pn-install-info
      :visible="installInfoVisible"
      :installDetail="installDetail"
      @cancel="cancelInstallInfo"
    ></pn-install-info>
  </a-card>
  <router-view v-else/>
</template>

<script>
import PnInstallInfo from './pnInstallInfo'
export default {
  name: 'monitoring-point',
  components: {
    PnInstallInfo
  },
  data () {
    return {
      form: this.$form.createForm(this),
      imgList: [],
      imgvisible: false,
      selectedList: [],
      reservoirName: '',
      hiddenId: '',
      projBasicName: '',
      dataSource: [],
      storage: [],
      projDataSource: [],
      reservoirId: '',
      reservoirList: [],
      hiddenPointList: [],
      hiddenPointTreeList: [],
      advanced: false,
      projPnInfo: {
        visible: false,
        data: {}
      },
      projPnAddVisible: false,
      projPnEditVisible: false,
      projPnLongitude: '',
      projPnLatitude: '',
      queryParams: {},
      filteredInfo: null,
      paginationInfo: null,
      selectedRowKeys: [],
      loading: false,
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      disabledFlag: false,
      disabledHidden: false,
      batchAddVisible: false,
      projPnId: '',
      installInfoVisible: false,
      installDetail: {}, // 安装信息详情
      surveyDetail: {}, // 踏勘信息详情
      surveyInfoVisible: false,
      positionAdjustmentVisible: false,
      tagValue: '',
      devTypeList: [],
      // devModelId: '',
      mapModalVisible: false,
      mapVisible: false,
      projPnDetail: {}, // 监测点数据
      selectedKeys: [],
      searchValue: '',
      searchStr: '',
      showLine: true,
      showIcon: false,
      expandedKeys: [],
      judgePosition: '',
      burglarAlarmVisible: false,
      BurglarAlarmData: [],
      stationTitle: '',
      modelId: '',
      burglarList: '',
      associatedEquipmentVisible: false,
      AboutChildData: {},
      associatedStationVisible: false,

      deviceTypeList: []
    }
  },
  computed: {
    columns () {
      let {filteredInfo} = this
      filteredInfo = filteredInfo || {}
      return [{
        title: '序号',
        customRender: (text, record, index) => `${index + 1}`
      }, {
        title: '监测点名称',
        dataIndex: 'projPnName'
      }, {
        title: '所属场景',
        dataIndex: 'hiddenName'
      }, {
        title: '设备类型',
        dataIndex: 'devModelName'
      }, {
        title: '设备ID',
        dataIndex: 'devCode'
      }, {
        title: '设备状态',
        dataIndex: 'devBonline',
        scopedSlots: { customRender: 'devBonline' },
        filters: [
          { text: '在线', value: '0'},
          { text: '离线', value: '1'}
        ],
        filterMultiple: false,
        filteredValue: filteredInfo.devBonline || null
      }, {
        title: '数据更新时间',
        dataIndex: 'createTime',
        scopedSlots: { customRender: 'createTime' }
      }, {
        title: '安装信息',
        dataIndex: 'installInfo',
        scopedSlots: { customRender: 'installInfo' }
      }]
    }
  },
  beforeRouteEnter (to, from, next) {
    // 项目列表迁移时，设置默认值
    next(vm => {
      vm.init()
    })
  },
  methods: {
    handleOK () {
      this.imgvisible = false
      this.imgList = []
    },
    handleCancel () {
      this.imgvisible = false
      this.imgList = []
    },
    init () {
      this.reservoirId = this.$route.query.reservoirId
      if (this.reservoirId) {
        this.queryParams.reservoirId = this.reservoirId
        this.disabledFlag = true
      }
      this.$get('web/hidden/getReservoirList').then((r) => {
        this.reservoirList = r.data.data
        if (this.reservoirList && this.reservoirId) {
          for (let i = 0; i < this.reservoirList.length; i++) {
            let currentProj = this.reservoirList[i]
            if (currentProj.reservoirId.toString() === this.reservoirId) {
              this.reservoirName = currentProj.reservoirName
              break
            }
          }
        }
        this.search()
        this.getDevTypeList()
        this.getHiddenPointTreeList()
      })
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    setDeviceType (value) {
      if (value) {
        this.queryParams.modelId = value
      } else {
        delete this.queryParams.modelId
      }
      this.search()
    },
    setReservoir (value) {
      if (value) {
        this.queryParams.reservoirId = value
      } else {
        delete this.queryParams.reservoirId
      }
      this.search()
    },
    getHiddenPointTreeList (name) {
      let params = {}
      if (name) {
        params.key = name
      }
      params.reservoirId = this.reservoirId
      this.$get('web/projPn/getSceneList', {...params}).then((r) => {
        let hiddenData = r.data.data
        let treeHiddenData = [{title: '全部', key: 'all', children: []}]
        for (let i = 0; i < hiddenData.length; i++) {
          let treeHidden = {}
          treeHidden.title = hiddenData[i].hiddenName
          treeHidden.key = hiddenData[i].hiddenId
          if (hiddenData[i].image !== '') {
            treeHidden.img = hiddenData[i].image !== '' ? hiddenData[i].image.split('||') : []
          }
          treeHidden.children = []
          treeHiddenData[0].children.push(treeHidden)
        }
        this.hiddenPointTreeList = treeHiddenData
        console.log('树值', this.hiddenPointTreeList)
      })
    },
    getHiddenPointList () {
      let params = {}
      params.projBasicId = this.projBasicId
      this.$get('admin/projHiddenDangerArea/list', {...params}).then((r) => {
        this.hiddenPointList = r.data.data
      })
    },
    showImg (record) {
      this.imgvisible = true
      this.imgList = record.img
      console.log(this.imgList)
    },
    // 获取设备类型
    getDevTypeList () {
      this.$get('web/projPn/getDevModelList', {}).then((r) => {
        this.devTypeList = r.data.data
      })
    },
    // 点击查看监测点安装信息
    getInstallInfo (record) {
      this.projPnId = record.projPnId
      let params = {}
      params.id = record.projPnId
      this.$get('web/projPn/getInstallData', {...params}).then((r) => {
        if (r.data.code === 1) {
          if (r.data.data === null) {
            this.$message.warning('无安装信息')
          } else {
            this.installInfoVisible = true
            this.installDetail = r.data.data
          }
        } else {
          this.$message.error(r.data.msg)
        }

        console.log('安装信息详情', r.data.data)
      })
    },
    onSearch (value) {
      this.getHiddenPointTreeList(value)
      // console.log('**onSearch**', value)
    },
    onSelect (selectedKeys, info) {
      if (!info.selected) {
        selectedKeys = this.selectedKeys
      } else {
        this.selectedKeys = selectedKeys
      }
      this.queryParams.hiddenDangerAreaId = selectedKeys.toString()
      this.search()
    },
    onExpand (expandedKeys, e) {
      this.expandedKeys = expandedKeys
    },
    cancelInstallInfo () {
      this.installInfoVisible = false
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    search () {
      let { filteredInfo } = this
      if (this.queryParams.devBasicStrId === '') {
        delete this.queryParams.devBasicStrId
      }
      if (this.queryParams.hiddenDangerAreaId !== undefined && this.queryParams.hiddenDangerAreaId === 'all') {
        delete this.queryParams.hiddenDangerAreaId
      }
      // 重置分页
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
      if (this.paginationInfo) {
        this.paginationInfo.current = this.pagination.defaultCurrent
        this.paginationInfo.pageSize = this.pagination.defaultPageSize
      }
      this.fetch({
        ...this.queryParams,
        ...filteredInfo
      })
    },
    reset () {
      // 取消选中
      this.selectedRowKeys = []
      // 重置分页
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
      if (this.paginationInfo) {
        this.paginationInfo.current = this.pagination.defaultCurrent
        this.paginationInfo.pageSize = this.pagination.defaultPageSize
      }
      // 重置列过滤器规则
      this.filteredInfo = null
      // 重置查询参数
      this.queryParams = {}
    },
    handleTableChange (pagination, filters) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.fetch({
        ...this.queryParams,
        ...filters
      })
    },
    fetch (params = {}) {
      // 显示loading
      this.loading = true
      if (this.paginationInfo) {
        // 如果分页信息不为空，则设置表格当前第几页，每页条数，并设置查询分页参数
        this.$refs.TableInfo.pagination.current = this.paginationInfo.current
        this.$refs.TableInfo.pagination.pageSize = this.paginationInfo.pageSize
        params.pageSize = this.paginationInfo.pageSize
        params.pageNum = this.paginationInfo.current
      } else {
        // 如果分页信息为空，则设置为默认值
        params.pageSize = this.pagination.defaultPageSize
        params.pageNum = this.pagination.defaultCurrent
      }
      this.$get('web/projPn/getProjPnDataList', {
        ...params
      }).then((r) => {
        let data = r.data.data
        const pagination = { ...this.pagination }
        pagination.total = data.total
        this.dataSource = data.records
        this.pagination = pagination
        // 数据加载完毕，关闭loading
        this.loading = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/less/Common";
</style>
