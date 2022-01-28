<template>
  <!-- 渗流监测概况 -->
  <div class="overviewT">
    <a-card style="width: 100%">
      <template slot="title">
        <img src="/static/img/渗流监测概况.png">
        <span>渗流监测概况</span>
      </template>
      <a href="JavaScript:;" slot="extra" @click="safeVisible=true">安全管理预案</a>
      <a-card-grid style="width: 100%; padding: 5px">
        <div class="basicMsg">
          <div class="basic">
            <div class="subtit"><span class="t_line"></span> {{overViewData.hiddenName}}</div>
            <div class="subTxt"><span>测站编码：</span> {{overViewData.stationCode}}</div>
            <div class="subTxt"><span>建设时间：</span>
              {{overViewData.createTime?overViewData.createTime.substring(0,10):''}}</div>
            <div class="subTxt"><span>联系人员：</span> {{overViewData.hiddenCharge}}</div>
          </div>
          <div class="reservoirStatus">
            <template v-if="overViewData.reservoirStatus==='0'">
              <img src="/static/img/正常.png">
              <div>
                <div style="color:#3CC8AE;font-size:2.4rem;">正常</div>
                <div style="color:#5D6574;font-size:1.2rem;">安全状态</div>
              </div>
            </template>
            <template v-if="overViewData.reservoirStatus==='1'">
              <img src="/static/img/异常.png">
              <div>
                <div style="color:#FF9809;font-size:2.4rem;">异常</div>
                <div style="color:#5D6574;font-size:1.2rem;">安全状态</div>
              </div>
            </template>
            <template v-if="overViewData.reservoirStatus==='2'">
              <img src="/static/img/险情.png">
              <div>
                <div style="color:#FE5230;font-size:2.4rem;">险情</div>
                <div style="color:#5D6574;font-size:1.2rem;">安全状态</div>
              </div>
            </template>
          </div>
          <div style="flex:1;"></div>
        </div>
      </a-card-grid>
      <a-card-grid style="width: 100%; padding: 5px">
        <div class="stateMsg">
          <div style="margin-left:1.5rem;">
            <span>当前：</span>
            <a-select v-model="currentPoint" :style="{width:'20rem'}" @change="handlePnPoint">
              <a-select-option v-for="pn in pnList" :key="pn.pnId.toString()">{{pn.pnName}}</a-select-option>
            </a-select>
          </div>
          <div class="dataVBox">
            <a-empty v-if="pnRainData.length === 0" />
            <div style="display: flex;align-items: center;justify-content:space-evenly;width:100%;flex-wrap: wrap;">
              <div class="dataV" v-for="(pnRain,index) in pnRainData" :key="index">
                <div>
                  <span
                    style="color:#191E2A;font-size:1.6rem;">{{pnRain.target}}{{pnRain.unit?'('+pnRain.unit+')':''}}</span>
                  <span class="cricle"
                    :style="{background:pnRain.level==4?'#FF2626':pnRain.level==3?'#FF9F00':pnRain.level==2?'#F9D044':pnRain.level==1?'#3399FF':'#3FCAAF'}"></span>
                </div>
                <div>
                  <span
                    :style="{color:pnRain.level==4?'#FF2626':pnRain.level==3?'#FF9F00':pnRain.level==2?'#F9D044':pnRain.level==1?'#3399FF':'#3FCAAF',fontSize:'2.2rem'}">{{pnRain.value}}</span>
                </div>
                <div style="color:#696969;font-size:1.4rem;min-height: 21px;">{{pnRain.time.substring(5,16)}}</div>
              </div>
            </div>
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
  import {
    getText
  } from '@/utils/utils'
  export default {
    props: {
      hiddenId: {},
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
    components: {
      safePlanArticle
    },
    data() {
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
            this.pnRainData=[]
          } else {
            that.currentPoint = n[0].pnId.toString()
            that.monitorPnDataRain(n[0].pnId)
          }
        },
        immediate: true
      }
    },
    mounted() {
      //  this.getMonitorConditionRain()
    },
    methods: {
      handlePnPoint(value) {
        this.pnId = value.toString()
        this.monitorPnDataRain(value)
        console.log('选中监测点', value)
      },
      getMonitorConditionRain() {
        if(!this.hiddenId){
          return false
        }
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
      monitorPnDataRain(pnId) {
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
  .overviewT {
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

  .stateMsg {
    margin-top: 1rem;
  }

  .dataBox {
    padding: 1rem 0;
  }

  .data_tit {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .dataVBox {
    width: 100%;
    margin-top: 1rem;
    height: 20.8rem;
    overflow: auto;

  }

  .dataV {
    width: 28%;
    padding: 8px;
    margin-bottom: 1rem;
    cursor: default;
    white-space: nowrap;
    border: 1px solid rgba(141, 199, 252, .6);
    border-radius: 6px;
  }

  .empty {
    width: 28%;
    padding: 8px;
  }

  .dataV div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cricle {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: #3FCAAF;
  }

</style>
