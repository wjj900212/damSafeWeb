<template>
  <!-- 添加 / 编辑 水库 -->
  <a-form :form="form" @submit="handleSubmit" class="scene_add_edit" v-bind="formItemLayout">
    <div class="title"><span class="line"></span>基本信息</div>
    <a-form-item label="场景名称" v-bind="formItemLayout">
      <a-input v-decorator="[
          'name',{ rules: [{ required: true, message: '请填写场景名称' }] }]" placeholder="请填写场景名称" />
    </a-form-item>
    <a-form-item label="场景类型" v-bind="formItemLayout">
      <a-select show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOption" v-decorator="[
          'type',{ rules: [{ required: true, message: '请选择场景类型' }] }]">
        <a-select-option v-for="scene in sceneTypeList" :key="scene.ID">{{scene.NAME}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="所在区县" v-bind="formItemLayout">
      <!--<a-cascader :options="cityArr" placeholder="请选择所在区县" v-decorator="[
          'city', { rules: [{ required: true, message: '请填写所在区县' }] } ]" />-->
      <cascader @getDistData="getDistData" :updateOptions="optionCityInfo" :defaultValue="casdata"></cascader>
      <a-input style="display: none;"
               v-decorator="['levelCode',{rules: [{ required: true, message: '所属地区不能为空'}]}]"></a-input>
    </a-form-item>
    <a-form-item label="位置坐标" v-bind="formItemLayout">
      <div style="display: flex;align-items: center;white-space: nowrap;">
        <a-input v-decorator="['longitude',{ rules: [{ required: true, message: '请填写中心点' }] }]" placeholder="请填写经度" />
        <span style="margin-left:5px"></span>
        <a-input v-decorator="['latitude',{ rules: [{ required: true, message: '请填写中心点' }] }]" placeholder="请填写纬度" />
        <span style="margin-left:5px"></span>
        <a-icon type="pushpin" style="cursor: pointer;" @click="MapVisible=true" />
      </div>
    </a-form-item>
    <a-form-item label="测站编码" v-bind="formItemLayout">
      <a-input v-decorator="[
          'stationCode',{ rules: [{ required: true, message: '请输入测站编码' }] }]" placeholder="请输入" />
    </a-form-item>
    <a-form-item label="实景图" v-bind="formItemLayout">
      <a-upload list-type="picture-card" :file-list="RealSceneFileList" :multiple="true" :remove="handleRealSceneRemove"
        :before-upload="beforeRealSceneUpload" @change="handleRealSceneUploadChange" @preview="handleRealScenePreview">
        <div>
          <a-icon type="plus" />
          <div class="ant-upload-text">
            上传
          </div>
        </div>
      </a-upload>
      <a-modal :visible="previewRealSceneVisible" :footer="null" @cancel="previewRealSceneVisible=false">
        <img alt="example" style="width: 100%" :src="previewRealSceneImage" />
      </a-modal>
    </a-form-item>
    <a-form-item label="布设图" v-bind="formItemLayout">
      <a-upload list-type="picture-card" :file-list="fileList" :multiple="true" :remove="handleRemove"
        :before-upload="beforeUpload" @change="handleUploadChange" @preview="handlePreview">
        <div>
          <a-icon type="plus" />
          <div class="ant-upload-text">
            上传
          </div>
        </div>
      </a-upload>
      <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible=false">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
    </a-form-item>
    <a-form-item label="场景介绍" v-bind="formItemLayout">
      <a-textarea placeholder="请填写" :auto-size="{ minRows: 3, maxRows: 5 }" v-decorator="['remarks']" />
    </a-form-item>
    <div class="title"><span class="line"></span>自定义信息</div>
    <a-row>
      <a-col :span="6">
        <a-button style="float:right;" @click="customFieldModal=true">新增字段</a-button>
      </a-col>
    </a-row>
    <a-form-item v-bind="formItemLayout" v-for="(v,i) in customParam" :key="i" :label="v.key">
      <div style="display: flex;align-items: center;white-space: nowrap;">
        <a-input placeholder="请填写" v-model="v.value" />
        <span style="margin-left:5px"></span>
        <a-icon type="form" title="编辑名称" @click="editCustomName(v,i)" />
        <span style="margin-left:5px"></span>
        <a-icon type="delete" title="删除" @click="customParam.splice(i,1)" />
      </div>
    </a-form-item>
    <a-col :span="24" :style="{ textAlign: 'center',marginTop:'25px'}">
      <a-button type="primary" html-type="submit">保存</a-button>
    </a-col>

    <!-- 自定义字段弹框 -->
    <a-modal v-model="customFieldModal" title="自定义字段" @ok="customFieldOk">
      <a-form>
        <a-form-item label="字段名" v-bind="formItemLayout" :validate-status="customErr.status" :help="customErr.help">
          <a-input placeholder="请输入" v-model="customName" />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 选择中心经纬度点 -->
    <mapCenterPoint :visible="MapVisible" @close="()=>{ MapVisible=false }" :longitude="centerLongitude"
      :latitude="centerLatitude" @saveLngLat="saveLngLat" />
  </a-form>
</template>

<script>
import mapCenterPoint from '@/components/mapCenterPoint/mapCenterPoint' // 选择中心点
import Cascader from '@/components/distselect/cascader.vue'
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = error => reject(error)
  })
}
export default {
  name: 'scene_add_edit',
  components: {
    mapCenterPoint,
    Cascader
  },
  props: {
    reservoirId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      formItemLayout: {
        labelCol: {
          span: 6
        },
        wrapperCol: {
          span: 15
        }
      },
      form: this.$form.createForm(this),
      MapVisible: false, // 地图选择中心点弹框
      centerLongitude: '',
      centerLatitude: '',
      previewVisible: false,
      previewImage: '',
      previewRealSceneVisible: false,
      previewRealSceneImage: '',
      fList: [],
      fileList: [],
      RealSceneFList: [],
      RealSceneFileList: [],
      customParam: [], // 自定义字段
      customName: '', // 自定义字段名称
      isEditCustomName: '', // 修改自定义字段名称
      customFieldModal: false,
      customErr: {
        status: '',
        help: ''
      },
      sceneTypeList: [],
      optionCityInfo: [],
      distData: '', // 区县级联组件返回的数据
      casdata: [] // 级联插件默认值
    }
  },
  methods: {
    saveLngLat (lng, lat) {
      this.form.setFieldsValue({
        'longitude': lng,
        'latitude': lat
      })
      this.centerLongitude = lng
      this.centerLatitude = lat
    },
    // 确认自定义字段 关闭弹框
    customFieldOk () {
      if (this.customName) {
        this.customErr.status = ''
        this.customErr.help = ''
        if (this.isEditCustomName !== '') this.customParam[this.isEditCustomName].key = this.customName
        else {
          this.customParam.push({
            key: this.customName,
            value: ''
          })
        }
      } else {
        this.customErr.status = 'error'
        this.customErr.help = '请输入自定义名称'
        return false
      }
      this.customFieldModal = false
      this.customName = ''
      this.isEditCustomName = ''
    },
    editCustomName (v, i) {
      this.customName = v.key
      this.isEditCustomName = i
      this.customFieldModal = true
    },
    // select 筛选过滤
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    async handleRealScenePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewRealSceneImage = file.url || file.preview
      console.log('展示图片', file)
      this.previewRealSceneVisible = true
    },
    beforeUpload (file) {
      this.fileList = [...this.fileList, file]
      this.fList = [...this.fList, file]
      return false
    },
    beforeRealSceneUpload (file) {
      this.RealSceneFileList = [...this.RealSceneFileList, file]
      this.RealSceneFList = [...this.RealSceneFList, file]
      return false
    },
    handleRemove (file) {
      const index = this.fList.indexOf(file)
      const newFileList = this.fList.slice()
      newFileList.splice(index, 1)
      this.fList = newFileList
    },
    handleRealSceneRemove (file) {
      const index = this.RealSceneFList.indexOf(file)
      const newFileList = this.RealSceneFList.slice()
      newFileList.splice(index, 1)
      this.RealSceneFList = newFileList
    },
    handleUploadChange ({ fileList }) {
      this.fileList = fileList
    },
    handleRealSceneUploadChange ({ fileList }) {
      this.RealSceneFileList = fileList
    },
    // 保存
    handleSubmit (e) {
      e.preventDefault()
      let _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          if (_this.customParam) {
            values.customParam = _this.customParam
          }
          values.reservoirId = this.reservoirId
          console.log('Received values of form: ', values)
          _this.$post('web/hidden/addHiddenPoint', values).then((r) => {
            if (r.data.code === 1) {
              let dataId = r.data.data
              const { fList, RealSceneFList } = _this
              const formData = new FormData()
              fList.forEach(file => {
                formData.append('layout', file)
              })
              RealSceneFList.forEach(file => {
                formData.append('image', file)
              })
              formData.append('dataId', dataId)
              formData.append('imageList', '')
              formData.append('layoutList', '')
              _this.$upload('file/uploadSceneImage', formData).then((r) => {
                if (r.data.code === 1) {
                  _this.$message.success('上传成功')
                  _this.fList = []
                  _this.fileList = []
                  _this.RealSceneFList = []
                  _this.RealSceneFileList = []
                  _this.form.resetFields()
                } else {
                  _this.$message.warning(r.data.msg)
                }
              })
            } else {
              _this.$message.warning(r.data.msg)
            }
          })
        }
      })
    },
    // 获取场景类型列表
    getHiddenDangerTypeList () {
      this.$get('web/hidden/getHiddenDangerTypeList').then((r) => {
        this.sceneTypeList = r.data.data
      })
    },
    // 获取子组件返回的cityCode和cityType
    getDistData (distData) {
      this.distData = distData
      this.levelCode = this.distData.cityCode
      this.form.setFieldsValue({
        'levelCode': this.distData.cityCode
      })
    }
  },
  mounted () {
    this.getHiddenDangerTypeList()
    // form 赋值
    // this.form.setFieldsValue({
    //   latitude: 11,
    //   longitude: 22,
    //   username: '名称'
    // })
  }
}

</script>
<style scoped>
  /* @import url(); 引入公共css类 */
  .scene_add_edit {
    width: 100%;
  }

  .title {
    width: 100%;
    font-weight: 500;
    font-size: 1.2rem;
    line-height: 30px;
    display: flex;
    align-items: center;
  }

  .line {
    width: 3px;
    height: 28px;
    background-color: #069afe;
    /* margin: 0 auto; */
    margin-right: 5px;
  }

</style>
