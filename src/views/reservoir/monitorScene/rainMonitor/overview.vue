<template>
  <!-- 水情概况 -->
  <div class="overview">
    <a-card title="雨情概况" style="width: 100%">
      <!--<a slot="extra" href="#">安全管理预案</a>-->
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
              <div>所在位置</div>
              <div style="font-size:1.8rem;color:#1a94ff;">{{overViewData.waterState || '无'}}</div>
            </div>
          </div>
          <div class="s_right">
            <div>安全状态</div>
            <div :style="{ color: safetyColor }">{{ safetyName }}</div>
          </div>
        </div>
      </a-card-grid>
      <a-card-grid style="width: 100%; padding: 5px">
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
         // that.monitorPnDataRain(n[0].pnId)
        }
      },
      immediate: true
    }
  },
  mounted () {
  },
  methods: {
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
          _this.pnRainData = res.data.data
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
