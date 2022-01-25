<template>
  <!-- 中间内容 数量统计 -->
  <div class="centerTotal">
    <div>
      <p>水库</p>
      <p class="num numA">{{totalData.reservoirNum}}</p>
    </div>
    <div>
      <p>监测场景</p>
      <p class="num numA">{{totalData.sceneNum}}</p>
    </div>
    <div>
      <p>监测点</p>
      <p class="num numA">{{totalData.pnNum}}</p>
    </div>
    <div>
      <p>今日预警</p>
      <p class="num numB">{{totalData.warnNum}}</p>
    </div>
    <div>
      <p>运维人员</p>
      <p class="num numA">{{totalData.personNum}}</p>
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
    background-color: rgb(76, 116, 132, .8);
    border-radius: 20px;
    line-height: 1;
    font-size: 1.6rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #fff;
  }

  .centerTotal p:nth-child(1) {
    margin-top: 1.6rem;

  }

  .num {
    font-size: 2rem;
    font-weight: 500;
  }

  .numA {
    color: #00FFFF;
  }

  .numB {
    color: orange;
  }

</style>
