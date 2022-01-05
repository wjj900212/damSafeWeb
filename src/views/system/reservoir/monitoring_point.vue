<template>
  <a-card :bordered="false" class="card-area" v-if="$route.path === '/system/reservoir/monitoring_point'">
    <div>
      <!-- 搜索区域 -->
      <a-form layout="horizontal">
        <a-row>
          <div class="fold">
            <a-col :md="6" :sm="24">
              <a-form-item label="水库" :labelCol="{span: 4}" :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="reservoirName" placeholder="请输入" disabled/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="设备类型" :labelCol="{span: 6}" :wrapperCol="{span: 16, offset: 1}">
                <a-input v-model="queryParams.area" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="测点名称" :labelCol="{span: 6}" :wrapperCol="{span: 16, offset: 1}">
                <a-input v-model="queryParams.name" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="设备ID" :labelCol="{span: 4}" :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.area" placeholder="请输入" />
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

        <template slot="basicOnline" slot-scope="text, record">
          <div v-if="text === -1"></div>
          <div v-if="text === 0">
            在线
            <a-badge status="success" />
          </div>
          <div v-if="text === 1">
            离线
            <a-badge status="error" />
          </div>
        </template>
        <template v-if="record.localStatus !== ''" slot="installInfo" slot-scope="text, record">
          <a @click="getInstallInfo(record)">点击查看</a>
          <a-icon type="environment" @click="showMapModal(record)"/>
        </template>
      </a-table>
    </div>
    </div>
    <!--安装信息-->
    <pn-install-info
      :visible="installInfoVisible"
      :installDetail="installDetail"
      @showMapModal="showMapModal"
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
      projList: [],
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
      associatedStationVisible: false
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
        dataIndex: 'devBasicStrId'
      }, {
        title: '设备状态',
        dataIndex: 'basicOnline',
        scopedSlots: { customRender: 'basicOnline' },
        filters: [
          { text: '在线', value: 0 },
          { text: '离线', value: 1 }
        ],
        filterMultiple: false,
        filteredValue: filteredInfo.basicOnline || null
      }, {
        title: '数据更新时间',
        dataIndex: 'devSurvey',
        scopedSlots: { customRender: 'devSurvey' }
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
     // vm.init()
    })
  },
  beforeRouteUpdate (to, from, next) {
   // this.init()
    next()
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
      this.reservoirName = this.$route.query.reservoirName
      this.$get('admin/proj/list').then((r) => {
        this.projList = r.data.data
        if (this.projList && this.projBasicId) {
          for (let i = 0; i < this.projList.length; i++) {
            let currentProj = this.projList[i]
            if (currentProj.projBasicId.toString() === this.projBasicId) {
              this.queryParams.projBasicName = currentProj.projBasicName
              let obj = {}
              obj['projBasicId'] = currentProj.projBasicName + ''
              this.form.setFieldsValue(obj)
              break
            }
          }
        }
        this.search()
        this.getHiddenPointList()
        this.getDevTypeList()
        this.getHiddenPointTreeList()
      })
    },
    unbound (record) {
      let paramObj = {id: record.projPnId}
      this.$get('admin/projPn/unbound', paramObj).then((r) => {
        if (r.data.code === 1) {
          this.search()
        } else {
          this.$message.error(r.data.msg)
        }
      })
    },
    getPointLocation () {
      this.mapVisible = true
    },
    getHiddenPointTreeList (name) {
      let params = {}
      if (name) {
        params.name = name
      }
      params.projBasicId = this.projBasicId
      if (this.hiddenId) {
        params.id = this.hiddenId
      }
      this.$get('admin/projHiddenDangerArea/list', {...params}).then((r) => {
        let hiddenData = r.data.data
        let treeHiddenData = [{title: '全部', key: 'all', children: []}]
        for (let i = 0; i < hiddenData.length; i++) {
          let treeHidden = {}
          treeHidden.title = hiddenData[i].name
          treeHidden.key = hiddenData[i].id
          if (hiddenData[i].layoutImage !== '') {
            treeHidden.img = hiddenData[i].layoutImage !== '' ? hiddenData[i].layoutImage.split('||') : []
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
    showBurglarAlarm (title, modelId, GNSSModel, lon, lat, idlist) {
      let params = {
        lon: lon,
        lat: lat,
        model: modelId,
        projId: this.projBasicId
      }
      this.burglarAlarmVisible = true
      this.stationTitle = title
      this.modelId = modelId
      if (GNSSModel !== '' && modelId !== '8') {
        params.connect = GNSSModel
      }
      this.selectedList = idlist || []
      this.getAnnunciatorList({ ...params })
    },
    // 报警器列表
    geBurglarAlarmList (burglarList) {
      this.burglarList = burglarList
      this.selectedList = burglarList !== '' ? burglarList.split(',') : []
      this.$refs.projPnEdit.upsetData()
      console.log('测站值', this.burglarList)
    },
    showImg (record) {
      this.imgvisible = true
      this.imgList = record.img
      console.log(this.imgList)
    },
    previewImg (url) {
      this.$hevueImgPreview(url)
    },
    // 关联设备
    showAssociatedEquipment (record) {
      this.associatedEquipmentVisible = true
      this.getAboutChildDevice(record)
    },
    showAssociatedStation (record, title) {
      this.stationTitle = title
      this.associatedStationVisible = true
      this.$refs.associatedStationRef.fetch(record)
    },
    // 关联设备
    getAboutChildDevice (record) {
      this.$get('admin/projPn/aboutDevice', {pnId: record.projPnId}).then((r) => {
        this.AboutChildData = r.data.data
      })
    },
    // 隐患点列表
    /* getHiddenPointList (projBasicId) {
      let params = {}
      if (projBasicId) {
        params.projBasicId = projBasicId
      } else {
        params.projBasicId = this.projBasicId
      }
      this.$get('admin/projHiddenDangerArea/list', {...params}).then((r) => {
        this.hiddenPointList = r.data.data
        if (this.hiddenPointList && this.hiddenId) {
          for (let i = 0; i < this.hiddenPointList.length; i++) {
            let currentProj = this.hiddenPointList[i]
            console.log('-----', currentProj)
            if (currentProj.id.toString() === this.hiddenId) {
              console.log('隐患点名称', currentProj.name)
              let obj = {}
              obj['hiddenId'] = currentProj.name + ''
              this.form.setFieldsValue(obj)
              break
            }
          }
        }
      })
    }, */
    // 获取设备类型
    getDevTypeList () {
      this.$get('admin/thresholdManage/devModelList', {}).then((r) => {
        this.devTypeList = r.data.data
      })
    },
    // 点击查看监测点安装信息
    getInstallInfo (record) {
      this.projPnId = record.projPnId
      let params = {}
      params.id = record.projPnId
      this.$get('admin/projPn/getInstallData', {...params}).then((r) => {
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
    cancelSurveylInfo () {
      this.surveyInfoVisible = false
    },
    getPositionAdjustment (text, projPnId) {
      this.tagValue = text
      console.log('位置状态确认', text)
      this.projPnId = projPnId
      this.positionAdjustmentVisible = true
    },
    cancelPositionAdjustment () {
      this.positionAdjustmentVisible = false
    },
    showMapModal (record) {
      let params = {}
      if (record) {
        params.id = record.projPnId
      } else {
        params.id = this.projPnId
      }
      this.$get('admin/projPn/getInstallData', {...params}).then((r) => {
        if (r.data.code === 1) {
          if (r.data.data === null) {
            this.$message.warning('无位置信息')
          } else {
            this.mapModalVisible = true
            this.projPnDetail = r.data.data
          }
        } else {
          this.$message.error(r.data.msg)
        }
      })
    },
    // 查看踏勘信息详情
    showSurveyModel (record) {
      let params = {}
      params.id = record.projPnId
      this.$get('admin/projPn/getSurvey', {...params}).then((r) => {
        if (r.data.code === 1) {
          if (r.data.data === null) {
            this.$message.warning('无踏勘信息')
          } else {
            this.surveyInfoVisible = true
            this.surveyDetail = r.data.data
          }
        } else {
          this.$message.error(r.data.msg)
        }
      })
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      if (!this.advanced) {
        this.queryParams.createTimeFrom = ''
        this.queryParams.createTimeTo = ''
      }
    },
    // 选择设备类型
    handleDevTypeListChange (value) {
      if (value) {
        this.queryParams.devModelId = value
      } else {
        delete this.queryParams.devModelId
      }
      /* this.devModelId = value
      this.queryParams.devModelId = this.devModelId
      if (value === 0) {
        delete this.queryParams.devModelId
      } */
      // this.search()
      // console.log('设备类型', value)
    },
    // 获取项目下的基准站或报警器列表
    getAnnunciatorList (params = {}) {
      this.$get('admin/projPn/getAnnunciatorList', {
        ...params
      }).then((r) => {
        this.BurglarAlarmData = r.data.data
      })
    },
    onProjSelect (value, option) {
      this.projBasicId = value
      // let index = this.projDataSource.indexOf(value)
      // this.projBasicId = this.storage[index]
      this.queryParams.projBasicId = this.projBasicId
      this.queryParams.projPnParentId = this.projBasicId
      this.queryParams.projBasicName = option.title
      this.getHiddenPointList(value)
    },
    onHiddenPointSelect () {

    },
    handleProjListSearch (value) {
      this.projDataSource = []
      this.storage = []
      this.projBasicId = ''
      if (!value) {
        return
      }
      for (let i = 0; i < this.projList.length; i++) {
        let currentProj = this.projList[i]
        if (currentProj.projBasicName.indexOf(value) !== -1) {
          this.projDataSource.push(currentProj.projBasicName)
          this.storage.push(currentProj.projBasicId)
        }
      }
    },
    add () {
      // this.$refs.projPnAdd.projBasicId = this.projBasicId
      this.projPnAddVisible = true
    },
    addMore () {
      this.$refs.projPnAdd.projBasicId = this.projBasicId
      this.batchAddVisible = true
    },
    handleProjPnBatchAddClose () {
      this.batchAddVisible = false
    },
    handleProjPnAddClose () {
      this.projPnAddVisible = false
    },
    handleProjPnAddSuccess () {
      this.projPnAddVisible = false
      this.$message.success('新建测点成功')
      this.search()
    },
    edit (record) {
      console.log('编辑测点信息', record)
      this.$refs.projPnEdit.setFormValues(record)
      this.projPnEditVisible = true
    },
    handleProjPnEditClose () {
      this.projPnEditVisible = false
    },
    handleProjPnEditSuccess () {
      this.projPnEditVisible = false
      this.search()
    },
    handleDateChange (value) {
      if (value) {
        this.queryParams.createTimeFrom = value[0]
        this.queryParams.createTimeTo = value[1]
      }
    },
    devList (record) {
      this.$router.push('/warn/threshold?projBasicId=' + this.projBasicId +
        '&devBasicHiddenId=' + record.hiddenDangerAreaId +
        '&devModelId=' + record.devModelId +
        '&devBasicStrId=' + record.devBasicStrId)
    },
    // 删除
    del (record) {
      let that = this
      that.$confirm({
        title: '删除测点',
        content: '确定删除测点 ' + record.projPnName + ' ?',
        onOk () {
          that.$delete('admin/projPn/' + record.projPnId).then(() => {
            that.$message.success('删除成功')
            that.selectedRowKeys = []
            that.search()
          })
        },
        onCancel () {}
      })
    },
    batchDelete () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择需要删除的记录')
        return
      }
      let that = this
      this.$confirm({
        title: '确定删除所选中的记录?',
        content: '当您点击确定按钮后，这些记录将会被彻底删除',
        centered: true,
        onOk () {
          let projPnIds = []
          for (let key of that.selectedRowKeys) {
            projPnIds.push(that.dataSource[key].projPnId)
          }
          that.$delete('admin/projPn/' + projPnIds.join(',')).then(() => {
            that.$message.success('删除成功')
            that.selectedRowKeys = []
            that.search()
          })
        },
        onCancel () {
          that.selectedRowKeys = []
        }
      })
    },
    search () {
      let { filteredInfo } = this
      if (this.queryParams.devBasicStrId === '') {
        delete this.queryParams.devBasicStrId
      }
      if (this.queryParams.hiddenDangerAreaId !== undefined && this.queryParams.hiddenDangerAreaId === 'all') {
        delete this.queryParams.hiddenDangerAreaId
      }
      // 取消选中
      this.selectedRowKeys = []
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
      // 重置列排序规则
      this.sortedInfo = null
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
      if (!this.queryParams.projBasicId) {
        this.$message.error('请选择项目')
        return
      }
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
      this.$get('admin/projPn', {
        ...params
      }).then((r) => {
        let data = r.data
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
