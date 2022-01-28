<template>
  <!-- 添加 / 编辑 水库 -->
  <a-form :form="form" @submit="handleSubmit" class="scene_add_edit" v-bind="formItemLayout">
    <a-row>
      <a-col :span="24">
        <div class="tipTit">
          <span>{{isEdit?'修改场景':'添加场景'}}</span>
        </div>
      </a-col>
      <a-col :span="24">
        <a-col :span="3">
          <span class="title">基本信息</span>
        </a-col>
      </a-col>
      <a-col :span="12">
        <a-form-item label="场景名称" v-bind="formItemLayout">
          <a-input v-decorator="[
          'name',{ rules: [{ required: true, message: '请填写场景名称' }] }]" placeholder="请填写场景名称" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="场景类型" v-bind="formItemLayout">
          <a-select show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOption"
            v-decorator="[
          'type',{ rules: [{ required: true, message: '请选择场景类型' }] }]">
            <a-select-option v-for="scene in sceneTypeList" :key="scene.ID">{{scene.NAME}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="所在区县" v-bind="formItemLayout">
          <!--<a-cascader :options="cityArr" placeholder="请选择所在区县" v-decorator="[
          'city', { rules: [{ required: true, message: '请填写所在区县' }] } ]" />-->
          <cascader @getDistData="getDistData" :updateOptions="optionCityInfo" :defaultValue="casdata"></cascader>
          <a-input style="display: none;" v-decorator="['levelCode',{rules: [{ required: true, message: '所属地区不能为空'}]}]">
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="所在乡镇" v-bind="formItemLayout">
          <a-input v-decorator="['township']" placeholder="请输入"></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="位置坐标" v-bind="formItemLayout">
          <div style="height:40px;display: flex;align-items: center;white-space: nowrap;">
            <a-input v-decorator="['longitude',{ rules: [{ required: true, message: '请填写中心点' }] }]"
              placeholder="请填写经度" />
            <span style="margin-left:5px"></span>
            <a-input v-decorator="['latitude',{ rules: [{ required: true, message: '请填写中心点' }] }]"
              placeholder="请填写纬度" />
            <span style="margin-left:5px"></span>
            <!-- <a-icon type="pushpin" style="cursor: pointer;" @click="MapVisible=true" /> -->
            <a-button type="primary" @click="MapVisible=true">定位
              <img src="static/img/组 211.png" style="margin-left:8px;zoom:.8;">
            </a-button>
          </div>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="联系人" v-bind="formItemLayout">
          <a-input v-decorator="['hiddenCharge']" placeholder="请输入"></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="测站编码" v-bind="formItemLayout">
          <a-input v-decorator="['stationCode']" placeholder="请输入" />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="实景图" v-bind="formItemLayoutLong">
          <a-upload list-type="picture-card" :file-list="RealSceneFileList" :multiple="true"
            :remove="handleRealSceneRemove" :before-upload="beforeRealSceneUpload" @change="handleRealSceneUploadChange"
            @preview="handleRealScenePreview">
            <div>
              <a-icon type="plus" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
          <a-modal :visible="previewRealSceneVisible" :footer="null" @cancel="previewRealSceneVisible=false">
            <img alt="example" style="width: 100%" :src="previewRealSceneImage" />
          </a-modal>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="布设图" v-bind="formItemLayoutLong">
          <a-upload list-type="picture-card" :file-list="fileList" :multiple="true" :remove="handleRemove"
            :before-upload="beforeUpload" @change="handleUploadChange" @preview="handlePreview">
            <div>
              <a-icon type="plus" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible=false">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="场景介绍" v-bind="formItemLayoutLong">
          <a-textarea placeholder="请填写" :auto-size="{ minRows: 3, maxRows: 5 }" v-decorator="['remarks']" />
        </a-form-item>
      </a-col>
      <a-col :span="24" style="margin-bottom:15px;display:flex;align-items:center;">
        <a-col :span="3">
          <span class="title">自定义信息</span>
        </a-col>
        <a-button class="caddBtn" @click="customFieldModal=true">新增字段
          <img src="static/img/添加.png" style="margin-left:8px;">
        </a-button>
      </a-col>
      <a-col :span="12" v-for="(v,i) in customParam" :key="i">
        <a-form-item v-bind="formItemLayout" :label="v.key">
          <div style="display: flex;align-items: center;white-space: nowrap;">
            <a-input placeholder="请填写" v-model="v.value" />
            <span style="margin-left:5px"></span>
            <a-icon type="form" title="编辑名称" @click="editCustomName(v,i)" />
            <span style="margin-left:5px"></span>
            <a-icon type="delete" title="删除" @click="customParam.splice(i,1)" />
          </div>
        </a-form-item>
      </a-col>
    </a-row>
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

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = error => reject(error)
    })
  }
  var hiddenId //hiddenId 存在即为修改监测场景
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
    data() {
      return {
        isEdit: false,
        formItemLayout: {
          labelCol: {
            span: 6
          },
          wrapperCol: {
            span: 15
          }
        },
        formItemLayoutLong: {
          labelCol: {
            span: 3
          },
          wrapperCol: {
            span: 20
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
        fileList: [],
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
      saveLngLat(lng, lat) {
        this.form.setFieldsValue({
          'longitude': lng,
          'latitude': lat
        })
        this.centerLongitude = lng
        this.centerLatitude = lat
      },
      // 确认自定义字段 关闭弹框
      customFieldOk() {
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
      editCustomName(v, i) {
        this.customName = v.key
        this.isEditCustomName = i
        this.customFieldModal = true
      },
      // select 筛选过滤
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      },
      async handlePreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj)
        }
        this.previewImage = file.url || file.preview
        this.previewVisible = true
      },
      async handleRealScenePreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj)
        }
        this.previewRealSceneImage = file.url || file.preview
        console.log('展示图片', file)
        this.previewRealSceneVisible = true
      },
      beforeUpload(file) {
        this.fileList = [...this.fileList, file]
        return false
      },
      beforeRealSceneUpload(file) {
        this.RealSceneFileList = [...this.RealSceneFileList, file]
        return false
      },
      // 布设图
      handleRemove(file) {
        const index = this.fileList.indexOf(file)
        const newFileList = this.fileList.slice()
        newFileList.splice(index, 1)
        this.fileList = newFileList
      },
      // 实景图
      handleRealSceneRemove(file) {
        const index = this.RealSceneFileList.indexOf(file)
        const newFileList = this.RealSceneFileList.slice()
        newFileList.splice(index, 1)
        this.RealSceneFileList = newFileList
      },
      handleUploadChange({
        fileList
      }) {
        this.fileList = fileList
      },
      handleRealSceneUploadChange({
        fileList
      }) {
        this.RealSceneFileList = fileList
      },
      // 区县回显 赋值
      setData(val = {}) {
        let that = this
        that.optionCityInfo = []
        that.casdata = []
        if (val.cityInfo.length === 3) {
          that.optionCityInfo.push({
            label: val.cityInfo[0].cityName,
            value: val.cityInfo[0].cityCode,
            children: [{
              label: val.cityInfo[1].cityName,
              value: val.cityInfo[1].cityCode,
              children: [{
                label: val.cityInfo[2].cityName,
                value: val.cityInfo[2].cityCode
              }]
            }]
          })
        } else if (val.cityInfo.length === 2) {
          that.optionCityInfo.push({
            label: val.cityInfo[0].cityName,
            value: val.cityInfo[0].cityCode,
            children: [{
              label: val.cityInfo[1].cityName,
              value: val.cityInfo[1].cityCode
            }]
          })
        } else {
          that.optionCityInfo.push({
            label: val.cityInfo[0].cityName,
            value: val.cityInfo[0].cityCode
          })
        }
        for (let i = 0; i < val.cityInfo.length; i++) {
          that.casdata.push(val.cityInfo[i].cityCode)
        }
      },
      // 保存
      handleSubmit(e) {
        e.preventDefault()
        let _this = this
        // return
        this.form.validateFields((err, values) => {
          if (!err) {
            if (_this.customParam) {
              values.customParam = JSON.stringify(_this.customParam)
            }
            values.reservoirId = this.reservoirId
            console.log('Received values of form: ', values)
            if (hiddenId) {
              // 修改
              values.id = hiddenId
              _this.$post('web/hidden/updateHiddenPoint', values).then((r) => {
                if (r.data.code === 1) {
                  _this.putimgsave(hiddenId)
                } else {
                  _this.$message.warning(r.data.msg)
                }
              })
            } else {
              // 添加
              _this.$post('web/hidden/addHiddenPoint', values).then((r) => {
                if (r.data.code === 1) {
                  let dataId = r.data.data
                  _this.putimgsave(dataId)
                } else {
                  _this.$message.warning(r.data.msg)
                }
              })
            }
          }
        })
      },
      // 保存实景图与布设图
      putimgsave(dataId) {
        let _this = this
        const {
          fileList,
          RealSceneFileList
        } = _this
        const formData = new FormData()
        // console.log(fileList)
        let layoutList = []
        fileList.forEach(file => {
          if (file.originFileObj) formData.append('layout', file.originFileObj)
          else layoutList.push(file.url)
        })
        let imageList = []
        RealSceneFileList.forEach(file => {
          if (file.originFileObj) formData.append('image', file.originFileObj)
          else imageList.push(file.url)
        })
        formData.append('dataId', dataId)
        if (imageList.length > 0) {
          formData.append('imageList', imageList.join('||')) //旧的实景图路径
        }
        if (layoutList.length > 0) {
          formData.append('layoutList', layoutList.join("||")) //	旧的布设图路径
        }
        _this.$upload('file/uploadSceneImage', formData).then((r) => {
          if (r.data.code === 1) {
            _this.$message.success('上传成功')
            _this.fileList = []
            _this.RealSceneFileList = []
            _this.form.resetFields()
            _this.$router.replace("/system/reservoir/scene?reservoirId=" + _this.reservoirId)
          } else {
            _this.$message.warning(r.data.msg)
          }
        })
      },
      // 获取场景类型列表
      getHiddenDangerTypeList() {
        this.$get('web/hidden/getHiddenDangerTypeList').then((r) => {
          this.sceneTypeList = r.data.data
        })
      },
      // 获取子组件返回的cityCode和cityType
      getDistData(distData) {
        this.distData = distData
        this.levelCode = this.distData.cityCode
        this.form.setFieldsValue({
          'levelCode': this.distData.cityCode
        })
      },
      // 修改场景内容查询
      getHiddenMsg() {
        this.$post('/web/hidden/getHiddenPointDetail', {
          hiddenId
        }).then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return false
          }
          let data = rr.data
          let obj = {
            name: data.hiddenName,
            type: Number(data.hiddenType),
            levelCode: data.cityCode,
            longitude: data.longitude,
            latitude: data.latitude,
            stationCode: data.stationCode,
            remarks: data.remarks,
            township: data.township,
            hiddenCharge: data.hiddenCharge
          }
          this.form.setFieldsValue(obj) //表单赋值
          this.setData({
            ...data
          }) //省市区回显
          if (data.customParam) this.customParam = JSON.parse(data.customParam) //自定义字段
          // 实景图
          if (data.image) {
            let imgArr = data.image.split('||')
            imgArr.forEach((v, i) => {
              this.RealSceneFileList.push({
                uid: -(i + 1),
                name: getUrlParam(v, 'filename'),
                status: 'done',
                url: v
              })
            })
          }
          // 布设图
          if (data.layout) {
            let imgArr = data.layout.split('||')
            imgArr.forEach((v, i) => {
              this.fileList.push({
                uid: -(i + 1),
                name: getUrlParam(v, 'filename'),
                status: 'done',
                url: v
              })
            })
          }
        })
      }
    },
    mounted() {
      this.getHiddenDangerTypeList()
      //hiddenId 存在即为修改监测场景
      hiddenId = this.$route.query.hiddenId
      if (hiddenId) {
        this.getHiddenMsg()
        this.isEdit = true
      } else this.isEdit = false
    }
  }
  //获取url中的参数
  function getUrlParam(url, name) {
    try {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = url.split('?')[1].match(reg);
      if (r != null) {
        return r[2];
      }
      return ""; //如果此处只写return;则返回的是undefined
    } catch (e) {
      return ""; //如果此处只写return;则返回的是undefined
    }
  }

</script>
<style scoped>
  /* @import url(); 引入公共css类 */
  .scene_add_edit {
    width: 100%;
    background-color: #fff;
  }

  .tipTit {
    width: 95%;
    margin: 0px auto;
    border-bottom: 1px solid #1890ff33;
    line-height: 40px;
    padding-bottom: 5px;
    color: #5D6574;
    font-size: 1.6rem;
  }

  .title {
    font-weight: 500;
    font-size: 1.6rem;
    line-height: 40px;
    float: right;
    color: #1890FF;
    margin: .8rem 0;
    margin-right: 14px;
  }

  .caddBtn {
    color: #188FFF;
    border-color: #188FFF;
    background: rgba(24, 143, 255, 0.1);
  }

</style>
