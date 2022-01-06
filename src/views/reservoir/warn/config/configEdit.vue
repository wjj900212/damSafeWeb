<template>
  <a-modal
    title="编辑预警规则"
    :visible="visible"
    width="1200px"
    @cancel="handleCancel"
  >
  <third></third>
  </a-modal>
</template>

<script>
import Third from './model/Third'
export default {
  name: 'config-edit',
  components: {
    Third
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

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
