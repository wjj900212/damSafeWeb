<template>
  <!-- 编辑 水库 -->
  <div class="reservoir_edit">
    <reservoirAddEdit />
  </div>
</template>

<script>
  import reservoirAddEdit from "./reservoir_add_edit.vue"
  export default {
    name: 'reservoir_edit',
    components: {
      reservoirAddEdit
    },
    data() {
      return {

      };
    },
    methods: {},
  }

</script>
<style scoped>
  /* @import url(); 引入公共css类 */
  .reservoir_edit {
    width: 100%;
  }

</style>
