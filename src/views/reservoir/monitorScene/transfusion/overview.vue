<template>
  <!-- 渗流监测概况 -->
  <div class="overview">
    <a-card title="渗流监测概况" style="width: 100%">
     <!-- <a slot="extra" href="#">安全管理预案</a>-->
      <a-button slot="extra" @click="safeVisible=true"> 安全管理预案
        <a-icon type="read" style="fontSize:1.6rem" />
      </a-button>
      <a-card-grid style="width: 100%; padding: 5px">
        <div class="basicMsg">
          <div class="basicTxt">
            <a-icon type="area-chart" style="fontSize:3rem;color:#1397db" />
            <div class="basic">
              <div class="subtit">{{overViewData.hiddenName}}</div>
              <div class="subTxt"><span>测站编码</span> {{overViewData.stationCode}}</div>
              <div class="subTxt"><span>建设时间</span> {{overViewData.createTime}}</div>
              <div class="subTxt"><span>联系人</span> {{overViewData.hiddenCharge || '无'}}</div>
            </div>
          </div>
          <img src="static/img/u268.svg" alt="" />
        </div>
      </a-card-grid>
      <a-card-grid style="width: 100%; padding: 5px">
        <div class="stateMsg">
          <div class="s_left">
            <div>
              <span>当前</span>
              <a-select v-model="currentPoint" :style="{width:'20rem'}" @change="handlePnPoint">
                <a-select-option v-for="pn in pnList" :key="pn.pnId.toString()">{{pn.pnName}}</a-select-option>
              </a-select>
            </div>
            <div class="dataVBox">
              <div v-if="pnRainData.length === 0">
                无数据
              </div>
              <div class="dataV" v-else v-for="(pnRain,index) in pnRainData" :key="index">
                <div>
                  <span>{{pnRain.target}}</span>
                  <span class="cricle"></span>
                </div>
                <div>
                  <span style="color:#1a94ff;">{{pnRain.value}}</span>
                  <span>{{pnRain.time}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="s_right">
            <div>安全状态</div>
            <div :style="{ color: safetyColor }">{{ safetyName }}</div>
          </div>
        </div>
      </a-card-grid>
    </a-card>
    <!-- 安全管理预案 -->
    <safePlanArticle :safeVisible="safeVisible" :reserveType="11" @onClose="()=>{safeVisible=false}" />
  </div>
</template>

<script>
import safePlanArticle from '@/components/safePlanArticle/safePlanArticle.vue'
import { getText } from '@/utils/utils'
export default {
  props: {
    hiddenId: {
      type: Number,
      default: -1
    },
    overViewData: {
      type: Object,
      default: () => {}
    },
    pnList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {safePlanArticle},
  data () {
    return {
      currentPoint: '',
      pnRainData: [],
      pnId: '',
      safeVisible: false,
      safetyColor: '',
      safetyName: ''
    }
  },
  watch: {
    overViewData: {
      handler: function (n, o) {
        this.safetyColor = getText(n.reservoirStatus).color
        this.safetyName = getText(n.reservoirStatus).name
      },
      immediate: true
    },
    pnList: {
      handler: function (n, o) {
        let that = this
        if (!n || n.length === 0) {
          this.currentPoint = ''
          this.monitorPnData = []
        } else {
          that.currentPoint = n[0].pnId.toString()
          that.monitorPnDataRain(n[0].pnId)
        }
      },
      immediate: true
    }
  },
  mounted () {
  //  this.getMonitorConditionRain()
  },
  methods: {
    handlePnPoint (value) {
      this.pnId = value.toString()
      this.monitorPnDataRain(value)
      console.log('选中监测点', value)
    },
    getMonitorConditionRain () {
      let _this = this
      this.$get('web/monitorScene/monitorConditionVadose', {
        hiddenId: _this.hiddenId
      }).then((res) => {
        if (res.data.code === 1) {
          if (res.data.data.pnList.length !== 0) {
            _this.current = res.data.data.pnList[0].pnName
            _this.monitorPnDataRain(res.data.data.pnList[0].pnId)
          }
          _this.overViewData = res.data.data
          _this.safetyColor = getText(res.data.data.reservoirStatus).color
          _this.safetyName = getText(res.data.data.reservoirStatus).name
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 获取当前监测点列表信息
    monitorPnDataRain (pnId) {
      let _this = this
      this.$get('web/monitorScene/monitorPnDataVadose', {
        pnId: pnId
      }).then((res) => {
        if (res.data.code === 1) {
          _this.pnRainData = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
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
  .s_right {
    width:30%;
    display: flex;
    font-size: 1.8rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .s_left {
    flex: 1;
    padding:1rem;
    border-right: 1px solid #f2f2f2;
  }
  .data_tit {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
.dataVBox{
    display: flex;
    flex-wrap: wrap;
    margin-top: 1rem;
}
  .dataV{
    width: 45%;
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
