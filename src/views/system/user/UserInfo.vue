<template>
  <a-modal
    v-model="show"
    :centered="true"
    :keyboard="false"
    :footer="null"
    :width="750"
    @cancel="handleCancleClick"
    title="用户信息">
    <a-layout class="user-info">
      <a-layout-sider class="user-info-side">
        <a-avatar shape="square" :size="115" icon="user" :src="`static/avatar/${userInfoData.avatar}`"/>
      </a-layout-sider>
      <a-layout-content class="user-content-one">
        <p><a-icon type="user"/>权限组：水库管理员</p>
        <p><a-icon type="skin"/>姓名：王伟</p>
        <p><a-icon type="phone"/>手机号：18810342996</p>
      </a-layout-content>
      <a-layout-content class="user-content-two">
        <p><a-icon type="home"/>单位：密云水库管理局</p>
        <p><a-icon type="user"/>水库权限：秘钥水库</p>
        <p><a-icon type="clock-circle"/>创建时间：2021-02-24 18:24:21</p>
      </a-layout-content>
    </a-layout>
  </a-modal>
</template>
<script>
export default {
  name: 'UserInfo',
  props: {
    userInfoVisiable: {
      require: true,
      default: false
    },
    userInfoData: {
      require: true
    }
  },
  computed: {
    show: {
      get: function () {
        return this.userInfoVisiable
      },
      set: function () {
      }
    }
  },
  methods: {
    handleCancleClick () {
      this.$emit('onClose')
    }
  }
}
</script>
<style lang="less" scoped>
@import "UserInfo";
</style>
