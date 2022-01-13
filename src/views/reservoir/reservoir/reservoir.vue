<template>
  <div style="width: 100%">
    <a-row :style="{ marginBottom: '24px' }">
      <a-col :span="24">
        <a-card :title="info.reservoirName">
          <a-card-grid style="width: 100%; text-align: left">
            <a-row>
              <a-col :span="5">
                <img :src="info.images" v-if="info.images" width="300" height="200" alt="" />
              </a-col>
              <a-col :span="19" :style="{ marginTop: '2em' }">
                <div v-html="info.notes"></div>
              </a-col>
            </a-row>
          </a-card-grid>
        </a-card>
      </a-col>
    </a-row>
    <a-row :style="{ marginBottom: '24px' }">
      <a-col :span="24">
        <a-card title="基本信息">
          <a-card-grid style="width: 100%; text-align: left">
            <a-row>
              <a-col :span="24">
                <a-descriptions layout="horizontal" bordered :column="3">
                  <a-descriptions-item label="水库名称">
                    {{ info.reservoirName }}
                  </a-descriptions-item>
                  <a-descriptions-item label="水库地址">
                    {{ info.cityName }}
                  </a-descriptions-item>
                  <a-descriptions-item label="位置坐标">
                    {{ info.longitude +' , '+ info.latitude }}
                  </a-descriptions-item>
                  <a-descriptions-item label="管理单位">
                    {{ info.managerUnit }}
                  </a-descriptions-item>
                  <a-descriptions-item label="水库规模">
                    {{ scale[info.scale] }} 
                  </a-descriptions-item>
                  <a-descriptions-item label="设计库容">
                    {{ info.capacity }} 亿立方米
                  </a-descriptions-item>
                  <a-descriptions-item label="最高水位">
                    {{ info.depth }} 米
                  </a-descriptions-item>
                  <a-descriptions-item label="建设时间">
                    {{ info.buildTime }}
                  </a-descriptions-item>
                  <a-descriptions-item v-for="(i, index) in info.customParam" :key="index" :label="i.key">
                    {{ i.value }}
                  </a-descriptions-item>
                </a-descriptions>
              </a-col>
            </a-row>
          </a-card-grid>
        </a-card>
      </a-col>
    </a-row>
    <a-row :style="{ marginBottom: '24px' }">
      <a-col :span="24">
        <a-card title="详情">
          <a-card-grid style="width: 100%; text-align: left">
            <a-row>
              <a-col :span="24">
                <div v-html="info.introduct"></div>
              </a-col>
            </a-row>
          </a-card-grid>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: "EmptyPageView",
  components: {},
  data() {
    return {
      info: {},
      scale: {
        '0': '大（1）型',
        '1': '大（2）型',
        '2': '中型',
        '3': '小（1）型',
        '4': '小（2）型'
      }
    };
  },
  computed: {
    ...mapState({
      reservoirId: state => state.account.reservoirId
    })
  },
  mounted() {
    this.getReservoirInfo()
  },
  updated() {},
  watch: {
    reservoirId (val) { // 监听数据发生改变 刷新图表数据
      this.getReservoirInfo()
    }
  },
  methods: {
    getReservoirInfo () {
      const { reservoirId } = this
      const params = {
        reservoirId: reservoirId
      }
      this.$get('web/reservoirAdmin/getReservoirDetail', {
        ...params,
      }).then((r) => {
        if (r.data.data !== null) {
          let data = r.data.data
          if (data.customParam !== '') {
            data.customParam = JSON.parse(data.customParam)
          } else {
            data.customParam = []
          }
          this.info = data
          // data.safeLevelObj = this.getWarnText(data.safeLevel)
          // this.reservoirInfo = data
          // this.radarData = data.monitorList
        }
      })
    }
  },
};
</script>

<style lang="less" scoped>
p {
  white-space: normal;
  word-break: normal;
  text-indent: 2em;
}
</style>
