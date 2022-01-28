<template>
  <!-- 水库概览 列表 -->
  <div class="left_list">
    <borderCom titTxt="水库概览" />
    <div class="con">
      <a-input-search placeholder="水库名称搜索" enter-button @search="onSearch">
      </a-input-search>
      <Cascader style="width:100%;margin-top:.8rem;background: transparent;color: #fff;" @getDistData="getDistData"
        :updateOptions="optionCityInfo" :defaultValue="casdata" />
      <div class="reservoirArr">
        <template v-for="v,i in reservoirArr">
          <div class="item" :key="i" @click="tapReservoir(v)">
            <div class="item_tit_box">
              <div class="titName">
                <img src="static/img/椭圆 502.png" alt="">
                <span>{{v.reservoirName | ellipsis(10)}}</span>
              </div>
              <span class="status">{{v.reservoirStatus==1?'异常':v.reservoirStatus==2?'险情':'正常'}}</span>
            </div>
            <div class="item_con">
              <div>
                <p>测站</p>
                <p class="numA">{{v.stationCount}}</p>
              </div>
              <div>
                <p>监测点</p>
                <p class="numA">{{v.pnCount}}</p>
              </div>
              <div>
                <p>在线率</p>
                <p class="numA">{{v.onlineRate}}</p>
              </div>
              <div>
                <p>今日预警</p>
                <p class="numB">{{v.warnCount}}</p>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="pagination">
        <a-pagination size="small" :total="pagination.total" :current="pagination.pageNum"
          :pageSize="pagination.pageSize" @change="pageChange" />
      </div>
    </div>
  </div>
</template>

<script>
  import borderCom from "./border.vue"
  import Cascader from '@/components/distselect/cascader.vue'
  import Bus from "../../utils/bus"
  export default {
    components: {
      borderCom,
      Cascader
    },
    data() {
      return {
        optionCityInfo: [],
        casdata: [], // 级联插件默认值
        queryParams: {
          cityCode: '',
          reservoirName: ''
        },
        pagination: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        reservoirArr: [],
        actReservoir: ''
      };
    },
    methods: {
      // 获取子组件返回的cityCode和cityType
      getDistData(distData) {
        this.queryParams.cityCode = distData.cityCode ? distData.cityCode : ''
        // this.getData()
      },
      pageChange(page, pageSize) {
        //   console.log(page, pageSize)
        this.pagination.pageNum = page
        this.getData()
      },
      onSearch(value) {
        this.queryParams.reservoirName = value ? value : ''
        this.getData()
      },
      getData() {
        this.queryParams.pageNum = this.pagination.pageNum
        this.queryParams.pageSize = this.pagination.pageSize
        this.$get("/web/onePicture/reservoirOverview", this.queryParams).then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return
          }
          let data = rr.data
          this.pagination.total = data.total
          this.reservoirArr = data.records
        })
      },
      // 点击水库
      tapReservoir(val) {
        // console.log('tapReservoir', val)
        if (val.reservoirId == this.actReservoir) this.actReservoir = ''
        else this.actReservoir = val.reservoirId
        Bus.$emit('reservoirId', this.actReservoir);
      }
    },
    mounted() {
      this.getData()
    },

    filters: {
      // 名称过长时用...代替
      ellipsis(value, num) {
        if (!value) {
          return ''
        }
        if (value.length > num) {
          return value.slice(0, num) + '...'
        }
        return value
      }
    }
  }

</script>
<style scoped>
  .left_list {
    width: calc(100% - 10px);
    height: 100%;
    position: absolute;
    margin: 0 5px;
  }

  .con {
    /* width: 100%; */
    width: 99%;
    margin: 0 auto;
    padding: 1rem;
    /* float: left; */
    /* background: url('../../../static/img/model-bg.png') no-repeat;
    background-size: 100% 100%; */
    height: calc(100% - 50px);
    background: rgba(13, 76, 145, 0.4);
    box-shadow: 0px 0px 10px 0px rgba(17, 40, 255, 0.66) inset;
    border-radius: 3px;
  }

  .con>>>.ant-input {
    background: transparent;
    border-color: #1890ff;
    color: #fff;
  }

  .con>>>.ant-input-group-addon {
    background: transparent;
  }

  .con>>>.ant-btn-primary {
    background: transparent;
  }

  .con>>>.ant-cascader-picker-arrow {
    color: #fff;
  }

  .reservoirArr {
    /* position: absolute; */
    height: calc(100% - 11rem);
    /* height: calc(100% - 120px); */
    overflow-y: auto;
    margin-top: 1rem;
  }

  .reservoirArr::-webkit-scrollbar {
    display: none;
  }

  .item {
    background: url('../../../static/img/矩形1718拷贝.png') no-repeat;
    background-size: 100% 100%;
    padding: .8rem;
    margin-bottom: 1rem;
    cursor: pointer;
    font-size: 1.4rem;
  }

  .item_tit_box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(0, 204, 255, .49);
    line-height: 1;
    padding: .8rem 0;
  }

  .titName {
    color: #fff;
    font-size: 1.6rem;
    font-weight: 500;
  }

  .status {
    color: #41FF5C;
    font-size: 1.4rem;
  }

  .item_con {
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #fff;
    padding-top: 1rem;
    text-align: right;
  }

  .item_con p {
    margin-bottom: 1rem;
    line-height: 1;
    font-size: 1.4rem;
  }

  .numA {
    color: rgba(0, 204, 255, .8);
    ;
  }

  .numB {
    color: #FF9500;
  }

  .pagination {
    position: absolute;
    width: calc(100% - 2rem);
    bottom: .8rem;
  }

  .pagination>>>.ant-pagination-item a {
    color: #fff;
  }

  .pagination>>>.ant-pagination-item-link .anticon {
    color: #fff;
  }

  .pagination>>>.ant-pagination-item-active {
    background-color: transparent;
  }

  .pagination>>>.ant-pagination-item-active a {
    color: rgba(0, 204, 255, .8);
    ;
  }

</style>
