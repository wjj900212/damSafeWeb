<template>
  <!-- 水情概况 -->
  <div class="overview">
    <a-card title="雨情概况" style="width: 100%">
      <a slot="extra" href="#">安全管理预案</a>
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
              <div>所在位置</div>
              <div style="font-size:1.8rem;color:#1a94ff;">{{overViewData.waterState || '无'}}</div>
            </div>
          </div>
          <div class="s_right">
            <div>安全状态</div>
            <div style="font-size:1.8rem;color:#24C174;">{{overViewData.reservoirStatus || '无'}}</div>
          </div>
        </div>
      </a-card-grid>
      <a-card-grid style="width: 100%; padding: 5px">
        <div class="dataBox">
          <div class="data_tit">
            <div>
              <span>当前</span>
              <a-select v-model="current" :style="{width:'20rem'}" @change="handlePnPoint">
                <a-select-option v-for="pn in overViewData.pnList" :key="pn.pnId.toString()">{{pn.pnName}}</a-select-option>
              </a-select>
            </div>
            <div>
              <a-button type="primary" size="small">召测</a-button>
              <a-button type="primary" size="small">加密采集</a-button>
            </div>
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
      </a-card-grid>
    </a-card>
  </div>
</template>

<script>
export default {
  props: {
    hiddenId: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      current: '',
      overViewData: {},
      pnRainData: [],
      pnId: ''
    }
  },
  watch: {
    hiddenId: {
      handler: function (n, o) {
        this.getMonitorConditionRain()
      },
      immediate: true
    }
  },
  mounted () {
    this.getMonitorConditionRain()
  },
  methods: {
    handlePnPoint(value){
      this.pnId = value.toString()
      this.monitorPnDataRain(value)
      console.log('选中监测点', value)
    },
    getMonitorConditionRain () {
      let _this = this
      this.$get('web/monitorScene/monitorConditionRain', {
        hiddenId: _this.hiddenId
      }).then((res) => {
        if (res.data.code === 1) {
          if (res.data.data.pnList.length !== 0) {
            _this.current = res.data.data.pnList[0].pnName
            _this.monitorPnDataRain(res.data.data.pnList[0].pnId)
          }
          _this.overViewData = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 获取当前监测点列表信息
    monitorPnDataRain (pnId) {
      let _this = this
      this.$get('web/monitorScene/monitorPnDataRain', {
        pnId: pnId
      }).then((res) => {
        if (res.data.code === 1) {
          _this.pnRainData = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 召测
    reqrtd(pnId){
      let _this = this
      this.$get('web/monitorScene/reqrtd', {
        pnId: pnId
      }).then((res) => {
        if (res.data.code === 1) {
          _this.$message.success(res.data.msg)
        } else {
          _this.$message.error(res.data.msg)
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
