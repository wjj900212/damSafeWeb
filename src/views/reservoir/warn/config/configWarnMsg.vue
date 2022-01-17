<template>
  <a-modal
    title="编辑警示信息"
    :visible="visible"
    width="750px"
    @cancel="handleCancel"
  >
    <div>
      <span>预警别称:</span>
      <a-input style="width:210px;" v-model="queryParams.message" placeholder="请输入" />
    </div>
    <div>
      <span>编辑警示信息内容:</span>
      <a-textarea
        v-model="queryParams.value"
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
      <a-button type="primary" @click="handleCancel()">
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
    }
  },
  data () {
    return {
      queryParams: {}
    }
  },
  methods: {
    handleCancel () {
      this.$emit('onClose')
    }
  }
}
</script>

<style scoped>

</style>
