<template>
  <!-- 渗压监测概况 -->
  <div class="overviewOs">
    <a-card style="width: 100%">
      <template slot="title">
        <img src="/static/img/渗压监测概况.png">
        <span>渗压监测概况</span>
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
            <a-select v-model="current" :style="{width:'20rem'}" @change="handlePnPoint">
              <a-select-option v-for="pn,i in overViewData.pnList" :key="i" :value="pn.sceneId">{{pn.sceneName}}
              </a-select-option>
            </a-select>
          </div>
          <div class="dataVBox">
            <a-empty v-if="pnTarData.length === 0" />
            <div class="dataV" v-for="(pnTar,index) in pnTarData" :key="index">
              <div>
                <span style="font-size:1.4rem;color:#191E2A;">{{pnTar.pnName |  ellipsis(8)}}</span>
                <span class="cricle"></span>
              </div>
              <div>
                <span style="font-size:1.4rem;color:#191E2A;">{{pnTar.target | ellipsis(8)}}</span>
                <span style="color:#1890FF;font-size:2.2rem">{{pnTar.value}}</span>
              </div>
              <div>
                <span style="font-size:1.4rem;color:#696969;">{{pnTar.time.substring(5,16)}}</span>
              </div>
            </div>
            <div class="empty"></div>
            <div class="empty"></div>
          </div>
        </div>
      </a-card-grid>
    </a-card>
    <!-- 安全管理预案 -->
    <safePlanArticle :safeVisible="safeVisible" :reserveType="12" @onClose="()=>{safeVisible=false}" />
  </div>
</template>

<script>
  import safePlanArticle from "@/components/safePlanArticle/safePlanArticle.vue"
  export default {
    components: {
      safePlanArticle
    },
    props: ["hiddenId", "overViewData", "pnList"],
    data() {
      return {
        current: '',
        pnTarData: [],
        safeVisible: false
      }
    },
    watch: {
      //   hiddenId: {
      //     handler: function (n, o) {
      //       if (!n) return
      //       this.getMonitorCondition()
      //     },
      //     immediate: true
      //   },

      pnList: {
        handler: function (n, o) {
          let that = this
          if (!n || n.length == 0) {
            this.current = ''
            this.pnTarData = []
            return
          } else {
            that.current = n[0].sceneId
            that.monitorPnDataRain()
          }
        },
        immediate: true
      }
    },
    methods: {
      handlePnPoint(value) {
        this.monitorPnDataRain(value)
      },
      // 获取 横截面最新监测数据
      monitorPnDataRain() {
        let _this = this
        this.$get('/web/monitorScene/monitorScenePnData', {
          sceneId: this.current
        }).then((res) => {
          if (res.data.code === 1) {
            _this.pnTarData = res.data.data
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }
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
<style lang="less" scoped>
  .overviewOs {
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
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-wrap: wrap;
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
