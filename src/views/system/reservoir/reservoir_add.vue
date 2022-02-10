<template>
  <!-- 添加 水库 -->
  <div class="reservoir_add">
      <reservoirAddEdit />
  </div>
</template>

<script>
import reservoirAddEdit from "./reservoir_add_edit.vue"
  export default {
    name: 'reservoir_add',
    components:{reservoirAddEdit},
    data() {
      return {

      };
    },
    methods: {},
  }

</script>
<style scoped>
  /* @import url(); 引入公共css类 */
.reservoir_add{
  width: 100%;
}
</style>
