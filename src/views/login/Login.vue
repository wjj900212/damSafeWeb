<template>
  <div class="login">
    <a-form @submit.prevent="doLogin" :autoFormCreate="(form) => this.form = form">
      <a-tabs size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;" :activeKey="activeKey"
              @change="handleTabsChange">
        <a-tab-pane tab="账户密码登录" key="1">
          <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon
                   style="margin-bottom: 24px;"></a-alert>
          <a-form-item
            fieldDecoratorId="name"
            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入账户名', whitespace: true}]}">
            <a-input size="large">
              <a-icon slot="prefix" type="user"></a-icon>
            </a-input>
          </a-form-item>
          <a-form-item
            fieldDecoratorId="password"
            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入密码', whitespace: true}]}">
            <a-input size="large" type="password">
              <a-icon slot="prefix" type="lock"></a-icon>
            </a-input>
          </a-form-item>
        </a-tab-pane>
        <!--<a-tab-pane tab="手机号登录" key="2">
          <a-form-item>
            <a-input size="large">
              <a-icon slot="prefix" type="mobile"></a-icon>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-row :gutter="8" style="margin: 0 -4px">
              <a-col :span="16">
                <a-input size="large">
                  <a-icon slot="prefix" type="mail"></a-icon>
                </a-input>
              </a-col>
              <a-col :span="8" style="padding-left: 4px">
                <a-button style="width: 100%" class="captcha-button" size="large" @click="getCaptcha">获取验证码</a-button>
              </a-col>
            </a-row>
          </a-form-item>
        </a-tab-pane>-->
      </a-tabs>
      <a-form-item>
        <a-button :loading="loading" style="width: 100%; margin-top: 4px" size="large" htmlType="submit" type="primary">
          登录
        </a-button>
      </a-form-item>
      <!--<div>
        <a style="float: right" @click="regist">注册账户</a>
      </div>-->
    </a-form>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
// var LdapClient = require('node-ldap')
export default {
  name: 'Login',
  data () {
    return {
      loading: false,
      error: '',
      activeKey: '1'
    }
  },
  computed: {
    systemName () {
      return this.$store.state.setting.systemName
    },
    copyright () {
      return this.$store.state.setting.copyright
    }
  },
  created () {
    this.$db.clear()
    this.$router.options.routes = []
  },
  methods: {
    doLogin () {
      if (this.activeKey === '1') {
        // 用户名密码登录
        this.form.validateFields(['name', 'password'], (errors, values) => {
          if (!errors) {
            this.loading = true
            // let name = this.form.getFieldValue('name')
            // let password = this.form.getFieldValue('password')
            this.saveLoginData({
              token: '1.1640913844.1640917444.0734a1543e30c450e8164c903049fbd4',
              config: {
                color: 'rgb(24, 144, 255)',
                fixHeader: '1',
                fixSiderbar: '1',
                layout: 'side',
                multiPage: '0',
                theme: 'dark',
                userId: '1'
              },
              exipreTime: '20220122170918',
              roles: [],
              permissions: [],
              user: {
                avatar: '5997fedcc7bd4cffbd350b40d1b5b987.jpg',
                createTime: '2018-01-04 15:42:34',
                createUserId: '1',
                deptId: '2',
                deptName: '开发一部',
                description: '',
                email: 'mk123@hotmail.com',
                followPswd: '110',
                lastLoginTime: '2021-12-29 13:56:16',
                mobile: '13455533233',
                password: 'its a secret',
                realName: '管理员',
                roleId: '1',
                roleName: '平台管理员',
                ssex: '0',
                status: '1',
                type: ' ',
                userId: '1',
                username: 'mk'
              }
            })
            setTimeout(() => {
              this.loading = false
              this.$router.push('/')
            }, 500)
            // var client = new LdapClient({
            //     ldapUrl: 'ldap://192.168.70.4:389',
            //     userDn: 'CN=administrator,CN=Users,DC=peacemap,DC=com,DC=cn',
            //     password: 'peacemap_admin'
            // })
            //
            //
            //  // 用户认证
            // client.auth(name, password).then(function() {
            //     console.log('success')
            // }).catch(function(err) {
            //     console.error(err)
            // })
            // this.$post('warnWeb/login/login', {
            //   username: name,
            //   password: password
            // }).then((r) => {
            //   let data = r.data.data
            //   this.saveLoginData(data)
            //   setTimeout(() => {
            //     this.loading = false
            //   }, 500)
            //   this.$router.push('/')
            // }).catch(() => {
            //   setTimeout(() => {
            //     this.loading = false
            //   }, 500)
            // })
          }
        })
      }
      if (this.activeKey === '2') {
        // 手机验证码登录
        this.$message.warning('暂未开发')
      }
    },
    regist () {
      this.$emit('regist', 'Regist')
    },
    getCaptcha () {
      this.$message.warning('暂未开发')
    },
    handleTabsChange (val) {
      this.activeKey = val
    },
    ...mapMutations({
      setToken: 'account/setToken',
      setExpireTime: 'account/setExpireTime',
      setPermissions: 'account/setPermissions',
      setRoles: 'account/setRoles',
      setUser: 'account/setUser',
      setTheme: 'setting/setTheme',
      setLayout: 'setting/setLayout',
      setMultipage: 'setting/setMultipage',
      fixSiderbar: 'setting/fixSiderbar',
      fixHeader: 'setting/fixHeader',
      setColor: 'setting/setColor'
    }),
    saveLoginData (data) {
      this.setToken(data.token)
      this.setExpireTime(data.exipreTime)
      this.setUser(data.user)
      this.setPermissions(data.permissions)
      this.setRoles(data.roles)
      this.setTheme(data.config.theme)
      this.setLayout(data.config.layout)
      this.setMultipage(data.config.multiPage === '1')
      this.fixSiderbar(data.config.fixSiderbar === '1')
      this.fixHeader(data.config.fixHeader === '1')
      this.setColor(data.config.color)
    }
  }
}
</script>

<style lang="less" scoped>
  .login {
    .icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }
  }
</style>
