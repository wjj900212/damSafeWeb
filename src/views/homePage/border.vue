<template>
  <!-- 首页显示组件的边框 -->
  <div class="borderCom">
    <div class="titBox" v-if="typeof(titTxt)=='string'">
      <div class="tit">
        <img src="/static/img/u22.svg" alt="" class="bg">
        <span>{{titTxt}}</span>
      </div>
    </div>
    <div class="titBox" v-else>
      <div v-for="v,i in titTxt" :key='i' :class="i==0?'tit':'tit2'" @click="$emit('toggle',i)">
        <img v-if="i==0" src="/static/img/u22.svg" alt="" class="bg">
        <img v-else src="/static/img/u214.svg" alt="" class="bg">
        <span>{{v}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ["titTxt"],
    data() {
      return {

      };
    },
    methods: {},
  }

</script>
<style scoped>
  /* @import url(); 引入公共css类 */
  .borderCom {
    position: absolute;
    width: 100%;
    height: 100%;
    background: url('/static/img/u673.svg') no-repeat 100% 100%;
    background-size: 100% 100%;
  }

  .titBox {
    width: 100%;
    position: absolute;
    top: -14px;
  }

  .tit,
  .tit2 {
    float: left;
    text-align: center;
    color: #00FFFF;
    font-size: 1.6rem;
    position: relative;
    width: 172px;
    white-space: nowrap;
    cursor: pointer;
  }

  .tit2 {
    margin-left: -25px;
  }

  .tit span,
  .tit2 span {
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
  }

</style>
