<template>
  <!-- 预警信息 -->
  <div class="warnMsg">
    <div class="tit">
      <span>预警信息</span>
      <div>
        <a-select v-model="current">
          <a-select-option value="jack">全部预警</a-select-option>
          <a-select-option value="juerry">设备预警</a-select-option>
          <a-select-option value="lucy">安全预警</a-select-option>
          <a-select-option value="tom">模型预警</a-select-option>
        </a-select>
        <a slot="extra" href="javascript:;" style="margin-left:5px">查看更多
          <a-icon type="double-right" /></a>
      </div>
    </div>
    <div class="total">
      <div>
        <span style="color:#FF2626">红色预警 1</span>
        <span style="color:#FF9F00">橙色预警 1</span>
        <span style="color:#F9D044">黄色预警 1</span>
        <span style="color:#3399FF">蓝色预警 1</span>
      </div>
      <div>
        <span class="btnt" :class="seeAct==1?'act':''" @click="seeAct=1">今日</span>
        <span class="btnt" :class="seeAct==2?'act':''" @click="seeAct=2">近一周</span>
        <span class="btnt" :class="seeAct==3?'act':''" @click="seeAct=3">近一月</span>
      </div>
    </div>
    <a-table :columns="columns" :data-source="data" :pagination="pagination">
      <a slot="level" slot-scope="text" :style="{color:text==1?'#FF2626':text==2?'#FF9F00':text==3?'#F9D044':'#3399FF'}">{{ text==1?'红色预警':text==2?'橙色预警':text==3?'黄色预警':text==4?'蓝色预警':'' }}</a>
    </a-table>
  </div>
</template>

<script>
  const columns = [{
      title: '监测点',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '预警时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '预警等级',
      dataIndex: 'level',
      key: 'level',
      scopedSlots: {
        customRender: 'level'
      },
    },
    {
      title: '预警值(mm)',
      dataIndex: 'warnv',
      key: 'warnv'
    },
    {
      title: '阈值',
      dataIndex: 'threshold',
      key: 'threshold',
    },
    {
      title: '警示信息',
      dataIndex: 'msg',
      key: 'msg',
      ellipsis: true,
    },
  ];

  const data = [{
      key: '1',
      name: '01',
      level: 1,
      time: "2022-05-30 12:15:15",
      warnv: 224.3,
      threshold: 200,
      msg: "库水位已超出一级警戒线..."
    },
    {
      key: '2',
      name: '02',
      level: 2,
      time: "2022-05-30 12:15:15",
      warnv: 180.7,
      threshold: 150,
      msg: "库水位已超出一级警戒线..."
    },
    {
      key: '3',
      name: '03',
      level: 3,
      time: "2022-05-30 12:15:15",
      warnv: 110.6,
      threshold: 100,
      msg: "库水位已超出一级警戒线..."
    },

    {
      key: '4',
      name: '04',
      level: 4,
      time: "2022-05-30 12:15:15",
      warnv: 68.5,
      threshold: 50,
      msg: "库水位已超出一级警戒线..."
    },
    {
      key: '5',
      name: '05',
      level: 2,
      time: "2022-05-30 12:15:15",
      warnv: 68.5,
      threshold: 50,
      msg: "库水位已超出一级警戒线..."
    },
    {
      key: '6',
      name: '06',
      level: 3,
      time: "2022-05-30 12:15:15",
      warnv: 68.5,
      threshold: 50,
      msg: "库水位已超出一级警戒线..."
    },
  ];

  export default {
    data() {
      return {
        current: 'jack',
        data,
        columns,
        seeAct:1,
        pagination: {
          current: 1,
          pageSize: 5,
          onChange: (cur, size) => this.pagination.current=cur
        }
      };
    },
    methods: {},
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

  .total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 1;
    padding: 1.5rem 0;
  }
  .btnt{
      color: #069AFE;
      border: 1px solid #069AFE;
      padding: 3px 8px;
      cursor: pointer;
      border-radius: 6px;
  }
  .btnt:nth-child(2){
      margin: 0 5px;
  }
  .btnt.act{
      background-color: #069AFE;
      color: #fff;
  }

</style>
