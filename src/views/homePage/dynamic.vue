<template>
  <!-- 实时动态 -->
  <div class="dynamic">
    <borderCom titTxt="实时动态" />
    <div class="dynamicArr">
      <template v-for="(v,i) in dynamicArr">
        <div class="item" :key="i">
          <div class="item_tit">
            <span class="cricle"></span>
            <span class="i_txt">{{v.title}}</span>
            <span class="i_time">{{v.time}}</span>
          </div>
          <div class="desc">{{v.content}}</div>
        </div>
      </template>
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
          dynamicArr:[]
      };
    },
    methods: {
      getData() {
        this.$get("/web/onePicture/RealTimeDynamic").then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return false
          }
          this.dynamicArr=rr.data

        })
      }
    },
    mounted(){
        this.getData()
    }
  }

</script>
<style scoped>
  .item {
    width: 100%;
  }

  .item_tit {
    display: flex;
  }

  .i_txt {
    margin-right: 2rem;
  }

  .desc {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .dynamic {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .dynamicArr {
    padding: 1rem;
    margin-top: 2.8rem;
    color: #fff;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    max-height: calc(100% - 3.5rem);
    overflow: auto;
    position: relative;
    z-index: 2;
  }

</style>
