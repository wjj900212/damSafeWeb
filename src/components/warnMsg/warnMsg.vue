<template>
  <!-- 预警信息 -->
  <div class="warnMsg">
    <a-card>
      <template slot="title">
        <img src="static/img/预案.png">
        <span>预警信息</span>
      </template>
      <template slot="extra">
        <a-select v-model="queryParams.type" @change="getWarnMsg()">
          <a-select-option value="">全部预警</a-select-option>
          <a-select-option value="1">设备预警</a-select-option>
          <a-select-option value="2">安全预警</a-select-option>
          <a-select-option value="5">模型预警</a-select-option>
        </a-select>
      </template>
      <a-card-grid style="width: 100%; text-align: center; padding: 5px">
        <div class="total">
          <div>
            <span style="color:#FF2626;margin-right: 10px;">红色预警:{{warnData.red}}</span>
            <span style="color:#FF9F00;margin-right: 10px;">橙色预警:{{warnData.orange}}</span>
            <span style="color:#F9D044;margin-right: 10px;">黄色预警:{{warnData.yellow}}</span>
            <span style="color:#3399FF;margin-right: 10px;">蓝色预警:{{warnData.blue}}</span>
          </div>
          <div>
            <span class="btnt" :class="queryParams.dateType==1?'act':''" @click="dateChange(1)">今日</span>
            <span class="btnt" :class="queryParams.dateType==2?'act':''" @click="dateChange(2)">近一周</span>
            <span class="btnt" :class="queryParams.dateType==3?'act':''" @click="dateChange(3)">近一月</span>
          </div>
        </div>
        <a-table style="padding:0 1rem;" :columns="columns" :data-source="warnData.list" :pagination="pagination"
          :rowKey="(record,index)=>{return index}">
          <a slot="level" slot-scope="text"
            :style="{color:text==4?'#FF2626':text==3?'#FF9F00':text==2?'#F9D044':'#3399FF'}">{{ text==4?'红色预警':text==3?'橙色预警':text==2?'黄色预警':text==1?'蓝色预警':'' }}</a>
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
      dataIndex: 'pnName',
      key: 'pnName',
    },
    {
      title: '预警时间',
      dataIndex: 'warningTime',
      key: 'warningTime',
    },
    {
      title: '预警等级',
      dataIndex: 'warningLevel',
      key: 'warningLevel',
      scopedSlots: {
        customRender: 'level'
      },
      width: 90
    },
    {
      title: '预警值(mm)',
      dataIndex: 'warnValue',
      key: 'warnValue'
    },
    {
      title: '阈值',
      dataIndex: 'threshold',
      key: 'threshold',
    },
    {
      title: '警示信息',
      dataIndex: 'warningInfomation',
      key: 'warningInfomation',
      ellipsis: true,
    },
  ];

  export default {
    props: ["hiddenId"],
    data() {
      return {
        queryParams: {
          type: '', //1设备预警 2安全预警 5模型计算预警
          dateType: 1,
        },
        warnData: {
          list: []
        },
        columns,
        pagination: {
          current: 1,
          pageSize: 5,
          total: 0,
          onChange: (cur, size) => {
            this.pagination.current = cur;
            this.getWarnMsg()
          }
        }
      };
    },
    watch: {
      hiddenId: {
        handler: function (n, o) {
          if (!n) {
            this.warnData = []
            return
          }
          this.getWarnMsg()
        },
        immediate: true
      }
    },
    methods: {
      // 获取预警信息
      getWarnMsg() {
        if (!this.hiddenId) return
        this.queryParams.hiddenId = this.hiddenId
        this.queryParams.pageNum = this.pagination.current
        this.queryParams.pageSize = this.pagination.pageSize
        this.$get("/web/monitorScene/getEarlyWarningList", this.queryParams).then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return
          }
          let data = rr.data
          this.warnData = data
          this.pagination.total = data.total
        })
      },
      // i 	1今日 2近一周 3近一个月
      dateChange(i) {
        if (i == this.queryParams.dateType) return false
        this.queryParams.dateType = i
        this.getWarnMsg()
      }
    },
  }

</script>
<style scoped>
  .total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 1;
    padding: 1.5rem;
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

  .warnMsg>>>.ant-card-grid {
    min-height: 573px;
  }

  .warnMsg>>>.ant-table-thead>tr>th {
    background-color: #F7FAFF;
    border-color: rgba(59, 173, 255, 0.12);
  }

  .warnMsg>>>.ant-table-tbody>tr>td {
    border-color: rgba(59, 173, 255, 0.12);
  }

</style>
