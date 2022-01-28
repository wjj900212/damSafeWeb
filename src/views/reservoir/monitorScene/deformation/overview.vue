<template>
  <!-- 变形监测概况 -->
  <div class="overviewD">
    <a-card style="width: 100%">
      <template slot="title">
        <img src="static/img/渗压监测概况.png">
        <span>变形监测概况</span>
      </template>
      <a href="JavaScript:;" slot="extra" @click="safeVisible=true">安全管理预案</a>
      <a-card-grid style="width: 100%; padding: 5px">
        <div class="basicMsg">
          <div class="basic">
            <div class="subtit"><span class="t_line"></span> {{ data.hiddenName }}</div>
            <div class="subTxt"><span>测站编码：</span> {{data.stationCode}}</div>
            <div class="subTxt"><span>建设时间：</span>
              {{data.createTime?data.createTime.substring(0,10):''}}</div>
            <div class="subTxt"><span>联系人员：</span> {{data.hiddenCharge}}</div>
          </div>
          <div class="reservoirStatus">
            <template v-if="data.reservoirStatus==='0'">
              <img src="static/img/正常.png">
              <div>
                <div style="color:#3CC8AE;font-size:2.4rem;">正常</div>
                <div style="color:#5D6574;font-size:1.2rem;">安全状态</div>
              </div>
            </template>
            <template v-if="data.reservoirStatus==='1'">
              <img src="static/img/异常.png">
              <div>
                <div style="color:#FF9809;font-size:2.4rem;">异常</div>
                <div style="color:#5D6574;font-size:1.2rem;">安全状态</div>
              </div>
            </template>
            <template v-if="data.reservoirStatus==='2'">
              <img src="static/img/险情.png">
              <div>
                <div style="color:#FE5230;font-size:2.4rem;">险情</div>
                <div style="color:#5D6574;font-size:1.2rem;">安全状态</div>
              </div>
            </template>
          </div>
          <div style="flex:1;"></div>
        </div>
      </a-card-grid>
      <a-card-grid style="width: 100%; padding: 25px">
        <div class="dataBox">
          <div class="item" v-for="item,i in data.pnList" :key="i">
            <span>{{ item.pnName }}</span>
            <div><span
                :style="{ color: getTypeText(item.basicOnline).color }">{{ getTypeText(item.basicOnline).name}}</span>
              / <span
                :style="{ color: getText(item.newestWarnStatus).color }">{{ getText(item.newestWarnStatus).name}}</span>
            </div>
          </div>
        </div>
      </a-card-grid>
    </a-card>
    <!-- 安全管理预案 -->
    <safePlanArticle :safeVisible="safeVisible" :reserveType="15" @onClose="()=>{safeVisible=false}" />
  </div>
</template>

<script>
  import {
    getText,
    getTypeText
  } from "@/utils/utils";
  import safePlanArticle from '@/components/safePlanArticle/safePlanArticle.vue'
  export default {
    components: {
      safePlanArticle
    },
    props: {
      data: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        monitorList: [],
        safeVisible: false
      }
    },
    watch: {

    },
    mounted() {},
    methods: {
      getText(str) {
        return getText(str)
      },
      getTypeText(str) {
        return getTypeText(str)
      }
    }
  }

</script>
<style lang="less" scoped>
  .overviewD {
    background-color: #fff;
    position: relative;
  }

  .basicMsg {
    display: flex;
    justify-content: space-between;
    padding: 1.5rem;
  }

  .basic {
    flex: 1.3;
    padding: 1rem;
    box-shadow: 1px 0px 18px 0px rgba(172, 200, 219, 0.3);
    border-radius: 8px;
  }

  .subtit {
    font-weight: 500;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    color: #191E2A;
  }

  .t_line {
    background-color: #1890FF;
    width: 4px;
    height: 15px;
    margin-right: 6px;
  }

  .subTxt {
    text-indent: 4px;
    font-size: 1.4rem;
    color: #191E2A;
  }

  .subTxt span {
    display: inline-block;
    color: #5D6574;
  }

  .reservoirStatus {
    flex: 1;
    padding: 1.5rem;
    background-color: rgba(246, 250, 255, 1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 0 1.5rem;
  }

  .dataBox {
    height: 23rem;
    overflow: auto;
  }

  .item {
    width: 48%;
    float: left;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .item:nth-child(even){
    float: right;
  }

</style>
