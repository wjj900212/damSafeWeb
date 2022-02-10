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
        <a-avatar shape="square" :size="115" icon="user" src="static/avatar/2dd7a2d09fa94bf8b5c52e5318868b4d9.jpg"/>
      </a-layout-sider>
      <a-layout-content class="user-content-one">
        <p><a-icon type="user"/>权限组：{{userInfoData.roleName}}</p>
        <p><a-icon type="skin"/>姓名：{{userInfoData.userName}}</p>
        <p><a-icon type="phone"/>手机号：{{userInfoData.mobile}}</p>
      </a-layout-content>
      <a-layout-content class="user-content-two">
        <p><a-icon type="home"/>单位：{{userInfoData.company}}</p>
        <p><a-icon type="user"/>水库权限：{{userInfoData.ReservoirName}}</p>
        <p><a-icon type="clock-circle"/>创建时间：{{userInfoData.creatTime}}</p>
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
