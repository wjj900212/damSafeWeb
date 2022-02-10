<template>
  <!-- 编辑 监测场景 -->
  <div class="scene_edit">
      <sceneAddEdit :reservoirId="reservoirId"/>
  </div>
</template>

<script>
import sceneAddEdit from "./scene_add_edit.vue"
  export default {
  components: {sceneAddEdit},
  data () {
    return {
      reservoirId: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    // 项目列表迁移时，设置默认值
    next(vm => {
      vm.init()
    })
  },
  methods: {
    init () {
      this.reservoirId = this.$route.query.reservoirId
    }
  }
  }

</script>
<style scoped>
  /* @import url(); 引入公共css类 */
.scene_edit{
    width: 100%;
}
</style>
