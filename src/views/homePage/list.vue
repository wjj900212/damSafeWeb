<template>
  <!-- 水库概览 列表 -->
  <div class="left_list">
    <borderCom titTxt="水库概览" />
    <div class="con">
      <a-input-search placeholder="水库名称搜索" enter-button @search="onSearch" />
      <Cascader style="width:100%;margin-top:.8rem" @getDistData="getDistData" :updateOptions="optionCityInfo"
        :defaultValue="casdata" />
      <div class="reservoirArr">
        <template v-for="v,i in reservoirArr">
          <div class="item" :key="i" @click="tapReservoir(v)">
            <div class="item_tit_box">
              <div class="titName">
                <a-icon type="caret-right" style="color:rgb(7,171,183)" />
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
        actReservoir:''
      };
    },
    methods: {
      // 获取子组件返回的cityCode和cityType
      getDistData(distData) {
        this.queryParams.cityCode = distData.cityCode
        this.getData()
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
        if(val.reservoirId==this.actReservoir)this.actReservoir=''
        else this.actReservoir=val.reservoirId
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
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .con {
    width: 100%;
    margin-top: 28px;
    padding: 1rem;
  }

  .reservoirArr {
    position: absolute;
    height: calc(100% - 160px);
    /* height: calc(100% - 120px); */
    overflow-y: auto;
    margin-top: 1rem;
    width: calc(100% - 2rem);
  }

  .reservoirArr::-webkit-scrollbar {
    display: none;
  }

  .item {
    padding: .8rem;
    border: 1px solid rgb(14, 157, 171);
    background-color: rgb(16, 77, 101);
    margin-bottom: 1rem;
    cursor: pointer;
    font-size: 1.4rem;
  }

  .item_tit_box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgb(14, 157, 171);
    line-height: 1;
    padding: .8rem 0;
  }

  .titName {
    color: #fff;
  }

  .status {
    color: greenyellow;
  }

  .item_con {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    padding-top: 1rem;
  }

  .item_con p {
    margin-bottom: 0;
    line-height: 1;
  }

  .item_con p:nth-child(1) {
    margin-bottom: 1rem;
  }

  .numA {
    color: #00FFFF;
  }

  .numB {
    color: red;
  }

  .pagination {
    position: absolute;
    width: calc(100% - 2rem);
    bottom: .8rem;
  }

</style>
