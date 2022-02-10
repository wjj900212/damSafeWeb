<template>
  <a-card>
    <div class="safetyPlan">
      <div class="card">
        <img src="static/img/control/预案.png"/>
        <span>安全管理预案</span>
      </div>
      <a-select
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
    </div>

    <div style="width: 100%; text-align: center;margin-top:1rem;">
      <a-table :data-source="aqglyadataSource" :columns="aqglyacolumns">
      </a-table>
    </div>
    <a-modal v-model="planVisible" title="安全预案管理" width="60%">
      <div class="DetailHtml">
        <div v-html="planDetail"></div>
      </div>
      <template slot="footer">
        <a-button type="primary" @click="planVisible=false">
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
        planData: [{
            id: 'all',
            name: "全部预案"
          },
          {
            id: '0',
            name: "综合预案"
          },
          {
            id: '11',
            name: "渗流监测"
          },
          {
            id: '12',
            name: "渗压监测"
          },
          {
            id: '13',
            name: "大坝变形监测"
          },
          {
            id: '14',
            name: "大坝微动监测"
          },
          {
            id: '15',
            name: "雨情监测"
          },
          {
            id: '16',
            name: "水情监测"
          }
        ],
        planVisible: false,
        planDetail: '',
      };
    },
    computed: {
      aqglyacolumns() {
        return [{
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
            dataIndex: "description",
            align: "center",
            width: "50%",
          },
          {
            title: "操作",
            width: "100px",
            align: "center",
            customRender: (record) => (
              record.details ?
              ( <div>
                <a onClick = {() => {this.showPlanDetail(record.details)}} >
                查看 </a> </div>
              ) :
              (
                ''
              )
            ),
          },
        ];
      }
    },
    mounted() {},
    updated() {},
    watch: {},
    methods: {
      handlePlanChange(value) {
        this.$emit('getPlanList', value)
      },
      showPlanDetail(content) {
        this.planVisible = true
        this.planDetail = content
      }
    },
  };

</script>
<style scoped>
 .DetailHtml>>> img{
    max-width: 100% !important;
  }
</style>
