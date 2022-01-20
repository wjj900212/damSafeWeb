<template>
  <a-modal
    title="编辑警示信息"
    :visible="visible"
    width="750px"
    @cancel="handleCancel"
  >
    <div style="margin-bottom:1rem;">
      <span>预警别称:</span>
      <a-input style="width:210px;" v-model="queryParams.warninfo" placeholder="请输入" />
    </div>
    <div>
      <div style="margin-bottom: 0.5rem;">编辑警示信息内容:</div>
      <a-textarea
        v-model="queryParams.alias"
        placeholder="请输入警示信息内容"
        :auto-size="{ minRows: 3, maxRows: 5 }"
      />
    </div>

    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button :style="{ marginRight: '8px' }" @click="handleCancel()">
        关闭
      </a-button>
      <a-button type="primary" @click="handleOK">
        确认
      </a-button>
    </div>
  </a-modal>

</template>

<script>
export default {
  name: 'config-warn-msg',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    msgInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      queryParams: {
        warninfo: '',
        alias: ''
      }
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        if (JSON.stringify(this.msgInfo) !== '{}') {
          this.queryParams = this.msgInfo
        }
      }
    }
  },
  methods: {
    handleOK () {
      let warnInfo = {'warninfo': this.queryParams.warninfo, 'alias': this.queryParams.alias}
      this.$emit('getWarnMsg', warnInfo)
      this.$emit('onClose')
    },
    handleCancel () {
      this.queryParams = {}
      this.$emit('onClose')
    }
  }
}
</script>

<style scoped>

</style>
