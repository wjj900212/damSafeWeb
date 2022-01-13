<template>
  <!-- 水情概况 -->
  <div class="overview">
    <div class="tit">
      <span>水情概况</span>
      <a-button @click="safeVisible=true"> 安全管理预案
        <a-icon type="read" style="fontSize:1.6rem" />
      </a-button>
    </div>
    <div class="basicMsg">
      <div class="basicTxt">
        <a-icon type="area-chart" style="fontSize:3rem;color:#1397db" />
        <div class="basic">
          <div class="subtit">水情监测</div>
          <div class="subTxt"><span>测站编码</span> {{hiddenMsg.stationCode}}</div>
          <div class="subTxt"><span>建设时间</span> {{hiddenMsg.createTime}}</div>
          <div class="subTxt"><span>联系人</span> {{hiddenMsg.hiddenCharge}}</div>
        </div>
      </div>
      <img src="static/img/u268.svg" alt="" />
    </div>
    <div class="stateMsg">
      <div class="s_left">
        <div>
          <div>库水位</div>
          <div style="font-size:1.8rem;color:#1a94ff;">{{hiddenMsg.waterState?hiddenMsg.waterState.waterLevel:''}}m
          </div>
        </div>
        <img src="static/img/u454.png" style="width:5rem;margin-left:1rem;">
        <!-- <div class="bili">
          <div class="bilivimg"></div>
          <div class="bliliv">50%</div>
        </div> -->

      </div>
      <div class="s_right">
        <div>安全状态</div>
        <!-- 0正常 1异常 2险情 -->
        <div v-if="hiddenMsg.reservoirStatus==='0'" style="font-size:1.8rem;color:#24C174;">正常</div>
        <div v-if="hiddenMsg.reservoirStatus==='1'" style="font-size:1.8rem;color:#ff9f00;">异常</div>
        <div v-if="hiddenMsg.reservoirStatus==='2'" style="font-size:1.8rem;color:#ff2626;">险情</div>
      </div>
    </div>
    <div class="dataBox">
      <div class="data_tit">
        <div>
          <span>当前</span>
          <a-select v-model="currentPoint" style="width:18rem" @change="pointChange">
            <a-select-option v-for="v in pnList" :key="v.pnId" :value="v.pnId">{{v.pnName}}</a-select-option>
          </a-select>
        </div>
        <div>
          <a-button type="primary" size="small" @click="putReqrtd">召测</a-button>
          <a-button type="primary" size="small" @click="collectVisible=true">加密采集</a-button>
        </div>
      </div>
      <div class="dataVBox">
        <div class="dataV" v-for="v,i in monitorPnData" :key="i">
          <div>
            <span>{{v.target}}{{v.unit?'('+v.unit+')':''}}</span>
            <span class="cricle"
              :style="{background:v.level==4?'#FF2626':v.level==3?'#FF9F00':v.level==2?'#F9D044':v.level==1?'#3399FF':'green'}"></span>
          </div>
          <div>
            <span
              :style="{color:v.level==4?'#FF2626':v.level==3?'#FF9F00':v.level==2?'#F9D044':v.level==1?'#3399FF':'green'}">{{v.value}}</span>
            <span>{{v.time}}</span>
          </div>
        </div>
        <div style="width:24%;"></div>
        <div style="width:24%;"></div>
        <!-- <div class="seemore">更多
          <a-icon type="double-right" />
        </div> -->
      </div>
    </div>
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
    <safePlanArticle :safeVisible="safeVisible" :reserveType="16" @onClose="()=>{safeVisible=false}"/>
  </div>
</template>

<script>
  import safePlanArticle from "../safePlanArticle/safePlanArticle.vue"
  export default {
    props: ["hiddenId", "hiddenMsg", "pnList"],
    components: {
      safePlanArticle
    },
    data() {
      return {
        currentPoint: '',
        monitorPnData: [],
        collectVisible: false,
        confirmLoading: false,
        form: this.$form.createForm(this, {
          name: 'coordinated'
        }),
        safeVisible:false
      };
    },
    watch: {
      // hiddenId: {
      //   handler: function (n, o) {},
      //   immediate: true
      // }
      pnList: {
        handler: function (n, o) {
          let that = this
          if (!n) return
          if (n.length > 0) {
            that.currentPoint = n[0].pnId
            that.pointChange()
          }
        },
        immediate: true
      }
    },
    methods: {
      pointChange() {
        this.monitorPnData = []
        if (!this.currentPoint) return
        this.$get("/web/monitorScene/monitorPnDataWater?pnId=" + this.currentPoint).then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return
          }
          this.monitorPnData = rr.data
        })
      },
      // 加密采集
      handleOk() {
        this.confirmLoading = true
        const form = this.form;
        form.validateFields((err, values) => {
          if (err) {
            this.confirmLoading = false
            return;
          }
          console.log('form 表单内容: ', values);
          form.resetFields();
          this.collectVisible = false
          this.confirmLoading = false
        });
      },
      // 召测（立即采集） 
      putReqrtd() {
        if (!this.currentPoint) {
          this.$message.error('未选择监测点')
          return
        }
        this.$get("/web/monitorScene/reqrtd?pnId=" + this.currentPoint).then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return
          }
          this.$message.success('采集成功')
        })
      }
    },
  }

</script>
<style scoped>
  .overview {
    /* padding: 1rem; */
    background-color: #fff;
    position: relative;
  }

  .tit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f2f2f2;
    padding-bottom: 1rem;
  }

  .tit>span {
    font-size: 1.6rem;
  }

  .basicMsg {
    display: flex;
    /* align-items: center; */
    justify-content: space-between;
    border-bottom: 1px solid #f2f2f2;
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
    align-items: center;
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
    display: flex;
    align-items: center;
    justify-content: center;
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
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-wrap: wrap;
    margin-top: 1rem;
    overflow: auto;
    height: 6.2rem;
  }

  .dataV {
    width: 24%;
    padding: 8px;
    box-shadow: 2px 2px 15px rgb(76 89 248 / 16%);
    margin-bottom: 1rem;
    cursor: default;
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
  }

  .seemore {
    margin-left: auto;
    cursor: pointer;
  }

</style>
