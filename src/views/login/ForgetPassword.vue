<template>
    <div class="forgetModel">
      <a-modal
        :visible="visible"
        title='忘记密码'
        :maskClosable="maskClosable"
        okText='确定'
        @cancel="() => { $emit('cancel') }"
        @ok="handleSubmit"
      >
      <a-form :form="form">
        <a-form-item v-bind="formItemLayout" label="电话号码">
          <a-input
            v-model="phone"
            v-decorator="[
          'phone',
          {
            rules: [{ required: true, message: '请输入手机号码!', whitespace: true },{validator:phoneCheck.bind(this)}],
          },
        ]"
            style="width: 100%"
          >
            <a-select
              slot="addonBefore"
              v-decorator="['prefix', { initialValue: '86' }]"
              style="width: 70px"
            >
              <a-select-option value="86">
                +86
              </a-select-option>
              <a-select-option value="87">
                +87
              </a-select-option>
            </a-select>
          </a-input>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="新密码" has-feedback>
          <a-input
            v-decorator="[
          'password',
          {
            rules: [
              {
                required: true,
                message: '请输入新密码!',
              },
              {
                validator: validateToNextPassword,
              },
            ],
          },
        ]"
            type="password"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="再次输入密码" has-feedback>
          <a-input
            v-decorator="[
          'confirm',
          {
            rules: [
              {
                required: true,
                message: '请再次输入密码!',
              },
              {
                validator: compareToFirstPassword,
              },
            ],
          },
        ]"
            type="password"
            @blur="handleConfirmBlur"
          />
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          label="验证码"
        >
          <a-row :gutter="8">
            <a-col :span="12">
              <a-input
                v-decorator="[
              'captcha',
              { rules: [{ required: true, message: '请输入验证码!' }] },
            ]"
              />
            </a-col>
            <a-col :span="12">
              <a-button :disabled="disabled" @click="sendCode()">{{btnText}}</a-button>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
      </a-modal>
    </div>
</template>

<script>
export default {
  name: 'forget-password',
  data () {
    return {
      confirmDirty: false,
      disabled: false,
      btnText: '获取验证码',
      time: 60,
      maskClosable: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      phone: ''
    }
  },
  props: ['visible'],
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'register' })
  },
  beforeUpdate () {
    /* this.form.resetFields() */
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
        let paramObj = this.form.getFieldsValue()
        let params = {
          mobile: paramObj.phone,
          password: paramObj.password,
          value: paramObj.captcha
        }
        this.$post('web/webUserController/webUserUpdatePs', {
          ...params
        }).then((r) => {
          if (r.data.code === 1) {
            this.$message.success('密码更新成功')
            this.$emit('cancel')
          } else {
            this.$message.success('密码更新失败')
          }
        })
      })
    },
    // 校验手机号格式
    phoneCheck (rule, value, callbackFn) {
      const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (!reg.test(value)) {
        callbackFn('请输入正确的手机号码')
        return
      }
      callbackFn()
    },
    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    compareToFirstPassword (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback('两次输入的密码不一致!')
      } else {
        callback()
      }
    },
    validateToNextPassword (rule, value, callback) {
      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
    },
    // 发送验证码
    sendCode () {
      let params = {
        mobile: this.phone
      }
      // this.$post('web/webUserController/forgetPassword', {
      this.$post('web/login/send', {
        ...params
      }).then((r) => {
        if (r.data.code === 1) {
          this.timer()
          this.$message.success('验证码发送成功')
        } else {
          this.$message.success('验证码发送失败')
        }
      })
    },
    timer () {
      if (this.time > 0) {
        this.time--
        this.btnText = this.time + 's后重新获取'
        setTimeout(this.timer, 1000)
      } else {
        this.time = 60
        this.btnText = '获取验证码'
        this.disabled = false
      }
    }
  }
}
</script>

<style scoped>
  .forgetModel{
    padding-right:20%;
  }
</style>
