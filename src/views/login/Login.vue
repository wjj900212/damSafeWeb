<template>
  <div class="login">
    <a-form @submit.prevent="doLogin" :autoFormCreate="(form) => this.form = form">
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
      <a-form-item>
        <a-form-item>
          <a-checkbox :checked="checked" @change="onRememberChange">记住密码</a-checkbox>
          <a class="login-form-forgot" @click="forgetPassword">
            忘记密码？
          </a>
        </a-form-item>
        <a-button :loading="loading" style="width: 100%; margin-top: 4px" size="large" htmlType="submit" type="primary">
          登录
        </a-button>
      </a-form-item>
    </a-form>
    <div>
      <forget-password
        ref="FP"
        :visible="isShowForgetPassword"
        @cancel="handleCancel"
      ></forget-password>
    </div>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
import moment from 'moment'
import ForgetPassword from './ForgetPassword'
// var LdapClient = require('node-ldap')
export default {
  name: 'Login',
  data () {
    return {
      loading: false,
      error: '',
      activeKey: '1',
      isShowForgetPassword: false,
      checked: false
    }
  },
  components: {
    ForgetPassword
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
  mounted () {
    this.getCookie()
  },
  methods: {
    moment,
    doLogin () {
      if (this.activeKey === '1') {
        // 用户名密码登录
        this.form.validateFields(['name', 'password'], (errors, values) => {
          if (!errors) {
            this.loading = true
            let name = this.form.getFieldValue('name')
            let password = this.form.getFieldValue('password')
            this.$post('web/login/login', {
              username: name,
              password: password
            }).then((r) => {
              console.log(r.data)
              if (r.data.code === 1) {
                let data = r.data.data
                let config = {
                  color: 'rgb(24, 144, 255)',
                  fixHeader: '1',
                  fixSiderbar: '1',
                  layout: 'side',
                  multiPage: '0',
                  theme: 'dark'
                }
                data.config = config
                this.saveLoginData(data)
                setTimeout(() => {
                  this.loading = false
                  console.log('跳转页面')
                  this.$router.push('/')
                }, 500)
                // this.$router.push('/')
                if (this.checked === true) {
                  // 传入账号名，密码，和保存天数3个参数
                  this.setCookie(this.form.getFieldValue('name'), this.form.getFieldValue('password'), 7)
                } else {
                  // console.log("清空Cookie");
                  // 清空Cookie
                  this.clearCookie()
                }
              } else {
                this.$message.warning(r.data.msg)
                this.$db.clear()
                this.loading = false
              }
            }).catch(() => {
              setTimeout(() => {
                this.loading = false
              }, 500)
            })
          }
        })
      }
      if (this.activeKey === '2') {
        // 手机验证码登录
        this.$message.warning('暂未开发')
      }
    },
    // 设置cookie
    setCookie (cname, cpwd, exdays) {
      var exdate = new Date() // 获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
      // 字符串拼接cookie
      window.document.cookie =
        'userName' + '=' + cname + ';path=/;expires=' + exdate.toGMTString()
      window.document.cookie =
        'userPwd' + '=' + cpwd + ';path=/;expires=' + exdate.toGMTString()
    },
    getCookie: function () {
      if (document.cookie.length > 0) {
        this.checked = true
        var arr = document.cookie.split('; ')
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('=') // 再次切割
          // 判断查找相对应的值
          if (arr2[0] === 'userName') {
            this.form.setFieldsValue({'name': arr2[1]})
          } else if (arr2[0] === 'userPwd') {
            this.form.setFieldsValue({'password': arr2[1]})
          }
        }
      }
    },
    // 清除cookie
    clearCookie: function () {
      this.setCookie('', '', -1) // 修改2值都为空，天数为负1天就好了
    },
    regist () {
      this.$emit('regist', 'Regist')
    },
    forgetPassword () {
      this.isShowForgetPassword = true
    },
    handleCancel (e) {
      this.isShowForgetPassword = false
      let form = this.$refs.FP.form
      form.resetFields()
    },
    onRememberChange (e) {
      this.checked = e.target.checked
      if (this.checked === false) {
        // 清空Cookie
        this.clearCookie()
      }
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
      setColor: 'setting/setColor',
      setReservoirList: 'account/setReservoirList',
      setReservoirId: 'account/setReservoirId',
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
      this.setReservoirList(data.reservoirList)
      this.setReservoirId(data.reservoirList[0].reservoirId)
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
  .ant-checkbox-wrapper{
    color:#c5f3ff !important;
  }
  .login-form-forgot{
    float: right !important;
  }
</style>
