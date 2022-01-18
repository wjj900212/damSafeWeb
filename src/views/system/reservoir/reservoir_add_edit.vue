<template>
  <!-- 添加 / 编辑 水库 -->
  <a-form :form="form" @submit="handleSubmit" class="reservoir_add_edit">
    <a-row>
      <a-col :span="24">
        <a-col :span="3">
          <span class="title">基本信息</span>
        </a-col>
      </a-col>
      <a-col :span="12">
        <a-form-item label="所属项目" v-bind="formItemLayout">
          <a-select show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOption"
            v-decorator="[
          'projBasicId',{ rules: [{ required: true, message: '请选择所属项目' }] }]">
            <a-select-option v-for="v,i in projectList" :key="i" :value="v.projBasicId">{{v.projBasicName}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="水库名称" v-bind="formItemLayout">
          <a-input v-decorator="[
          'reservoirName',{ rules: [{ required: true, message: '请填写水库名称' }] }]" placeholder="请填写水库名称" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="水库地址" v-bind="formItemLayout">
          <cascader @getDistData="getDistData" :updateOptions="optionCityInfo" :defaultValue="casdata"></cascader>
          <a-input style="display: none;" v-decorator="['levelCode',{rules: [{ required: true, message: '请选择'}]}]">
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="位置坐标" v-bind="formItemLayout">
          <div style="height:50px;display: flex;align-items: center;white-space: nowrap;">
            <a-input v-decorator="['longitude',{ rules: [{ required: true, message: '请填写中心点' }] }]"
              placeholder="请填写经度" />
            <span style="margin-left:5px"></span>
            <a-input v-decorator="['latitude',{ rules: [{ required: true, message: '请填写中心点' }] }]"
              placeholder="请填写纬度" />
            <span style="margin-left:5px"></span>
            <a-icon type="pushpin" style="cursor: pointer;" @click="MapVisible=true" />
          </div>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="管理单位" v-bind="formItemLayout">
          <a-input v-decorator="[
          'managerUnit',{ rules: [{ required: true, message: '请填写管理单位' }] }]" placeholder="请输入" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="水库规模" v-bind="formItemLayout">
          <a-select show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOption"
            v-decorator="[
          'scale',{ rules: [{ required: true, message: '请选择水库规模' }] }]">
            <a-select-option value="0">大（1）型</a-select-option>
            <a-select-option value="1">大（2）型</a-select-option>
            <a-select-option value="2">中型</a-select-option>
            <a-select-option value="3">小（1）型 </a-select-option>
            <a-select-option value="4">小（2）型</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="设计库容" v-bind="formItemLayout">
          <div style="display: flex;align-items: center;white-space: nowrap;">
            <a-input v-decorator="['capacity']" placeholder="请输入" /> <span style="margin-left:5px">亿m³</span>
          </div>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="最大水位" v-bind="formItemLayout">
          <div style="display: flex;align-items: center;white-space: nowrap;">
            <a-input v-decorator="['depth']" placeholder="请输入" /> <span style="margin-left:5px">m</span>
          </div>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="建设时间" v-bind="formItemLayout">
          <!-- :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }" -->
          <a-date-picker format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss" placeholder="请选择"
            v-decorator="['buildTime']" />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="实景图" v-bind="formItemLayoutLong">
          <a-upload list-type="picture-card" :file-list="sjImgsList" :multiple="true" :remove="handleImgsRemove"
            :before-upload="beforeUpload" @change="handleImgsChange" @preview="handleImgsPreview">
            <div>
              <a-icon type="plus" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
          <a-modal :visible="previewImgsVisible" :footer="null" @cancel="previewImgsVisible=false">
            <img alt="example" style="width: 100%" :src="previewImgs" />
          </a-modal>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="水库介绍" v-bind="formItemLayoutLong">
          <!-- <a-textarea placeholder="请填写" :auto-size="{ minRows: 3, maxRows: 5 }" v-decorator="['notes']" /> -->
          <editorCom ref="notesBox" :isEasy="true"></editorCom>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="详细介绍" v-bind="formItemLayoutLong">
          <editorCom ref="editorBox" putUrl="/file/uploadDetailsImage" delUrl="/file/deleteDetailsImage"></editorCom>
        </a-form-item>
      </a-col>
      <a-col :span="24" style="margin-bottom:15px;">
        <a-col :span="3">
          <span class="title">自定义信息</span>
        </a-col>
        <a-button @click="customFieldModal=true">新增字段</a-button>
      </a-col>
      <a-col :span="12" v-for="v,i in customField" :key="i">
        <a-form-item v-bind="formItemLayout" :label="v.key">
          <div style="display: flex;align-items: center;white-space: nowrap;">
            <a-input placeholder="请填写" v-model="v.value" />
            <span style="margin-left:5px"></span>
            <a-icon type="form" title="编辑名称" :style="{ fontSize: '16px', color: '#1890FF' }"
              @click="editCustomName(v,i)" />
            <span style="margin-left:5px"></span>
            <a-icon type="delete" title="删除" :style="{ fontSize: '16px', color: '#1890FF' }"
              @click="customField.splice(i,1)" />
          </div>
        </a-form-item>
      </a-col>
    </a-row>
    <a-col :span="24">
      <div class="bottomArea">
        <a-button type="primary" html-type="submit">保存</a-button>
      </div>
    </a-col>

    <!-- 自定义字段弹框 -->
    <a-modal v-model="customFieldModal" title="自定义字段" @ok="customFieldOk">
      <a-form>
        <a-form-item label="字段名" v-bind="formItemLayout" :validate-status="customErr.status" :help="customErr.help">
          <a-input placeholder="请输入" v-model="customName" />
        </a-form-item>
      </a-form>
    </a-modal>
    <mapCenterPoint :visible="MapVisible" @close="()=>{ MapVisible=false }" :longitude="centerLongitude"
      :latitude="centerLatitude" @saveLngLat="saveLngLat" />
  </a-form>
</template>

<script>
  import moment from 'moment';
  import Cascader from '@/components/distselect/cascader.vue'
  import editorCom from "@/components/editor/editor" //富文本
  import mapCenterPoint from "@/components/mapCenterPoint/mapCenterPoint" // 选择中心点
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = error => reject(error)
    })
  }
  var isEditReservoir = false,
    reservoirId
  export default {
    name: 'reservoir_add_edit',
    components: {
      Cascader,
      editorCom,
      mapCenterPoint
    },
    data() {
      return {
        optionCityInfo: [],
        casdata: [], // 级联插件默认值
        projectList: [],
        cityArr: [], //省市区列表
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
        MapVisible: false, //地图选择中心点弹框
        centerLongitude: '',
        centerLatitude: '',
        sjImgsList: [], //file-list 图片列表
        delImg: [], //删除的实景图
        previewImgs: '', //弹框显示的图片
        previewImgsVisible: false, //显示弹框查看图片
        customField: [], //自定义字段
        customName: '', //自定义字段名称
        isEditCustomName: '', //修改自定义字段名称
        customFieldModal: false,
        customErr: {
          status: '',
          help: ''
        },
      };
    },
    methods: {
      moment,
      // 获取子组件返回的cityCode和cityType
      getDistData(distData) {
        this.levelCode = distData.cityCode
        this.form.setFieldsValue({
          'levelCode': distData.cityCode
        })
      },
      // 获取项目列表
      getProjectList() {
        this.$get("/web/reservoirAdmin/getProjectList").then(res => {
          let rr = res.data
          // console.log(rr)
          this.projectList = rr.data
        })
      },
      // 选择的位置坐标
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
          this.customErr.status = ""
          this.customErr.help = ''
          if (this.isEditCustomName !== '') this.customField[this.isEditCustomName].key = this.customName
          else {
            this.customField.push({
              key: this.customName,
              value: ''
            })
          }
        } else {
          this.customErr.status = "error"
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
        );
      },
      // 手动上传图片 return false
      beforeUpload(file) {
        this.sjImgsList = [...this.sjImgsList, file];
        return false
      },
      handleImgsChange({
        fileList
      }) {
        this.sjImgsList = fileList
        console.log(fileList)
      },
      async handleImgsPreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj)
        }
        this.previewImgs = file.url || file.preview;
        // console.log('展示图片', file)
        this.previewImgsVisible = true
      },
      // 删除实景图片
      handleImgsRemove(file) {
        console.log(file)
        const index = this.sjImgsList.indexOf(file)
        const newFileList = this.sjImgsList.slice()
        newFileList.splice(index, 1)
        this.sjImgsList = newFileList
      },
      // 获取修改的水库信息
      getReservoirDetail(reservoirId) {
        this.$get("/web/reservoirAdmin/getReservoirDetail?reservoirId=" + reservoirId).then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return
          }
          let data = rr.data
          let {
            deleteFlag,
            images,
            sceneCount,
            createTime,
            buildTime,
            customParam,
            reservoirStatus,
            cityInfo,
            ...obj
          } = data
          // console.log(obj)
          // form 赋值
          this.form.setFieldsValue(obj)
          this.form.setFieldsValue({
            'buildTime': !data.buildTime ? null : moment(data.buildTime, 'YYYY-MM-DD HH:mm:ss'),
          })
          this.$refs.editorBox.content = data.introduct
          this.$refs.notesBox.content = data.notes
          if (data.customParam) this.customField = JSON.parse(data.customParam)
          if (data.images) {
            let imgArr = data.images.split('||')
            imgArr.forEach((v, i) => {
              this.sjImgsList.push({
                uid: -(i + 1),
                name: getUrlParam(v, 'filename'),
                status: 'done',
                url: v
              })
            })
          }
          this.setData({
            ...data
          })
        })
      },

      // 保存
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            let formData = new FormData()
            Object.keys(values).forEach(k => {
              if (k == 'buildTime') {
                if (values[k]) formData.append(k, moment(values[k]).format('YYYY-MM-DD HH:mm:ss'))
              } else formData.append(k, values[k] === undefined || values[k] === null ? '' : values[k])
            })
            formData.append('introduct', this.$refs.editorBox.content)
            formData.append("notes", this.$refs.notesBox.content)
            if (this.customField.length > 0) formData.append('customParam', JSON.stringify(this.customField))
            // 修改
            if (reservoirId && isEditReservoir) {
              formData.append("reservoirId", reservoirId)
              this.$postDate("/web/reservoirAdmin/updateReservoir", formData).then(res => {
                let rr = res.data
                if (rr.code == 1) {
                  this.$message.success('修改成功')
                  this.putImgArr(reservoirId)
                } else this.$message.error(rr.msg)
              })
            } else {
              // 添加
              this.$postDate("/web/reservoirAdmin/addReservoir", formData).then(res => {
                let rr = res.data
                if (rr.code == 1) {
                  this.$message.success('添加成功')
                  this.putImgArr(rr.data)
                } else this.$message.error(rr.msg)
              })
            }
          }
        });
      },
      //保存 上传图片
      putImgArr(reservoirId) {
        let formData = new FormData()
        let {
          sjImgsList
        } = this
        // console.log(sjImgsList)
        let oldImg = []
        sjImgsList.forEach(file => {
          if (file.originFileObj) formData.append('image', file.originFileObj)
          else oldImg.push(file.url)
        })
        if (oldImg.length > 0) {
          formData.append("imageList", oldImg.join("||"))
        }
        formData.append("dataId", reservoirId)
        formData.append("type", 0)
        this.$postDate("/file/uploadFiles", formData).then(res => {
          // 删除富文本图片
          this.$refs.editorBox.delPic()
          this.$router.replace("/system/reservoir/reservoir")
        })
      },
      // 水库地址 赋值
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
    },
    mounted() {
      this.getProjectList() //获取项目列表
      reservoirId = this.$route.query.reservoirId
      // 是否是修改
      if (reservoirId) {
        isEditReservoir = true
        this.getReservoirDetail(reservoirId)
      } else isEditReservoir = false
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
  .reservoir_add_edit {
    width: 100%;
  }

  .title {
    font-weight: 500;
    font-size: 1.6rem;
    line-height: 30px;
    float: right;
    margin-right: 14px;
    color: #1890FF;
  }

  .bottomArea {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 18px;
    margin-top: 10px;
    border-top: 1px solid #f2f2f2;
  }

</style>
