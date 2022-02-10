<template>
  <!-- 浸润线可视化 -->
  <div class="visual">
    <a-card :bodyStyle="{ padding: '10px' }">
      <div class="safetyPlan">
        <div class="card">
          <img src="static/img/数据可视化.png">
          <span>浸润线预警模型</span>
        </div>
        <div>
          <a href="JavaScript:;" style="margin-right:10px;">指标安全说明</a>
          <a-select v-model="sceneId" placeholder="选择断面" option-filter-prop="children" @change="sceneChange"
            style="width:180px">
            <a-select-option v-for="item in sceneList" :value="item.sceneId" :key="item.sceneId">
              {{ item.sceneName }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div style="width: 100%; text-align: center; padding: 5px">
        <div class="visWrap">
          <VueDragResize w="auto" h="auto" :isResizable="false">
            <canvas id="myCanvas" ref="canvas" @wheel.prevent="handleTableWheel($event)" width="765"
              height="398"></canvas>
          </VueDragResize>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
  import VueDragResize from "vue-drag-resize";
  var basicData, ratio = {
    w_ratio: 1,
    h_ratio: 1
  }
  export default {
    components: {
      VueDragResize
    },
    props: ['hiddenId', 'sceneList'],
    data() {
      return {
        sceneId: '',
        sceneArr: [],
        ctx: ''
      }
    },
    watch: {
      sceneList: {
        handler: function (n, o) {
          // this.getDesignConfig()
          if (!n || n.length <= 0) {
            this.sceneId = ''
            // 清空画布
            var c = document.getElementById("myCanvas");
            if (c) c.height = c.height;
          } else {
            this.sceneId = n[0].sceneId
            this.getSceneData()
          }
        },
        immediate: true
      }
    },
    mounted() {
      var c = document.getElementById("myCanvas");
      this.ctx = c.getContext("2d");
    },
    methods: {
      handleTableWheel(event) {
        let obj = this.$refs.canvas;
        // 一开始默认是100%
        let zoom = parseInt(obj.style.zoom, 10) || 100;
        // 滚轮滚一下wheelDelta的值增加或减少120
        zoom += event.wheelDelta / 12;
        if (zoom > 10) {
          obj.style.zoom = zoom + "%";
        }
        return false;
      },
      getSceneData() {
        let o = {
          hiddenId: this.hiddenId,
          sceneType: 1
        }
        this.$get('/web/hiddenScene/getHiddenConfigInfo', o).then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return
          }
          let data = rr.data
          let sceneArr = []
          data.forEach(v => {
            let scaleConfig = JSON.parse(v.scaleConfig)
            let obj = {
              bgImg: v.path,
              sceneId: v.sceneId,
              // y轴位置
              yConfig: {
                start: scaleConfig.yaxis,
                end: scaleConfig.yaxis + scaleConfig.scaleh,
                left: scaleConfig.xaxis
              },
              //起始刻度 及间隔
              mark: {
                begin: scaleConfig.startScale,
                end: scaleConfig.endScale,
                gap: scaleConfig.endScale - scaleConfig.startScale <= 10 ? 1 : scaleConfig.endScale -
                  scaleConfig.startScale > 50 ? 10 : 5
              },
              // 当前水位 标注 横向截止位置
              nowPos: {
                end: 300,
                value: ''
              },
              // 浸润线 坐标 及 值
              config: []
            }
            if (v.config && v.config.length > 0) {
              v.config.forEach(vv => {
                let item = {
                  xaxis: vv.xaxis,
                  yaxis: vv.yaxis,
                  value: '',
                  projPnId: vv.projPnId
                }
                obj.config.push(item)
              })
            }
            sceneArr.push(obj)
          })
          // console.log(sceneArr)
          this.sceneArr = sceneArr
          this.sceneChange()
        })
      },
      sceneChange() {
        basicData = this.sceneArr.find(v => {
          return this.sceneId == v.sceneId
        })
        this.$get("/web/hiddenScene/findSYData?sceneId=" + this.sceneId).then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$$message.error(rr.msg)
            return
          }
          basicData.nowPos.value = rr.data.meas
          rr.data.list.forEach(v => {
            let i = basicData.config.findIndex(vv => {
              return vv.projPnId == v.projPnId
            })
            basicData.config[i].value = v.value
          })
          this.loadImg()
        })
      },
      // 加载背景图片
      loadImg() {
        // console.log('basicData', basicData)
        let that = this
        var img = new Image();
        img.onload = function () {
          that.ctx.drawImage(img, 0, 0, 765, 398);
          that.drawYLine()
          that.drawYMark()
          that.drawNowPos()
          that.drawConfig()
        }
        // img.src = 'http://www.starfall.top/jiemiantu.png';
        img.src = basicData.bgImg
      },

      // 画 y 轴线
      drawYLine() {
        let l = basicData.yConfig.left * ratio.w_ratio
        let t = basicData.yConfig.end * ratio.h_ratio
        let b = basicData.yConfig.start * ratio.h_ratio
        this.ctx.beginPath();
        this.ctx.moveTo(l, t); //移动到y轴顶部
        this.ctx.lineTo(l, b); //y轴结束位置
        this.ctx.lineWidth = 2; //线条的宽度
        this.ctx.strokeStyle = "#ff0000"; //线条的颜色
        this.ctx.stroke();
        this.ctx.fill('evenodd');
      },

      // 画 y 轴刻度
      drawYMark() {
        let l = basicData.yConfig.left * ratio.w_ratio
        let t = basicData.yConfig.start * ratio.h_ratio
        let b = basicData.yConfig.end * ratio.h_ratio
        // console.log(t,b)
        let mark_num = ((basicData.mark.end - basicData.mark.begin) / basicData.mark.gap) + 1 //一共有多少个刻度
        // console.log(mark_num,t,b,(b-t)/5)
        let gap = (b - t) / (mark_num - 1) //所画每个刻度间隔
        for (var a = 0; a < mark_num; a++) {
          this.ctx.beginPath();
          this.ctx.moveTo(l, t + gap * a);
          this.ctx.lineTo(l + 6, t + gap * a);
          this.ctx.lineWidth = 2; //线条的宽度
          this.ctx.strokeStyle = "#ff0000"; //线条的颜色
          this.ctx.textBaseline = "middle";
          this.ctx.fillStyle = "#000";
          // console.log(basicData.mark.end - a * basicData.mark.gap, l + 9, t + gap * a)
          this.ctx.fillText(basicData.mark.end - a * basicData.mark.gap, l + 9, t + gap * a);
          this.ctx.stroke();
          this.ctx.fill('evenodd');
        }
      },

      // 各点浸润线
      drawConfig() {
        let tK = basicData.yConfig.start * ratio.h_ratio
        let bK = basicData.yConfig.end * ratio.h_ratio
        let mark_num = ((basicData.mark.end - basicData.mark.begin) / basicData.mark.gap) + 1 //一共有多少个刻度
        // console.log(mark_num,t,b,(b-t)/5)
        let gap = (bK - tK) / (mark_num - 1) //所画每个刻度间隔

        basicData.config.forEach(cv => {
          let s = cv.xaxis * ratio.w_ratio //某条浸润线的起点值
          let b = cv.yaxis * ratio.h_ratio
          // console.log('cv.value', cv.value)
          if (cv.value) {
            let val = (cv.value - basicData.mark.begin) / basicData.mark.gap * gap - (bK -
              b) //图中实际显示的高度
            // console.log('---', s, b, val)
            this.ctx.beginPath();
            this.ctx.moveTo(s, b);
            this.ctx.lineTo(s, b - val);
            this.ctx.fillStyle = "red";
            // console.log(cv.value, s, b - val - 5)
            this.ctx.fillText(cv.value, s, b - val - 5); //值
            this.ctx.lineWidth = 8; //线条的宽度
            this.ctx.strokeStyle = "#4395ff"; //线条的颜色
            this.ctx.stroke();
            this.ctx.fill('evenodd');
          }
        })
      },
      // 当前水位
      drawNowPos() {
        let start_x = basicData.yConfig.left * ratio.w_ratio
        let end_x = basicData.nowPos.end * ratio.w_ratio + start_x

        let tK = basicData.yConfig.start * ratio.h_ratio
        let bK = basicData.yConfig.end * ratio.h_ratio
        let mark_num = ((basicData.mark.end - basicData.mark.begin) / basicData.mark.gap) + 1 //一共有多少个刻度
        // console.log(mark_num,t,b,(b-t)/5)
        let gap = (bK - tK) / (mark_num - 1) //所画每个刻度间隔
        let y = bK - (basicData.nowPos.value - basicData.mark.begin) / basicData.mark.gap * gap
        // console.log('-------------------', start_x, end_x, y)
        this.ctx.beginPath();
        this.ctx.moveTo(start_x, y);
        this.ctx.lineTo(end_x, y);
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = "red";
        this.ctx.fillText(basicData.nowPos.value, end_x + 2, y); //值
        this.ctx.lineWidth = 3; //线条的宽度
        this.ctx.strokeStyle = "#4395ff"; //线条的颜色
        this.ctx.stroke();
        this.ctx.fill('evenodd');
      }
    }
  }

</script>
<style scoped>
  /* @import url(); 引入公共css类 */
  .visWrap {
    width: 765px;
    height: 398px;
    position: relative;
    overflow: hidden;
  }

</style>
