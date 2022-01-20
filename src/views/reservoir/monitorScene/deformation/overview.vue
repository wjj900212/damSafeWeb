<template>
  <!-- 水情概况 -->
  <div class="overview">
    <a-card title="变形监测概况" style="width: 100%">
      <a slot="extra" href="#">安全管理预案</a>
      <a-card-grid style="width: 100%; padding: 30px">
        <a-row>
          <a-col :span="2">
            <img width="48" height="48" src="static/img/u348.png" alt="">
          </a-col>
          <a-col :span="16">
            <a-row>
              <a-col :span="24">
                <h1>{{ data.hiddenName }}</h1>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="4">测站编码</a-col>
              <a-col :span="20">{{ data.stationCode }}</a-col>
            </a-row>
            <a-row>
              <a-col :span="4">建设时间</a-col>
              <a-col :span="20">{{ data.createTime }}</a-col>
            </a-row>
            <a-row>
              <a-col :span="4">联系人</a-col>
              <a-col :span="20">{{ data.hiddenCharge }}</a-col>
            </a-row>
          </a-col>
          <a-col :span="6">
            <img v-if="data.image" width="200" height="110" :src="data.image" alt="">
          </a-col>
        </a-row>
      </a-card-grid>
      <a-card-grid style="width: 100%; padding: 30px">
        <a-row>
          <a-col :span="18">
            <a-row v-for="item in data.pnList" :key="item.pnId">
              <a-col :span="12">{{ item.pnName }}</a-col>
              <a-col :span="12"><span :style="{ color: getTypeText(item.basicOnline).color }">{{ getTypeText(item.basicOnline).name}}</span> / <span :style="{ color: getText(item.newestWarnStatus).color }">{{ getText(item.newestWarnStatus).name}}</span></a-col>
            </a-row>
          </a-col>
          <a-col :span="6">
            <a-row>
              <a-col>安全状态</a-col>
            </a-row>
            <a-row>
              <a-col><span :style="{ color: getText(data.reservoirStatus).color }">{{ getText(data.reservoirStatus).name}}</span></a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-card-grid>
    </a-card>
  </div>
</template>

<script>
import { getText, getTypeText } from "@/utils/utils";
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      monitorList: [],
    }
  },
  watch: {
    
  },
  mounted () {
  },
  methods: {
    getText (str) {
      return getText(str)
    },
    getTypeText (str) {
      return getTypeText(str)
    }
  }
}

</script>
<style lang="less" scoped>
  .overview {
    background-color: #fff;
    position: relative;
  }

  .basicMsg {
    display: flex;
    /* align-items: center; */
    justify-content: space-between;
    padding: 1rem 0;
  }

  .basicTxt {
    display: flex;
  }

  .basic {
    margin-left: 5px;
  }

  .subtit {
    font-weight: 500;
    font-size: 1.6rem;
  }

  .subTxt {
    font-size: 1.4rem;
  }

  .subTxt span {
    display: inline-block;
    width: 8rem;
  }

  .stateMsg {
    display: flex;
    align-items: left;
    /* justify-content: space-around; */
    padding: 1rem 0;
    border-bottom: 1px solid #f2f2f2;
    font-size: 1.6rem;
  }

  .s_left,
  .s_right {
    flex: 1;
    text-align: center;
  }

  .s_left {
    border-right: 1px solid #f2f2f2;
  }

  .bili {
    width: 4.5rem;
    height: 4.5rem;
    background-color: skyblue;
    border-radius: 50%;
    margin-left: 5px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

  }

  .bilivimg {
    width: 3.8rem;
    height: 3.8rem;
    border-radius: 50%;
    background-color: pink;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 50%;
  }

  .bliliv {
    color: #8b8d90;
    text-align: center;
    text-shadow: #000;
    position: relative;
    z-index: 1;
  }

  .dataBox {
    padding: 1rem 0;
  }

  .data_tit {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
.dataVBox{
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-wrap: wrap;
    margin-top: 1rem;
}
  .dataV{
    width: 30%;
    padding: 8px;
    box-shadow: 2px 2px 15px rgba(76,89,248,16%);
    margin-bottom: 1rem;
    cursor: default;
  }
  .dataV div{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .cricle {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color:#1a94ff;
  }
</style>
