<template>
  <a-modal
    :visible="visible"
    title="安装信息"
    :maskClosable="maskClosable"
    :width="800"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-row type="flex">
      <a-col :span="4" :order="1" class="info-label">
          安装位置
      </a-col>
      <a-col :span="8" :order="2" class="info-value">
          <a v-if="installInfo.longitude!==0 && installInfo.latitude !== 0">
            {{installInfo.longitude}},{{installInfo.latitude}}
            <a-icon type="environment" />
          </a>
      </a-col>
      <a-col :span="4" :order="3" class="info-label">
          设计位置
      </a-col>
      <a-col :span="8" :order="4" class="info-value">
          <a>
            {{installInfo.lon}},{{installInfo.lat}}
            <a-icon type="environment" />
          </a>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" align="middle">
      <a-col :span="4" :order="1" class="info-label">
          位置状态
      </a-col>
      <a-col :span="8" :order="2" class="info-value">
          <span v-if="installInfo.localStatus === '0'" style="color:#42B982;">正常无偏移</span>
          <span v-if="installInfo.localStatus === '1'" style="color:#FF8A78;">偏移(已确认)</span>
          <span v-if="installInfo.localStatus === '2'" style="color:#FF5847;">偏移(未确认)</span>
      </a-col>
      <a-col :span="4" :order="3" class="info-label">
          偏移距离
      </a-col>
      <a-col :span="8" :order="4" class="info-value">
          {{installInfo.offsetDist}}m
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" align="middle">
      <a-col :span="4" :order="1" class="info-label">
          安装人员
      </a-col>
      <a-col :span="8" :order="2" class="info-value">
          {{installInfo.username}}
      </a-col>
      <a-col :span="4" :order="3" class="info-label">
          安装时间
      </a-col>
      <a-col :span="8" :order="4" class="info-value">
          {{installInfo.installTime}}
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" align="middle">
      <a-col :span="4" :order="1" class="info-label">
        项目经理
      </a-col>
      <a-col :span="8" :order="2" class="info-value">
        {{installInfo.projBasicCreateUser}}
      </a-col>
      <a-col :span="4" :order="3" class="info-label">
        补充文件
      </a-col>
      <a-col :span="8" :order="4" class="info-value">
        <a @click="downLoadFile">{{fileName}}</a>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" align="middle">
      <a-col :span="4" :order="1" class="info-label">
          安装说明
      </a-col>
      <a-col :span="20" :order="2" class="info-value">
          {{installInfo.installExplain}}
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" align="middle">
      <a-col :span="4" :order="1" class="info-label">
          位置调整说明
      </a-col>
      <a-col :span="20" :order="2" class="info-value">
          {{installInfo.installSupply}}
      </a-col>
    </a-row>
    <div style="margin-top:20px;">
      <div style="margin-bottom:10px;font-size: 14px;color:#666666;font-weight: 400;">实景照片:</div>
      <div class="height" v-if="realImgList.length !== 0" style="margin-bottom:10px;">
        <pic-viewer :images="realImgList">
          <img v-for="src in realImgList" :src="src" :key="src" style="width:100px;height:100px;border-radius: 4px;margin-right:5px;">
        </pic-viewer>
      </div>
      <div v-else style="text-align: center;">
        <img src="static/img/暂无数据 .png"/>
        <span style="margin-left:5px;">暂未上传任何图片</span>
      </div>
    </div>
    <div style="margin-top:20px;">
      <div>
        <span style="font-size: 14px;color:#666666;font-weight: 400;">签字确认:</span>
        <img v-if="installInfo.signImage !== ''" :src="installInfo.signImage" style="width:138px;height:51px;border-radius: 4px;margin-right:5px;"/>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'pn-install-info',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    installDetail: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      maskClosable: false,
      installInfo: {},
      realImgList: [],
      fileName: '',
      fileUrl: ''
    }
  },
  methods: {
    handleCancel () {
      this.realImgList = []
      this.fileName = ''
      this.fileUrl = ''
      this.$emit('cancel')
    },
    downLoadFile () {
      window.open(this.fileUrl)
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.installInfo = this.installDetail
        if (this.installInfo.image && this.installInfo.image !== '') {
          this.realImgList = this.installInfo.image.split('||')
        }
        if (this.installInfo.filePath && this.installInfo.filePath !== '') {
          let filePath = JSON.parse(this.installInfo.filePath)
          this.fileName = filePath.file
          this.fileUrl = filePath.url
        }
      }
    },
    installDetail (newData) {
      this.installInfo = newData
    }
  }
}
</script>

<style lang="less" scoped>
  .info-label,.info-value{
    font-family: "Microsoft YaHei UI";
    font-weight: 400;
    font-size: 14px;
    text-align: left;
    text-indent: 10px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #e6e6e6;
  }
  .info-label{
    color:#666666;
    background: #F6F8FB;
  }
  .info-value{
    color:#ffffff;
    background: rgba(0, 0, 0, 0);
  }
</style>
