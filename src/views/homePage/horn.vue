<template>
  <div class="horn">
    <div class="lt"></div> <!-- 左上 -->
    <div class="lb"></div> <!-- 左下 -->
    <div class="rt"></div> <!-- 右上 -->
    <div class="rb"></div> <!-- 右下 -->
  </div>
</template>

<script>
  export default {
    data() {
      return {

      };
    },
    methods: {},
  }

</script>
<style scoped>
  .lt {
    width: 8px;
    height: 8px;
    position: absolute;
    border-top: 1px solid rgba(3, 92, 187, 0.8);
    border-left: 1px solid rgba(3, 92, 187, 0.8);
    top: 1px;
    left: 1px;
  }

  .lb {
    width: 8px;
    height: 8px;
    position: absolute;
    border-bottom: 1px solid rgba(3, 92, 187, 0.8);
    border-left: 1px solid rgba(3, 92, 187, 0.8);
    bottom: 1px;
    left: 1px;
  }

  .rt {
    width: 8px;
    height: 8px;
    position: absolute;
    border-top: 1px solid rgba(3, 92, 187, 0.8);
    border-right: 1px solid rgba(3, 92, 187, 0.8);
    top: 1px;
    right: 1px;
  }

  .rb {
    width: 8px;
    height: 8px;
    position: absolute;
    border-bottom: 1px solid rgba(3, 92, 187, 0.8);
    border-right: 1px solid rgba(3, 92, 187, 0.8);
    bottom: 1px;
    right: 1px;
  }

  .lt:after {
    content: '';
    width: 4px;
    height: 4px;
    background-color: rgba(1, 120, 241, 0.5);
    position: absolute;
  }

  .lb:after {
    content: '';
    width: 4px;
    height: 4px;
    background-color: rgba(1, 120, 241, 0.5);
    position: absolute;
    bottom: 0;
  }

  .rt:before {
    content: '';
    width: 4px;
    height: 4px;
    background-color: rgba(1, 120, 241, 0.5);
    position: absolute;
    right: 0;
  }

  .rb:before {
    content: '';
    width: 4px;
    height: 4px;
    background-color: rgba(1, 120, 241, 0.5);
    position: absolute;
    bottom: 0;
    right: 0;
  }

</style>
