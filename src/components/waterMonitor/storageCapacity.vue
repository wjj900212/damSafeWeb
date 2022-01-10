<template>
  <!-- 水位库容曲线 -->
  <div class="storageCapacity">
    <div class="tit">
      <span>水位库容曲线</span>
    </div>
    <div class="trendCon">
      <div>
        <div>当前 监测点_001</div>
        <div style="margin: 1rem 0;">
          <span class="cricle"></span>
          <span>202101100040</span>
        </div>
      </div>
      <div class="echartTU">
        <!-- <chartTU /> -->
      </div>
      <div style="width:30%">
        <a-table :columns="columns" :data-source="data">
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
  // import chartTU from "../echarts/EchartsArrLine.vue"
  import moment from 'moment';
  const columns = [{
      title: '库水位(m)',
      dataIndex: 'val',
      key: 'val1'
    },
    {
      title: '库容(百万m³)',
      dataIndex: 'age',
      key: 'age',
    },
  ];

  const data = [{
      key: '1',
      age: 32,
      val: 60,
    },
    {
      key: '2',
      age: 42,
      val: 60,
    },
    {
      key: '3',
      age: 32,
      val: 60
    },
  ];

  export default {
    props: ["pointId"],
    components: {
      // chartTU
    },
    data() {
      return {
        data,
        columns,
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

  .trendCon {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
  }

  .echartTU {
    width: 60%;
    margin: 0 1rem;
  }

</style>
