<template>
  <!-- 实时动态 -->
  <div class="dynamic">
    <borderCom titTxt="实时动态" />
    <div class="dynamicBox">
      <div class="dynamicArr">
        <template v-for="(v,i) in dynamicArr">
          <div class="item" :key="i">
            <div class="item_tit">
              <template v-if="v.flag==1">
                <img src="static/img/b.png" v-if="v.warnLevel==1">
                <img src="static/img/y.png" v-if="v.warnLevel==2">
                <img src="static/img/o.png" v-if="v.warnLevel==3">
                <img src="static/img/r.png" v-if="v.warnLevel==4">
              </template>
              <img src="static/img/w.png" v-else>
              <span class="i_txt"
                :style="{color:v.flag==1?v.warnLevel==1?'#188efc':v.warnLevel==2?'#ff9500':v.warnLevel==3?'#fbdb05':v.warnLevel==4?'#cd4b4d':'':'#2ABBB2'}">{{v.title}}</span>
              <span class="i_time">{{v.time}}</span>
            </div>
            <div class="desc">{{v.content}}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import borderCom from "./border.vue"
  export default {
    components: {
      borderCom
    },
    data() {
      return {
        dynamicArr: []
      };
    },
    methods: {
      getData() {
        this.$get("/web/onePicture/RealTimeDynamic?flag=0").then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return false
          }
          this.dynamicArr = rr.data
        })
      }
    },
    mounted() {
      this.getData()
    }
  }

</script>
<style scoped>
  .dynamic {
    width: calc(100% - 10px);
    height: 100%;
    position: absolute;
    margin: 0 5px;
  }

  .dynamicBox {
    width: 99%;
    margin: 0 auto;
    padding: 1.2rem;
    position: relative;
    z-index: 2;
    /* background: url('../../../static/img/model-bg.png') no-repeat;
    background-size: 100% 100%; */
    height: calc(100% - 5rem);
    background: rgba(13, 76, 145, 0.4);
    box-shadow: 0px 0px 10px 0px rgba(17, 40, 255, 0.66) inset;
    border-radius: 3px;
  }

  .dynamicArr {
    width: 100%;
    height: 100%;
    color: #fff;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    overflow: auto;
    font-size: 1.4rem;
  }

  .item {
    width: 100%;
    margin-bottom: 10px;
    cursor: default;
  }

  .item img {
    width: 15px;
    height: 15px;
    margin-right: 8px;
  }

  .item_tit {
    display: flex;
    align-items: center;
  }

  .i_txt {
    margin-right: 2rem;
    color: #2ABBB2;
  }

  .i_time {
    color: #90D0F6;
  }

  .desc {
    width: 100%;
    line-height: 3.5rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    background: url('../../../static/img/组188.png') no-repeat;
    background-size: 100%;
    background-position: bottom;
    text-indent: 23px;
  }

</style>
