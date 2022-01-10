<template>
  <!-- 降水量趋势统计 -->
  <div class="trendStatistic">
    <a-card title="降水量趋势统计">
      <template slot="extra">
        <a-select v-model="current">
          <a-select-option value="jack">监测点_001</a-select-option>
          <a-select-option value="lucy">监测点_002</a-select-option>
          <a-select-option value="lucy">监测点_003</a-select-option>
        </a-select>
        <a-range-picker @change="onChange" style="width:250px;"/>
        <a-select v-model="current">
          <a-select-option value="jack">日数据</a-select-option>
          <a-select-option value="lucy">月数据</a-select-option>
          <a-select-option value="lili">年数据</a-select-option>
        </a-select>
        <a-button type="primary">数据导出</a-button>
      </template>
      <a-card-grid style="width: 100%; text-align: center; padding: 5px">

      </a-card-grid>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment';
  export default {
    props: ["pointId"],
    data() {
      return {
        current: 'jack'
      };
    },
    watch: {
      pointId: {
        handler: function (n, o) {
          console.log(n)
        },
        immediate: true
      }
    },
    methods: {
        moment,
      onChange(date, dateString) {
        console.log(date, dateString);
      },
    },
  }

</script>
<style lang="less" scoped>

</style>
