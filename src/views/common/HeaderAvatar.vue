<template>
  <div style="display: flex;justify-content: center;align-items: center;">
    <a-dropdown :trigger="['click']" @visibleChange="openProfile">
      <span style="cursor: pointer">
        <img v-if=" homeVisible === true" src="static/img/组178.png">
        <img v-else src="static/img/组 121.png">
        <span v-if=" homeVisible === true" class="curr-user-home">{{user.realName}}</span>
        <span v-else class="curr-user">{{user.realName}}</span>
      </span>
      <!-- <a-menu style="width: 150px" slot="overlay">
        <a-menu-item @click="openProfile">
          <a-icon type="user"/>
          <span>个人中心</span>
        </a-menu-item>
        <a-menu-divider></a-menu-divider>
        <a-menu-item @click="logout">
          <a-icon type="logout"/>
          <span>退出登录</span>
        </a-menu-item>
      </a-menu> -->
      <div class="userMsg" slot="overlay">
        <div class="logout"><img src="static/img/退出.png" alt="" @click="logout"></div>
        <div class="uA">
          <a-avatar :size="77" icon="user" src="static/avatar/2dd7a2d09fa94bf8b5c52e5318868b4d9.jpg" />
          <div class="uaMsg">
            <div style="margin-bottom:8px;"><span
                style="font-size:1.8rem;color:#000;margin-right:8px;">{{userInfo.userName}}</span><span>{{userInfo.mobile}}</span>
            </div>
            <div>{{userInfo.roleName}}</div>
          </div>
        </div>
        <div class="uB">
          <div><span class="cricle"></span><span>单&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;位：</span> {{userInfo.company}}
          </div>
          <div><span class="cricle"></span><span>水库权限：</span> <span
              style="width:250px;">{{userInfo.ReservoirName}}</span></div>
          <div><span class="cricle"></span><span>创建时间：</span> {{userInfo.creatTime}}</div>
        </div>
        <div>
        </div>
      </div>
    </a-dropdown>
    <!-- <user-info
      :userInfoVisiable="userInfoVisiable"
      :userInfoData="userInfo"
      @onClose="()=>{userInfoVisiable=false}"
    ></user-info> -->
  </div>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'
  import UpdatePassword from '../personal/UpdatePassword'
  import UserInfo from '../system/user/UserInfo'

  export default {
    name: 'HeaderAvatar',
    props: ['homeVisible'],
    components: {
      UpdatePassword,
      UserInfo
    },
    data() {
      return {
        updatePasswordModelVisible: false,
        userInfoVisiable: false,
        userInfo: {}
      }
    },
    computed: {
      ...mapState({
        settingBar: state => state.setting.settingBar.opened,
        user: state => state.account.user
      }),
      avatar() {
        return `static/avatar/${this.user.avatar}`
      }
    },
    methods: {
      handleSettingClick() {
        this.setSettingBar(!this.settingBar)
      },
      openProfile(visible) {
        if (visible) this.getPersonalInfo()
        // this.userInfoVisiable = true
        // this.$router.push('/profile')
      },
      getPersonalInfo() {
        this.$get('web/user/getPersonalInfo').then((r) => {
          this.userInfo = r.data.data
        })
      },
      updatePassword() {
        this.updatePasswordModelVisible = true
      },
      handleCancelUpdate() {
        this.updatePasswordModelVisible = false
      },
      handleUpdate() {
        this.updatePasswordModelVisible = false
        this.$message.success('更新密码成功，请重新登录系统')
        setTimeout(() => {
          this.logout()
        }, 1500)
      },
      logout() {
        this.$postDate(`web/login/logout/${this.user.id}`).then(() => {
          return new Promise((resolve, reject) => {
            this.$db.clear()
            location.reload()
          })
        }).catch(() => {
          this.$message.error('退出系统失败')
        })
      },
      ...mapMutations({
        setSettingBar: 'setting/setSettingBar'
      })
    }
  }

</script>

<style lang="less" scoped>
  .ant-avatar-sm {
    width: 30px;
    height: 30px;
  }

  .avatar {
    margin: 20px 4px 20px 0;
    color: #1890ff;
    background: hsla(0, 0%, 100%, .85);
    vertical-align: middle;
  }

  .curr-user-home {
    font-weight: 600;
    margin-left: 6px;
    color: #4CFFF8;
    background: linear-gradient(0deg, #59C8FF 0%, #FAFEFF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .curr-user {
    font-weight: 600;
    margin-left: 6px;
    color: #000000;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
  }

  .logout {
    margin: .5rem 0;
    text-align: right;

    img {
      cursor: pointer;
    }
  }

  .userMsg {
    width: 400px;
    margin-top: 25px;
    padding: 10px;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0px 3px 24px 0px rgba(160, 170, 199, 0.36);
  }

  .uA {
    display: flex;
    align-items: center;
    padding-bottom: 2rem;
    border-bottom: 1px dashed rgba(24, 144, 255, .6);
  }

  .uaMsg {
    margin-left: 2rem;
    font-size: 1.6rem;
    color: #5D6574;
    font-weight: bold;
  }

  .uB {
    padding: 2rem 2rem 0;
    color: #5D6574;
    font-size: 1.5rem;

    >div {
      margin-bottom: 8px;
      display: flex;
    }

    .cricle {
      background-color: rgba(24, 144, 255, 1);
      border-radius: 50%;
      width: 7px;
      height: 7px;
      margin-right: 8px;
      margin-top: 7px;
    }
  }

</style>
