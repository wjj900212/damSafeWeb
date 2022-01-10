<template>
  <!-- 场景可视化 -->
  <div class="visual">
    <div class="tit">
      <span>场景可视化</span>
      <a-select v-model="current">
        <a-select-option value="jack">Jack (100)</a-select-option>
        <a-select-option value="lucy">Lucy (101)</a-select-option>
      </a-select>
    </div>
          <a-card-grid style="width: 100%; text-align: center">
            <img width="100%" src="static/img/u483.png" alt="" />
          </a-card-grid>
  </div>
</template>

<script>
  export default {
    props: ["pointId"],
    data() {
      return {
        current: 'jack'
      };
    },
    watch: {
      pointId: {
        handler: function (n, o) {
          console.log(n)
        },
        immediate: true
      }
    },
    methods: {},
  }

</script>
<style scoped>
  /* @import url(); 引入公共css类 */
  .tit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f2f2f2;
    padding-bottom: 1rem;
  }
  .tit>span{
    font-size: 1.6rem;
  }

</style>
