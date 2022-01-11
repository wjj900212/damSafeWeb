<template>
  <!-- 气象数据 -->
  <div class="weather">
    <a-card title="气象数据">
      <a-card-grid style="width: 100%; text-align: center; padding: 5px">
        <div class="stateMsg">
          <div class="s_left">
            <div>
              <div>降水状态</div>
              <div style="font-size:1.8rem;color:#1a94ff;">小雨</div>
            </div>
          </div>
          <div class="s_center">
            <div>安全状态</div>
            <div style="font-size:1.8rem;color:#24C174;">正常</div>
          </div>
          <div class="s_right">
            <div>安全状态</div>
            <div style="font-size:1.8rem;color:#24C174;">正常</div>
          </div>
        </div>
      </a-card-grid>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'weather'
}
</script>

<style lang="less" scoped>
  .stateMsg {
    display: flex;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #f2f2f2;
    font-size: 1.4rem;
  }

  .s_left,
  .s_center,
  .s_right {
    flex: 1;
  }
  .s_center {
    border-right: 1px solid #f2f2f2;
    border-left: 1px solid #f2f2f2;
  }
</style>
