<template>
  <div style="display: flex;flex-direction: row;">
    <div style="flex: 0.75;height:400px;border-right:1px solid #e9e9e9;">
      <a-form :form="form">
        <a-row :span="24">
          <a-col :span="12">
            <a-form-item label="设备类型:" v-bind="formItemLayout">
              <a href="#">{{thresholdEditMoreObj.first.devModelName}}</a>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设备ID:" v-bind="formItemLayout">
              <a-input-search style="width:170px;" v-model="queryParams.devCode" placeholder="请输入" enter-button @search="onSearch" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div style="height:350px;overflow-y: scroll;">
        <div style="margin-bottom:5px;padding-left:10px;text-align: left;">
          {{ projName | ellipsis}}
          <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
          </a-checkbox>
        </div>
        <div style="display: flex;flex-direction: row;">
          <div style="flex:0.85;border:1px solid #e9e9e9;height:320px;padding:10px;border-radius: 2px;overflow-y: scroll;">
            <a-checkbox-group :options="plainOptions" v-model="checkedList" @change="onChange"></a-checkbox-group>
          </div>
          <div style="flex:0.15;text-align: center;">
            <a-button style="margin-bottom:10px;" type="primary" size="small" @click="addDevList">
              加入
            </a-button>
            <a-button size="small" @click="()=>{
              tagList = []
           }">
              撤销
            </a-button>
          </div>
        </div>
      </div>
    </div>
    <div style="flex: 0.25;height:400px;overflow-y: scroll;">
      <div style="padding:10px;">
        {{ projName | ellipsis}}
        <template v-for="tag in tagList">
          <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
            <a-tag :key="tag" closable @close="() => handleClose(tag)">
              {{ tag }}
            </a-tag>
          </a-tooltip>
          <a-tag v-else :key="tag" closable @close="() => handleClose(tag)">
            {{ tag }}
          </a-tag>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'second',
  data () {
    return {
      form: this.$form.createForm(this, { name: 'SecondForm' }),
      formItemLayout: {
        labelCol: {span: 7},
        wrapperCol: {span: 16}
      },
      projName: '全部', // 项目名称
      hiddenList: [],
      queryParams: {},
      secondParams: {},
      options: [], // 默认所有设备列表
      plainOptions: [], // 展示所有设备列表
      checkedList: [], // 选中设备
      tagList: [],
      allProjList: [],
      indeterminate: false,
      checkAll: false
    }
  },
  props: {
    projList: {
      type: Array,
      default: () => {
        return []
      }
    },
    thresholdEditMoreObj: {
      type: Object,
      default: () => {}
    }
  },
  mounted () {
    this.allProjList = this.projList
    if (this.thresholdEditMoreObj.second.tagList) {
      this.tagList = this.thresholdEditMoreObj.second.tagList
    }
    let second = this.thresholdEditMoreObj.second
    let secondParams = this.thresholdEditMoreObj.second.secondParams
    if (JSON.stringify(second) !== '{}') {
      if (JSON.stringify(secondParams) !== '{}') {
        if (secondParams.devCode !== undefined) {
          this.queryParams.devCode = this.thresholdEditMoreObj.second.secondParams.devCode
        }
        if (secondParams.projName !== undefined) {
          this.secondParams.projName = this.thresholdEditMoreObj.second.secondParams.projName
          this.queryParams.projectId = this.thresholdEditMoreObj.second.secondParams.projectId
        }
        if (secondParams.hiddenName !== undefined) {
          this.secondParams.hiddenName = this.thresholdEditMoreObj.second.secondParams.hiddenName
          this.queryParams.hiddenId = this.thresholdEditMoreObj.second.secondParams.hiddenId
        }
      }
    }
    this.onSearch()
  },
  watch: {
    projList (newVal) {
      this.allProjList = newVal
    },
    queryParams (newVal) {
      if (newVal.devCode) {
        this.secondParams.devCode = newVal.devCode
      }
    }
  },
  methods: {
    onSearch () {
      console.log('查询参数', this.queryParams)
      this.fetch({
        ...this.queryParams
      })
    },
    fetch (params = {}) {
      params.devModel = this.thresholdEditMoreObj.first.devModelId
      this.$get('admin/thresholdManage/getEquipmentList', {
        ...params
      }).then((r) => {
        let data = r.data.data
        this.options = data.records
        let equipment = []
        for (let i = 0; i < data.length; i++) {
          equipment.push(data[i].devCode)
        }
        this.plainOptions = equipment
      })
    },
    handleProjChange (value, key) {
      this.projName = value
      this.secondParams.projName = value
      this.secondParams.projectId = key.data.key
      this.queryParams.projectId = key.data.key
      this.getHiddenPointList(key.data.key)
      this.onSearch()
    },
    handleHiddenPointChange (value, key) {
      this.secondParams.hiddenName = value
      this.secondParams.hiddenId = key.data.key
      this.queryParams.hiddenId = key.data.key
      this.onSearch()
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    // 隐患点列表
    getHiddenPointList (projId) {
      let params = { projBasicId: projId }
      this.$get('admin/projHiddenDangerArea/list', {...params}).then((r) => {
        let data = r.data.data
        this.hiddenList = data
      })
    },
    onChange (checkedList) {
      this.indeterminate = !!checkedList.length && checkedList.length < this.plainOptions.length
      this.checkAll = checkedList.length === this.plainOptions.length
    },
    onCheckAllChange (e) {
      Object.assign(this, {
        checkedList: e.target.checked ? this.plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    handleClose (removedTag) {
      const tags = this.tagList.filter(tag => tag !== removedTag)
      console.log(tags)
      this.tagList = tags
    },
    addDevList () {
      this.tagList = this.checkedList
      if (this.queryParams.devCode) {
        this.secondParams.devCode = this.queryParams.devCode
      }
      this.$emit('updateThresholdTag', this.secondParams, this.tagList)
    }
  },
  filters: {
    // 名称过长时用...代替
    ellipsis (value) {
      if (!value) {
        return ''
      }
      if (value.length > 15) {
        return value.slice(0, 15) + '...'
      }
      return value
    }
  }
}
</script>

<style scoped>

</style>
