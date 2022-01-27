<template>
  <!-- 水情概况 -->
  <div style="width: 100%;">
    <a-card :bodyStyle="{ padding: '10px' }">
      <div class="safetyPlan">
        <div class="card">
          <img src="static/img/control/雨情简报.png"/>
          <span>雨情概况</span>
        </div>
        <a-button @click="safeVisible=true"> 安全管理预案
          <a-icon type="read" style="fontSize:1.6rem" />
        </a-button>
      </div>
      <div class="overview-top">
        <div class="overview-top-hidden">
          <div style="font-size: 1.6rem;font-weight: 400;display: flex;justify-content: flex-start;align-items: center;"><div style="width: 4px;height: 15px;background: #1890FF;margin-right:1rem;"></div><span style="color:#191E2A;">{{overViewData.hiddenName}}</span></div>
          <div>测站编码:<span style="color:#191E2A;">{{ overViewData.stationCode}}</span></div>
          <div>建设时间:<span style="color:#191E2A;">{{ overViewData.createTime}}</span></div>
          <div>联系人员:<span style="color:#191E2A;">{{ overViewData.hiddenCharge || '无'}}</span></div>
        </div>
        <div class="overview-top-warn" style=" margin-right:1.9rem;">
          <img src="static/img/control/组127.png"/>
          <div>
            <div style="font-size: 2.4rem;color: #1890FF;">{{overViewData.waterState || '无'}}</div>
            <div class="warn-label">降水状态</div>
          </div>
        </div>
        <div class="overview-top-warn">
          <img src="static/img/control/组126.png"/>
          <div>
            <div :style="{ color: getText(overViewData.reservoirStatus).color,fontSize: '24px' }">{{ getText(overViewData.reservoirStatus).name }}</div>
            <div class="warn-label">安全状态</div>
          </div>
        </div>
      </div>
      <div style="width: 100%; padding: 5px">
        <div class="dataBox">
          <div class="data_tit">
            <div>
              <span>当前</span>
              <a-select v-model="currentPoint" :style="{width:'20rem'}" @change="handlePnPoint">
                <a-select-option v-for="pn in pnList" :key="pn.pnId.toString()">{{pn.pnName}}</a-select-option>
              </a-select>
            </div>
            <div>
              <a-button type="primary" size="small" @click="putReqrtd">召测</a-button>
              <a-button type="primary" size="small" @click="collectVisible=true">加密采集</a-button>
            </div>
          </div>
          <div class="dataVBox">
            <div v-if="pnRainData.length === 0">
              无数据
            </div>
            <div class="dataV" v-for="(v,i) in pnRainData" :key="i">
              <div>
                <span style="color:#191E2A;font-size:1.6rem;">{{v.target}}{{v.unit?'('+v.unit+')':''}}</span>
                <span class="cricle"
                      :style="{background:v.level==4?'#FF2626':v.level==3?'#FF9F00':v.level==2?'#F9D044':v.level==1?'#3399FF':'#3FCAAF'}"></span>
              </div>
              <div>
                <span
                  :style="{color:v.level==4?'#FF2626':v.level==3?'#FF9F00':v.level==2?'#F9D044':v.level==1?'#3399FF':'#3FCAAF',fontSize:'2.2rem'}">{{v.value}}</span>
              </div>
              <div style="color:#696969;font-size:1.4rem;">{{v.time}}</div>
            </div>
            <!--<div class="dataV" v-else v-for="(pnRain,index) in pnRainData" :key="index">
              <div>
                <span>{{pnRain.target}}</span>
                <span class="cricle"></span>
              </div>
              <div>
                <span style="color:#1a94ff;">{{pnRain.value}}</span>
                <span>{{pnRain.time}}</span>
              </div>
            </div>-->
          </div>
        </div>
      </div>
    </a-card>
    <!-- 加密采集 -->
    <a-modal v-model="collectVisible" title="加密采集" :confirm-loading="confirmLoading" @ok="handleOk"
             @cancel="collectVisible=false">
      <a-form :form="form">
        <a-form-item label="加密监测时长" :label-col="{ span: 6 }" :wrapper-col="{ span:  16}">
          <div style="display:flex;align-items: center;">
            <a-input v-decorator="['timeLong', { rules: [{ required: true, message: '请输入' }] }]" />
            <span style="margin-left:5px">h</span>
          </div>
        </a-form-item>
        <a-form-item label="数据采集周期" :label-col="{ span: 6 }" :wrapper-col="{ span:  16}">
          <div style="display:flex;align-items: center;">
            <a-input v-decorator="['cycle', { rules: [{ required: true, message: '请输入' }] }]" />
            <span style="margin-left:5px">s</span>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 安全管理预案 -->
    <safePlanArticle :safeVisible="safeVisible" :reserveType="15" @onClose="()=>{safeVisible=false}" />
  </div>
</template>

<script>
import safePlanArticle from '@/components/safePlanArticle/safePlanArticle.vue'
import { getText } from '@/utils/utils'
export default {
  props: {
    pnList: {
      type: Array,
      default: () => {
        return []
      }
    },
    overViewData: {
      type: Object,
      default: () => {}
    },
    hiddenId: {
      type: Number,
      default: -1
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
      safetyName: '',
      confirmLoading: false,
      form: this.$form.createForm(this, {
        name: 'rainMonitor'
      }),
      collectVisible: false
    }
  },
  watch: {
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
  },
  methods: {
    getText (str) {
      return getText(str)
    },
    handlePnPoint (value) {
      this.pnId = value.toString()
      this.monitorPnDataRain(value)
      console.log('选中监测点', value)
    },
    // 获取当前监测点列表信息
    monitorPnDataRain (pnId) {
      let _this = this
      this.$get('web/monitorScene/monitorPnDataRain', {
        pnId: pnId
      }).then((res) => {
        if (res.data.code === 1) {
          let data = res.data.data
          for (let i = 0; i < data.length; i++) {
            data[i].time = data[i].time.substring(5, 16)
          }
          _this.pnRainData = data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 加密采集
    handleOk () {
      this.confirmLoading = true
      const form = this.form
      form.validateFields((err, values) => {
        if (err) {
          this.confirmLoading = false
          return
        }
        console.log('form 表单内容: ', values)
        form.resetFields()
        this.collectVisible = false
        this.confirmLoading = false
      })
    },
    // 召测（立即采集）
    putReqrtd () {
      if (!this.currentPoint) {
        this.$message.error('未选择监测点')
        return
      }
      this.$get('/web/monitorScene/reqrtd?pnId=' + this.currentPoint).then(res => {
        let rr = res.data
        if (rr.code != 1) {
          this.$message.error(rr.msg)
          return
        }
        this.$message.success('采集成功')
      })
    }
  }
}

</script>
<style lang="less" scoped>
  .overview-top {
    display: flex;
    padding-top:2rem;
    .overview-top-hidden {
      flex: 1;
      color:#5D6574;
      padding:1rem;
      font-size: 1.4rem;
      background: #FFFFFF;
      box-shadow: 1px 0px 18px 0px rgba(172, 200, 219, 0.3);
      border-radius: 8px;
      margin-right:1.9rem;
      div{
        line-height: 2;
      }
    }
    .overview-top-warn {
      flex: 1;
      width: 240px;
      height: 132px;
      background: #F7F8FD;
      opacity: 0.7;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        margin-right:3rem;
      }
      .warn-label{
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #5D6574;
        margin-top:0.5rem;
      }
    }
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
    padding:2rem 0rem;
    border-bottom:1px solid rgba(24, 144, 255, 0.2);
  }
.dataVBox{
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin-top: 2rem;
  overflow: auto;
  height: 12.8rem;
}
  .dataV{
    width: 24%;
    padding: 10px;
    margin-bottom: 1rem;
    cursor: default;
    white-space: nowrap;
    border: 1px solid rgba(141, 199, 252, .6);
    border-radius: 6px;
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
