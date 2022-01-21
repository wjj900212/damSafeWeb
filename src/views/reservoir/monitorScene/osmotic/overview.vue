<template>
  <!-- 渗压监测概况 -->
  <div class="overview">
    <a-card title="渗压监测概况" style="width: 100%">
      <a href="JavaScript:;" slot="extra" @click="safeVisible=true">安全管理预案</a>
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
              <a-select v-model="current" :style="{width:'20rem'}" @change="handlePnPoint">
                <a-select-option v-for="pn,i in overViewData.pnList" :key="i" :value="pn.sceneId">{{pn.sceneName}}
                </a-select-option>
              </a-select>
            </div>

            <div class="dataVBox">
              <div v-if="pnTarData.length === 0">
                无数据
              </div>
              <div class="dataV" v-else v-for="(pnTar,index) in pnTarData" :key="index">
                <div>
                  <span style="font-size:1.4rem">{{pnTar.pnName}}</span>
                  <span class="cricle"></span>
                </div>
                <div>
                  <span style="font-size:1.4rem">{{pnTar.target | ellipsis(6)}}</span>
                  <span style="color:#1a94ff;">{{pnTar.value}}</span>
                </div>
                <div>
                  <span style="font-size:1.2rem">{{pnTar.time.substring(5,16)}}</span>
                </div>
              </div>
              <div class="empty"></div>
              <div class="empty"></div>
            </div>
          </div>
          <div class="s_right">
            <div>安全状态</div>
            <div v-if="overViewData.reservoirStatus==='0'" style="font-size:1.8rem;color:#24C174;">正常</div>
            <div v-if="overViewData.reservoirStatus==='1'" style="font-size:1.8rem;color:#ff9f00;">异常</div>
            <div v-if="overViewData.reservoirStatus==='2'" style="font-size:1.8rem;color:#ff2626;">险情</div>
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
          }else {
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
    font-size: 1.6rem;
  }

  .s_right {
    flex: 1;
    text-align: center;
  }

  .s_left {
    flex: 3;
    text-align: left;
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

  .dataVBox {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-wrap: wrap;
    margin-top: 1rem;
  }

  .dataV {
    width: 30%;
    padding: 8px;
    box-shadow: 2px 2px 15px rgba(76, 89, 248, 16%);
    margin-bottom: 1rem;
    cursor: default;
    white-space: nowrap;
  }

  .empty {
    width: 30%;
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
    background-color: #1a94ff;
  }

</style>
