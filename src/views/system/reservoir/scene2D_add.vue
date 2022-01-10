<template>
  <!-- 添加二维可视化场景 -->
  <a-modal title="添加场景" :visible="visible" width="750px" class="sceneStyle" :confirmLoading="uploading" okText="保存"
    @cancel="$emit('onClose')" @ok="handleUpload">
    <a-form :form="form" v-bind="formItemLayout">
      <a-form-item label="场景名称" v-bind="formItemLayout">
        <a-input v-decorator="['sceneName', { rules: [{ required: true, message: '请输入场景名称' }] }]" />
      </a-form-item>
      <a-form-item label="场景图片" v-bind="formItemLayout">
        <a-radio-group default-value="a" button-style="solid" @change="onSceneChange">
          <a-radio-button value="a">
            上传图片
          </a-radio-button>
          <a-radio-button value="b" v-if="sceneType !== 0">
            默认图片
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <div v-if="imgType === 'a'" style="width:80%;margin:0px auto;">
        <a-upload :file-list="fileList" :before-upload="beforeUpload"
                  v-decorator="['image', { rules: [{ required: true, message: '上传场景图片' }] }]">
          <a-button icon="upload">上传</a-button>
        </a-upload>
        <div style="color:#4FA0D9;font-size: 12px;margin-top:0.5rem;">注:建议尺寸1390*940,上传文件支持JPG/PNG</div>
      </div>
      <div v-else style="display: flex;flex-direction: row;width:80%;margin:0px auto;">
        <div v-for="(img,index) in imgList" :key="index" :class="selectId === index? 'imgActive':''" style="margin-right:1rem;" @click="selectDefaultImg(img,index)">
          <img :src="img" style="width:10rem;height: 10rem;"/>
        </div>
      </div>
      <!--<a-form-item label="场景图片" v-bind="formItemLayout">
        <a-upload :file-list="fileList" :before-upload="beforeUpload"
          v-decorator="['image', { rules: [{ required: true, message: '上传场景图片' }] }]">
          <a-button icon="upload">上传</a-button>
        </a-upload>
        <div style="color:#4FA0D9;font-size: 12px;">注:建议尺寸1390*940,上传文件支持JPG/PNG</div>
      </a-form-item>
      <a-form-item v-if="sceneType !== 0" label="默认图片" v-bind="formItemLayout">
        <div style="display: flex;flex-direction: row;">
          <div v-for="(img,index) in imgList" :key="index" :class="selectId === index? 'imgActive':''" style="margin-right:1rem;" @click="selectDefaultImg(img,index)">
            <img :src="img" style="width:10rem;height: 10rem;"/>
          </div>
        </div>
      </a-form-item>-->
    </a-form>
  </a-modal>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    hiddenId: {
      type: Number,
      default: 0
    },
    sceneType: {
      type: Number,
      default: 0
    },
    hiddenType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      formItemLayout: {
        labelCol: {
          span: 5
        },
        wrapperCol: {
          span: 16
        }
      },
      fileList: [],
      uploading: false,
      form: this.$form.createForm(this),
      imgType: 'a',
      imgList: [],
      uploadImg: '',
      selectId: -1
    }
  },
  watch: {
  },
  methods: {
    resetForm () {
      this.uploading = false
      this.fileList = []
      this.form.resetFields()
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$warning({
          title: '提示',
          content: '请上传JPG或者PNG格式的图片!'
        })
      } else {
        this.fileList = [...this.fileList, file]
      }
      return false
    },
    onSceneChange (e) {
      this.imgType = e.target.value
      if (e.target.value === 'b') {
        this.getSceneDefaultPic({
          type: this.hiddenType
        })
      }
      console.log('radio1 checked', e.target.value)
    },
    selectDefaultImg (img, index) {
      this.selectId = index
      this.uploadImg = img
    },
    // 获取场景默认图片
    getSceneDefaultPic (params = {}) {
      this.$get('web/hiddenScene/addSceneDefaultPic', params).then((r) => {
        if (r.data.code === 1) {
          this.imgList = r.data.data.split('||')
          console.log('获取到的默认图片', this.imgList)
        } else {
          this.$message.error(r.data.msg)
        }
      })
    },

    handleUpload () {
      if (this.fileList.length === 0 && this.uploadImg === '') {
        this.$warning({
          title: '提示',
          content: '请上传或者选择默认图片!'
        })
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log('新建场景', values)
          this.uploading = true
          const {
            fileList
          } = this
          const formData = new FormData()
          if (this.uploadImg === '') {
            fileList.forEach(file => {
              formData.append('image', file)
            })
          } else {
            formData.append('picPath', this.uploadImg)
          }
          formData.append('dataId', this.hiddenId)
          formData.append('sceneName', values.sceneName)
          formData.append('sceneType', this.sceneType)
          // for (let [a, b] of formData.entries()) {
          //   console.log(a, b)
          // }
          this.$upload('web/hiddenScene/addScene', formData).then((r) => {
            if (r.data.code === 1) {
              this.$emit('getScenePicPath', r.data.data)
              this.resetForm()
              this.$emit('onClose')
            } else {
              this.$message.error(r.data.msg)
            }
          }).catch(() => {
            this.uploading = false
          })
        }
      })
    }
  }
}

</script>
<style lang="less" scoped>
  /* @import url(); 引入公共css类 */
.imgActive{
  width: 10.2rem;
  height: 10.2rem;
  border: 1px solid red;
}
</style>
