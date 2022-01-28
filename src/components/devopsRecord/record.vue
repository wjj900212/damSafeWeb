<template>
  <!-- 运维记录 -->
  <div class="record">
    <a-card>
      <template slot="title">
        <img src="static/img/icon-运维记录.png">
        <span>运维记录</span>
      </template>
      <template slot="extra">
        <div style="display: flex;white-space: nowrap;align-items: center;">
          <a-input-search placeholder="请输入关键字" v-model="search" @search="onSearch"/>
        </div>
      </template>
      <a-card-grid style="width: 100%; text-align: center; padding: 5px">
        <div class="total">
          <div></div>
          <div>
            <span class="btnt" :class="seeAct==1?'act':''" @click="seeAct=1">今日</span>
            <span class="btnt" :class="seeAct==2?'act':''" @click="seeAct=2">近一周</span>
            <span class="btnt" :class="seeAct==3?'act':''" @click="seeAct=3">近一月</span>
          </div>
        </div>
        <a-table style="padding:0 1rem;" :columns="columns" :data-source="data" :pagination="pagination">
        </a-table>
        <a href="javascript:;" style="float:right;margin-top:5px;margin-right:10px;">查看更多
          <a-icon type="double-right" /></a>
      </a-card-grid>
    </a-card>
  </div>
</template>

<script>
  const columns = [{
      title: '监测点',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      scopedSlots: {
        customRender: 'type'
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state'
    },
    {
      title: '信息',
      dataIndex: 'msg',
      key: 'msg',
      ellipsis: true,
    },
  ];

  const data = [{
      key: '1',
      name: '01',
      time: "2022-05-30 12:15:15",
      type: "人工巡检",
      state: "正常",
      msg: "监测点无异常，电压6.25，信号41"
    },
    {
      key: '2',
      name: '02',
      time: "2022-05-30 12:15:15",
      type: "人工巡检",
      state: "正常",
      msg: "监测点无异常，电压6.25，信号41"
    },
    {
      key: '3',
      name: '03',
      time: "2022-05-30 12:15:15",
      type: "人工巡检",
      state: "正常",
      msg: "监测点无异常，电压6.25，信号41"
    },
    {
      key: '4',
      name: '04',
      time: "2022-05-30 12:15:15",
      type: "人工巡检",
      state: "正常",
      msg: "监测点无异常，电压6.25，信号41"
    },
    {
      key: '5',
      name: '05',
      time: "2022-05-30 12:15:15",
      type: "人工巡检",
      state: "正常",
      msg: "监测点无异常，电压6.25，信号41"
    },
  ];

  export default {
    data() {
      return {
        search: '',
        data,
        columns,
        seeAct: 1,
        pagination: {
          current: 1,
          pageSize: 5,
          onChange: (cur, size) => this.pagination.current = cur
        }
      };
    },
    methods: {
      onSearch(){}
    },
  }

</script>
<style scoped>
  .total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 1;
    padding: 1.5rem 0;
  }

  .btnt {
    color: #069AFE;
    border: 1px solid #069AFE;
    padding: 3px 8px;
    cursor: pointer;
    border-radius: 6px;
  }

  .btnt:nth-child(2) {
    margin: 0 5px;
  }

  .btnt.act {
    background-color: #069AFE;
    color: #fff;
  }

  .record>>>.ant-table-thead>tr>th {
    background-color: #F7FAFF;
    border-color: rgba(59, 173, 255, 0.12);
  }

  .record>>>.ant-table-tbody>tr>td {
    border-color: rgba(59, 173, 255, 0.12);
  }
</style>
