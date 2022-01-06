<template>
<div>
  <a-modal
    title="密码修改"
    :keyboard="false"
    :maskClosable="false"
    :closable="false"
    v-model="show"
    @cancel="cancelUpdatePassword"
    @ok="handleUpdatePassword">
    <a-form :autoFormCreate="(form)=>{this.form = form}">
      <a-form-item
        label='新密码'
        v-bind="formItemLayout"
        fieldDecoratorId="password"
        :fieldDecoratorOptions="{rules: [{required: true},{pattern: /^[0-9a-zA-Z_]{6,}$/, message: '密码不能少于6位,包含数字、字母、下划线'}]}">
        <a-input type="password"
                 v-model="newPassword"
                 autocomplete="false"
                 placeholder="至少6位密码"></a-input>
      </a-form-item>
      <a-form-item
        label='再次确认'
        v-bind="formItemLayout"
        fieldDecoratorId="password2"
        :fieldDecoratorOptions="{rules: [{ required: true},{pattern: /^[0-9a-zA-Z_]{6,}$/, message: '密码不能少于6位,包含数字、字母、下划线'},{ validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}">
        <a-input type="password" autocomplete="false" placeholder="确认密码"></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</div>
</template>
<script>
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
}
export default {
  props: {
    updatePasswordModelVisible: {
      default: false
    },
    user: {
      required: true
    }
  },
  data () {
    return {
      form: null,
      formItemLayout,
      oldPassword: '',
      newPassword: '',
      validateStatus: '',
      help: ''
    }
  },
  computed: {
    show: {
      get: function () {
        return this.updatePasswordModelVisible
      },
      set: function () {
      }
    }
  },
  methods: {
    isMobile () {
      return this.$store.state.setting.isMobile
    },
    cancelUpdatePassword () {
      this.form.resetFields()
      this.$emit('cancel')
    },
    handleUpdatePassword () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$post('web/user/resetPwd', {
            password: this.newPassword,
            userId: this.user.userId
          }).then((r) => {
            if (r.data.code === 1) {
              this.$emit('success')
              this.form.resetFields()
            } else {
              this.$message.error(r.data.msg)
            }
          })
        }
      })
    },
    handlePasswordCheck (rule, value, callback) {
      let password = this.form.getFieldValue('password')
      if (value === undefined) {
        callback(new Error('请输入密码'))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    }
  }
}
</script>
<style lang="less">
</style>
