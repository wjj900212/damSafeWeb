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

    <a-card-grid style="width: 100%; text-align: center; padding: 5px">
      <design :data="designData"></design>
    </a-card-grid>
  </div>
</template>

<script>
  import design from "../design/design.vue"
  export default {
    props: ["pointId"],
    components: {
      design
    },
    data() {
      return {
        current: 'jack',
        designData: [],
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
    margin-bottom: 1rem;
  }

  .tit>span {
    font-size: 1.6rem;
  }

</style>
