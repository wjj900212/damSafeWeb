<template>
    <div class="standardList">
      <a-card :bordered="false" class="card-area">
        <div>
          <!-- 搜索区域 -->
          <a-form layout="inline" style="display:flex;align-items: center;justify-content: space-between;">
            <a-form-item label="关键字">
              <a-input placeholder="请输入" v-model="queryParams.keyword" style="width:220px;margin-right:18px" />
              <a-button style="border: 1px solid #188FFF;background: #188fff1a;color: #1890FF;" type="primary"
                        @click="addSafety">添加
                <img src="static/img/添加.png" style="margin-left:8px;">
              </a-button>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="search">查询
                <img src="static/img/查询 拷贝 3.png" style="margin-left:8px;">
              </a-button>
              <a-button style="margin-left: 8px;border: 1px solid #188FFF;background: #188fff1a;color: #1890FF;"
                        @click="reset">重置
                <img src="static/img/重置.png" style="margin-left:8px;"></a-button>
            </a-form-item>
          </a-form>
        </div>
        <!--<div :class="advanced ? 'search' : null">
          <a-form layout="inline" style="display:flex;align-items: center;justify-content: space-between;">
            <a-row >
              <div :class="advanced ? null: 'fold'">
                <a-col :md="8" :sm="24" >
                  <a-form-item
                    label="关键字"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 18, offset: 1}">
                    <a-input placeholder="请输入" v-model="queryParams.keyword" style="width:220px;margin-right:18px" />
                    <a-button style="border: 1px solid #188FFF;background: #188fff1a;color: #1890FF;" type="primary"
                              @click="addSafety">添加
                      <img src="static/img/添加.png" style="margin-left:8px;">
                    </a-button>
                  </a-form-item>
                </a-col>
              </div>
              <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          </span>
            </a-row>
          </a-form>
        </div>-->
      </a-card>
      <a-card :bordered="false" class="card-area" style="margin-top:10px;">
        <div>
          <a-table
            ref="TableInfo"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
          ></a-table>
        </div>
      </a-card>
      <!--添加预案-->
      <safety-add
        :visible="isShowSafetyAdd"
        @fetch="fetch"
        @onClose="()=>{isShowSafetyAdd=false}"
      ></safety-add>
      <!---->
      <safety-edit
        ref="safetyEdit"
        :visible="isShowSafetyEdit"
        @fetch="fetch"
        @onClose="()=>{isShowSafetyEdit=false}"
      ></safety-edit>
    </div>
</template>

<script>
import SafetyAdd from './model/safetyAdd'
import SafetyEdit from './model/safetyEdit'
export default {
  name: 'safety',
  components: {
    SafetyAdd,
    SafetyEdit
  },
  data () {
    return {
      advanced: false,
      queryParams: {},
      paginationInfo: null,
      dataSource: [],
      loading: false,
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      isShowSafetyAdd: false,
      isShowSafetyEdit: false
    }
  },
  computed: {
    columns () {
      return [{
        title: '预案名称',
        dataIndex: 'reserveName'
      }, {
        title: '适用监测场景',
        dataIndex: 'reserveType'
      }, {
        title: '创建人',
        dataIndex: 'username'
      }, {
        title: '描述',
        dataIndex: 'description',
        width: '25%',
        ellipsis: true
      }, {
        title: '创建时间',
        dataIndex: 'createTime'
      }, {
        title: '操作',
        dataIndex: 'operation',
        customRender: (text, record) => (
          <div>
            <a onClick={() => { this.edit(record) }} style="margin-right:1rem;">编辑</a>
            <a onClick={() => { this.safetyDelete(record) }}>删除</a>
          </div>
        )
      }]
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    addSafety () {
      this.isShowSafetyAdd = true
    },
    edit (record) {
      this.$refs.safetyEdit.setFormValues(record)
      this.isShowSafetyEdit = true
    },
    search () {
      this.fetch({
        ...this.queryParams
      })
    },
    reset () {
      // 重置分页
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
      if (this.paginationInfo) {
        this.paginationInfo.current = this.pagination.defaultCurrent
        this.paginationInfo.pageSize = this.pagination.defaultPageSize
      }
      // 重置查询参数
      this.queryParams = {}
      this.fetch()
    },
    handleTableChange (pagination) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.fetch({
        ...this.queryParams
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
      this.$get('web/reservoirPlan/getPlanList', {
        ...params
      }).then((r) => {
        if (r.data.code === 1) {
          let data = r.data.data
          const pagination = { ...this.pagination }
          pagination.total = data.total
          this.dataSource = data.records
          this.pagination = pagination
        } else {
          this.$message.error(r.data.msg)
        }
        // 数据加载完毕，关闭loading
        this.loading = false
      })
    },
    safetyDelete (record) {
      let that = this
      this.$confirm({
        title: '确定删除该用户?',
        content: '当您点击确定按钮后，该预案将会被彻底删除',
        centered: true,
        onOk () {
          that.$post('web/reservoirPlan/deletePlan', {
            planId: record.planId
          }).then((r) => {
            if (r.data.code === 1) {
              that.$message.success('删除成功')
              that.search()
            } else {
              that.$message.error(r.data.msg)
            }
          })
        },
        onCancel () {

        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../../../../static/less/Common";
  .standardList{
    width:100%;
  }

</style>
