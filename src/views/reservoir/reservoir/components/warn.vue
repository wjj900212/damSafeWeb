<template>
  <a-card>
    <div slot="title">
      <span>预警消息</span
      ><span style="font-size: 10px; margin-left: 10px; color: darkgray"
        >今日 246条消息</span
      >
    </div>
    <a slot="extra" href="#">更多消息</a>
    <a-card-grid style="width: 100%; text-align: center; padding: 0px;">
      <a-list
        :loading="loading"
        bordered
        :dataSource="data"
        :pagination="{
          current: current+1,
          total: total,
          pageSize: pageSize,
          size: 'small',
          showTotal: (total, range) => `共 ${total} 条`,
          onChange: onTableChange,
        }"
      >
        <a-list-item slot="renderItem" slot-scope="item">
          {{ item }}
        </a-list-item>
      </a-list>
    </a-card-grid>
  </a-card>
</template>
<script>
export default {
  name: "EmptyPageView",
  components: {},
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      pageSize: 8,
      current: 0,
      total: 0
    };
  },
  computed: {},
  mounted() {},
  updated() {},
  methods: {
    onTableChange (page) {
      // console.log(page)
      this.current = Number(page) - 1
      this.$emit('getWarnList', this.current)
    //   this.getProductList({...this.data})
    },
  },
};
</script>

<style lang="less" scoped>
</style>
