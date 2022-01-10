<template>
  <!-- 库水位趋势统计 -->
  <div class="trendStatistic">
    <div class="tit">
      <span>库水位趋势统计</span>
      <div>
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
      </div>
    </div>
    
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
<style scoped>
  /* .trendStatistic{} */
  .tit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f2f2f2;
    padding-bottom: 1rem;
    margin-top: 1rem;
  }

  .tit>span {
    font-size: 1.6rem;
  }

</style>
