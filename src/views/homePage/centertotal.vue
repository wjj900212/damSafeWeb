<template>
  <!-- 中间内容 数量统计 -->
  <div class="centerTotal">
    <div>
      <div class="tit">水库</div>
      <div class="num numA">{{totalData.reservoirNum}}</div>
    </div>
    <div>
      <div class="tit">监测场景</div>
      <div class="num numA">{{totalData.sceneNum}}</div>
    </div>
    <div>
      <div class="tit">监测点</div>
      <div class="num numA">{{totalData.pnNum}}</div>
    </div>
    <div>
      <div class="tit">今日预警</div>
      <div class="num numB">{{totalData.warnNum}}</div>
    </div>
    <div>
      <div class="tit">运维人员</div>
      <div class="num numA">{{totalData.personNum}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        totalData: {}
      };
    },
    methods: {
      getData() {
        this.$get('/web/onePicture/statistics').then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return
          }
          this.totalData = rr.data
        })
      }
    },
    mounted() {
      this.getData()
    }
  }

</script>
<style scoped>
  /* @import url(); 引入公共css类 */
  .centerTotal {
<<<<<<< HEAD
    background: url('../../../static/img/shujuzhanshi_bg.png') no-repeat;
=======
    background: url('../../../static/img/数据展示-bg.png') no-repeat;
>>>>>>> 7d12fb222b103f49b407954bc9f90b41355cacb2
    background-size: 100% 100%;
    border-radius: 20px;
    line-height: 1;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    color: #fff;
  }

  .centerTotal>div {
    text-align: center;
  }
  .tit{
    margin-top: 2.8rem;
  }

  .num {
    font-size: 2.7rem;
    margin-top: 1rem;
    margin-bottom: 3rem;
  }

  .numB {
    color: #FF9500;
  }

</style>
