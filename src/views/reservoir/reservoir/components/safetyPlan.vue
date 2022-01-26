<template>
  <a-card title="安全管理预案">
    <a-select
      slot="extra"
      style="width: 120px"
      v-model="plan"
      placeholder="预案类型"
      option-filter-prop="children"
      @change="handlePlanChange"
    >
      <a-select-option v-for="item in planData" :value="item.id" :key="item.id">
        {{ item.name }}
      </a-select-option>
    </a-select>
    <a-card-grid style="width: 100%; text-align: center">
      <a-table
        bordered
        :data-source="aqglyadataSource"
        :columns="aqglyacolumns"
      >
      </a-table>
    </a-card-grid>
    <a-modal v-model="planVisible" title="安全预案管理">
      <div v-html="planDetail"></div>
      <template slot="footer">
        <a-button type="primary">
          关闭
        </a-button>
      </template>
    </a-modal>
  </a-card>
</template>
<script>
export default {
  name: "safetyPlan",
  components: {},
  props: {
      aqglyadataSource: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      plan: 'all',
      planData: [
        { id: 'all', name: "全部预案" },
        { id: '0', name: "综合预案" },
        { id: '11', name: "渗流监测" },
        { id: '12', name: "渗压监测" },
        { id: '13', name: "大坝变形监测" },
        { id: '14', name: "大坝微动监测" },
        { id: '15', name: "雨情监测" },
        { id: '16', name: "水情监测" }
      ],
      planVisible: false,
      planDetail: '',
    };
  },
  computed: {
      aqglyacolumns() {
      return [
        {
          title: "序号",
          width: "5%",
          align: "center",
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: "预案名称",
          dataIndex: "reserveName",
          align: "center",
          width: "15%",
        },
        {
          title: "预案类型",
          dataIndex: "reserveType",
          align: "center",
          width: "10%",
          customRender: (text, record, index) => `${this.planData.find(item => item.id === text).name}`
        },
        {
          title: "创建人",
          dataIndex: "username",
          align: "center",
          width: "10%",
        },
        {
          title: "描述",
          dataIndex: "desc",
          align: "center",
          width: "50%",
        },
        {
          title: "操作",
          width: "100px",
          align: "center",
          customRender: (record) => (
            record.details ?
            (
              <div>
                <a
                  onClick={() => {
                    this.showPlanDetail(record.details)
                  }}
                >
                  查看
                </a>
              </div>
            ) :
            (
              ''
            )
          ),
        },
      ];
    }
  },
  mounted() {
  },
  updated() {},
  watch: {
  },
  methods: {
    handlePlanChange(value) {
      this.$emit('getPlanList', value)
    },
    showPlanDetail (content) {
      this.planVisible = true
      this.planDetail = content
    }
  },
};
</script>

<style lang="less" scoped>
</style>
