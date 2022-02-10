<template>
  <a-card>
    <div class="safetyPlan">
      <div class="card">
        <img src="static/img/control/预案.png"/>
        <span>预警消息</span>
      </div>

    </div>
    <!--<div slot="title">
      <span>预警消息</span
      ><span style="font-size: 10px; margin-left: 10px; color: darkgray"
        >今日 {{total}}条消息</span
      >
    </div>
    <a slot="extra" @click="more">更多消息</a>-->
    <div style="width: 100%; text-align: center; padding: 0px;margin-top:1rem;">
      <a-list
        :loading="loading"
        bordered
        :dataSource="warnData"
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
          <div style="width: 100%;">
            <a-row>
              <a-col :span="12" style="text-align: left;">
                <span :style="{ color: getText(item.warnLevel).color}">{{item.flag === '1' ? '【报警】' : '【资讯】'}} {{ item.title }}</span>
              </a-col>
              <a-col :span="12" style="text-align: right;">
                <a-badge v-if="item.flag === '1'" :color="getText(item.warnLevel).color" :text="item.time" />
                <span v-else>{{ item.time }}</span>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24" style="background: whitesmoke;">
                <p class="infostyle">{{ item.content }}</p>
              </a-col>
            </a-row>
          </div>
        </a-list-item>
      </a-list>
    </div>
    <div style="text-align: right;margin-top:1rem;">
      <a @click="more">更多消息</a>
    </div>
  </a-card>
</template>
<script>
import { getText } from "@/utils/utils";
export default {
  name: "EmptyPageView",
  components: {},
  props: {
    reservoirId: {
      type: Number,
      default: () => -1,
    },
  },
  data() {
    return {
      loading: false,
      warnData: [],
      pageSize: 8,
      current: 0,
      total: 0
    };
  },
  computed: {},
  mounted() {
    this.getWarnList()
  },
  updated() {},
  watch: {
    reservoirId (val) { // 监听数据发生改变 刷新图表数据
      this.getWarnList()
    }
  },
  methods: {
    getText (str) {
      return getText(str)
    },
    more () {
      this.$router.push('/reservoir/warn/message')
    },
    getWarnList () {
      const { reservoirId, current, pageSize } = this
      if (reservoirId === -1) {
        return;
      }
      const params = {
        reservoirId: reservoirId,
        pageNum: current,
        pageSize: pageSize
      }
      this.$get('web/reservoirOverview/warningInformation', {
        ...params,
      }).then((r) => {
        if (r.data.data !== null) {
          let data = r.data.data
          this.warnData = data.records
          this.total = data.total
          this.pageSize = data.size
          // this.current = data.current
          // this.treeData = data.treeData
        }
      })
    },
    onTableChange (page) {
      // console.log(page)
      this.current = Number(page) - 1
      this.getWarnList()
    //   this.getProductList({...this.data})
    },
  },
};
</script>

<style lang="less" scoped>
.infostyle {
  text-align: left;
  text-indent: 2em;
  width: 80%;
  padding: 5px;
  margin: 0px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
