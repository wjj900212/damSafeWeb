<template>
  <a-modal
    :footer="null"
    :visible="visible"
    :width="1200"
    :mask="true"
    @cancel="cancelModal"
  >
    <a-row type="flex" class="info">
      <a-col :span="3" :order="1" class="info-label">
        预警类型
      </a-col>
      <a-col :span="3" :order="2" class="info-content">
        设备预警
      </a-col>
      <a-col :span="3" :order="3" class="info-label">
        警示等级
      </a-col>
      <a-col :span="3" :order="4" class="info-content">
        <span v-if="warnDetailData.devCode==='3'" style="color:#FF3C1C;font-size:1.4rem;font-family: 'Microsoft YaHei UI';font-weight: 400;">红色预警</span>
        <span v-if="warnDetailData.devCode==='2'" style="color:#FF6C00;font-size:1.4rem;font-family: 'Microsoft YaHei UI';font-weight: 400;">橙色预警</span>
        <span v-if="warnDetailData.devCode==='1'" style="color:#FFD800;font-size:1.4rem;font-family: 'Microsoft YaHei UI';font-weight: 400;">黄色预警</span>
        <span v-if="warnDetailData.devCode==='0'" style="color:#12A8F6;font-size:1.4rem;font-family: 'Microsoft YaHei UI';font-weight: 400;">蓝色预警</span>
      </a-col>
      <a-col :span="3" :order="5" class="info-label">
        预警阈值
      </a-col>
      <a-col :span="3" :order="6" class="info-content">
        {{warnDetailData.warnValue}}
      </a-col>
      <a-col :span="3" :order="7" class="info-label">
        预警时间
      </a-col>
      <a-col :span="3" :order="8" class="info-content">
        <span :title="warnDetailData.warnTime">{{warnDetailData.warnTime | ellipsis(10)}}</span>
      </a-col>
    </a-row>
    <a-row type="flex" class="info">
      <a-col :span="3" :order="1" class="info-label">
        警示信息
      </a-col>
      <a-col :span="21" :order="2" class="info-content">
        <span :title="warnDetailData.warnInfo">{{warnDetailData.warnInfo | ellipsis(30)}}</span>
      </a-col>
    </a-row>
    <a-row type="flex" class="info">
      <a-col :span="3" :order="1" class="info-label">
        项目名称
      </a-col>
      <a-col :span="3" :order="2" class="info-content">
        <a class="aStyle" :title="warnDetailData.projBasicName" @click="showProjDetail(warnDetailData.projBasicId)">{{warnDetailData.projBasicName | ellipsis(7)}}</a>
      </a-col>
      <a-col :span="3" :order="3" class="info-label">
        所属隐患点
      </a-col>
      <a-col :span="3" :order="4" class="info-content">
        <a class="aStyle" :title="warnDetailData.hiddenName" @click="showHiddenDetail(warnDetailData.projBasicId, warnDetailData.hiddenId)">{{warnDetailData.hiddenName | ellipsis(7)}}</a>
      </a-col>
      <a-col :span="3" :order="5" class="info-label">
        所属监测点
      </a-col>
      <a-col :span="3" :order="6" class="info-content">
        <a class="aStyle" :title="warnDetailData.pnName" @click="showPnDetail(warnDetailData.projBasicId, warnDetailData.hiddenId, warnDetailData.pnId)">{{warnDetailData.pnName | ellipsis(7)}}</a>
      </a-col>
      <a-col :span="3" :order="7" class="info-label">
        设备名称
      </a-col>
      <a-col :span="3" :order="8" class="info-content">
        {{warnDetailData.devBasicName}}
      </a-col>
    </a-row>
    <a-row type="flex" class="info">
      <a-col :span="3" :order="1" class="info-label">
        所属地区
      </a-col>
      <a-col :span="3" :order="2" class="info-content">
        <span :title="warnDetailData.countyName">{{warnDetailData.countyName | ellipsis(7)}}</span>
      </a-col>
      <a-col :span="3" :order="3" class="info-label">
        监测类型
      </a-col>
      <a-col :span="3" :order="4" class="info-content">
        {{warnDetailData.hiddenType}}
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
export default {
  name: 'dev-warning-info',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    warnDetailData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {

    }
  },
  methods: {
    cancelModal () {
      this.$emit('onClose')
    }
  },
  filters: {
    // 名称过长时用...代替
    ellipsis (value, num) {
      if (!value) {
        return ''
      }
      if (value.length > num) {
        return value.slice(0, num) + '...'
      }
      return value
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../../../../../static/less/info.css";
</style>
