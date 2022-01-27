<template>
  <!-- 水情概况 -->
  <div class="overviewWater">
    <a-card style="width: 100%">
      <template slot="title">
        <img src="/static/img/水情简报 (2).png">
        <span>水情概况</span>
      </template>
      <a href="JavaScript:;" slot="extra" @click="safeVisible=true">安全管理预案</a>
      <a-card-grid style="width: 100%; padding: 5px">
        <div class="basicMsg">
          <div class="basic">
            <div class="subtit"><span class="t_line"></span> 水情监测</div>
            <div class="subTxt"><span>测站编码：</span> {{hiddenMsg.stationCode}}</div>
            <div class="subTxt"><span>建设时间：</span> {{hiddenMsg.createTime?hiddenMsg.createTime.substring(0,10):''}}
            </div>
            <div class="subTxt"><span>联系人员：</span> {{hiddenMsg.hiddenCharge}}</div>
          </div>
          <div class="waterState">
            <div class="wsIcon">
              <img src="/static/img/组 1048.png">
              <span class="wsrate">{{hiddenMsg.waterState?hiddenMsg.waterState.percent:''}}</span>
            </div>
            <div class="wsVal">
              <div style="color:#1890FF;font-size:2.4rem;">{{hiddenMsg.waterState?hiddenMsg.waterState.waterLevel:''}}m
              </div>
              <div style="color:#5D6574;font-size:1.2rem;">库水位</div>
            </div>
          </div>
          <div class="reservoirStatus">
            <template v-if="hiddenMsg.reservoirStatus==='0'">
              <img src="/static/img/正常.png">
              <div>
                <div style="color:#3CC8AE;font-size:2.4rem;">正常</div>
                <div style="color:#5D6574;font-size:1.2rem;">安全状态</div>
              </div>
            </template>
            <template v-if="hiddenMsg.reservoirStatus==='1'">
              <img src="/static/img/异常.png">
              <div>
                <div style="color:#FF9809;font-size:2.4rem;">异常</div>
                <div style="color:#5D6574;font-size:1.2rem;">安全状态</div>
              </div>
            </template>
            <template v-if="hiddenMsg.reservoirStatus==='2'">
              <img src="/static/img/险情.png">
              <div>
                <div style="color:#FE5230;font-size:2.4rem;">险情</div>
                <div style="color:#5D6574;font-size:1.2rem;">安全状态</div>
              </div>
            </template>
          </div>
        </div>
      </a-card-grid>
      <a-card-grid style="width: 100%; padding: 5px">
        <div class="dataBox">
          <div class="data_tit">
            <div>
              <span>当前：</span>
              <a-select v-model="currentPoint" style="width:18rem" @change="pointChange">
                <a-select-option v-for="v in pnList" :key="v.pnId" :value="v.pnId">{{v.pnName}}</a-select-option>
              </a-select>
            </div>
            <div style="color:#fff;">
              <a-button type="primary" @click="putReqrtd">召测</a-button>
              <a-button type="primary" @click="collectVisible=true">加密采集</a-button>
            </div>
          </div>
          <div class="dataVBox">
            <div class="dataV" v-for="v,i in monitorPnData" :key="i">
              <div>
                <span style="color:#191E2A;font-size:1.6rem;">{{v.target}}{{v.unit?'('+v.unit+')':''}}</span>
                <span class="cricle"
                  :style="{background:v.level==4?'#FF2626':v.level==3?'#FF9F00':v.level==2?'#F9D044':v.level==1?'#3399FF':'#3FCAAF'}"></span>
              </div>
              <div>
                <span
                  :style="{color:v.level==4?'#FF2626':v.level==3?'#FF9F00':v.level==2?'#F9D044':v.level==1?'#3399FF':'#3FCAAF',fontSize:'2.2rem'}">{{v.value}}</span>
              </div>
              <div style="color:#696969;font-size:1.4rem;">{{v.time.substring(5,16)}}</div>
            </div>
            <div style="width:24%;"></div>
            <div style="width:24%;"></div>
            <div style="width:24%;"></div>
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
        <safePlanArticle :safeVisible="safeVisible" :reserveType="16" @onClose="()=>{safeVisible=false}" />
      </a-card-grid>
    </a-card>
  </div>
</template>

<script>
  import safePlanArticle from "@/components/safePlanArticle/safePlanArticle.vue"
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
        safeVisible: false
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
          if (!n || n.length == 0) {
            this.currentPoint = ''
            this.monitorPnData = []
            return
          } else {
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
  .overviewWater {
    /* padding: 1rem; */
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

  .waterState,
  .reservoirStatus {
    flex: 1;
    padding: 1.5rem;
    background-color: rgba(246, 250, 255, 1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .waterState {
    margin: 0 1.5rem;
  }

  .wsIcon {
    position: relative;
  }

  .wsrate {
    color: #616978;
    font-size: 1.452rem;
    position: absolute;
    top: 25px;
    left: 50%;
    transform: translateX(-50%);
  }

  .dataBox {
    padding: 1rem 0;
  }

  .data_tit {
    padding: 0 1.5rem;
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
    height: 18.8rem;
  }

  .dataV {
    width: 24%;
    padding: 10px;
    margin-bottom: 1rem;
    cursor: default;
    white-space: nowrap;
    border: 1px solid rgba(141, 199, 252, .6);
    border-radius: 6px;
  }

  .dataV div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cricle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

</style>
