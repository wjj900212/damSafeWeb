<template>
  <!-- 编辑 监测场景 -->
  <div class="scene_edit">
      <sceneAddEdit />
  </div>
</template>

<script>
import sceneAddEdit from "./scene_add_edit.vue"
  export default {
      components:{sceneAddEdit},
    data() {
      return {

      };
    },
    methods: {},
  }

</script>
<style scoped>
  /* @import url(); 引入公共css类 */
.scene_edit{
    width: 100%;
}
</style>
