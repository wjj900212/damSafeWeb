<template>
  <!-- 首页显示组件的边框 -->
  <div class="borderCom">
    <div class="titBox act" v-if="typeof(titTxt)=='string'">
      <span class="line"></span>
      <span class="tit">{{titTxt}}</span>
    </div>
    <template v-else>
      <div class="titWrap">
        <div class="titBox" v-for="v,i in titTxt" :key='i' @click="act=i;$emit('toggle',i)" :class="act==i?'act':''">
          <span class="line"></span>
          <span class="tit">{{v}}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    props: ["titTxt"],
    data() {
      return {
        act: 0
      };
    },
    methods: {},
  }

</script>
<style scoped>
  /* @import url(); 引入公共css类 */
  .borderCom {
    width: calc(100% - 10px);
    margin-top: 15px;
    margin-left: 10px;
    margin-bottom: 10px;
    /* height: 100%;
    position: absolute; */
  }

  .titWrap {
    display: flex;
  }

  .titBox {
    width: 100%;
    color: #fff;
    display: flex;
    align-items: center;
    font-size: 1.6rem;
    font-weight: bold;
  }

  .titWrap .titBox {
    width: 40%;
    cursor: pointer;
  }

  .line {
    width: 4px;
    height: 16px;
    display: inline-block;
    margin-right: 10px;
    background-color: #fff;
  }

  .titBox.act .line {
    background-color: #00CCFF;
  }

  .titBox.act .tit {
    background-image: -webkit-linear-gradient(top, #fff, #59C8FF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

</style>
