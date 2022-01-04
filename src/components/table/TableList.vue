<template>
  <a-table ref="TableInfo"
           :columns="columns"
           :dataSource="dataSource"
           :pagination="pagination"
           :loading="loading"
           @change="handleTableChange">
  </a-table>
</template>

<script>
export default {
  name: 'table',
  props: {
    columns: {
      type: Array,
      default: () => {

      }
    },
    dataSource: {
      type: Array,
      default: () => {

      }
    },
    pagination: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleTableChange () {

    }
  }
}
</script>

<style scoped>

</style>
