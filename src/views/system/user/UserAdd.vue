<template>
  <a-drawer
    title="添加用户"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="userAddVisiable"
    style="height: 100%;overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='姓名'
                   v-bind="formItemLayout"
                   :validateStatus="validateStatus"
                   :help="help">
        <a-input v-model="user.userName"
                 v-decorator="['userName',{rules: [{ required: true, message: '用户名不能为空'}]}]"/>
      </a-form-item>
      <a-form-item label="手机号" v-bind="formItemLayout">
        <a-input
          v-model="user.mobile"
          v-decorator="['mobile', {rules: [
            {required: true, pattern: '^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$', message: '请输入正确的手机号'}
          ]}]"/>
      </a-form-item>
      <a-form-item label='密码' v-bind="formItemLayout">
        <a-tooltip title='新用户默认密码为 手机号后6位'>
          <a-input type='password'  v-model="user.password" v-decorator="['password', validatorRules.password]" />
        </a-tooltip>
      </a-form-item>
      <a-form-item label='角色' v-bind="formItemLayout">
        <a-select
          :allowClear="true"
          v-model="user.roleId"
          style="width: 100%"
          v-decorator="['roleId',{rules: [{ required: true, message: '请选择角色' }]}]">
          <a-select-option v-for="r in roleData" :key="r.roleId">{{r.roleName}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-if="user.roleId !== 601" label='水库权限' v-bind="formItemLayout">
        <a-select
          mode="multiple"
          :allowClear="true"
          v-model="user.reservoirIds"
          style="width: 100%"
          v-decorator="['reservoirIds']">
          <a-select-option v-for="r in reservoirData" :key="r.reservoirId">{{r.reservoirName}}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
      <div class="drawer-bootom-button">
        <a-button @click="onClose" type="primary">取消</a-button>
        <a-button @click="handleSubmit" type="primary" :loading="loading">提交</a-button>
      </div>
  </a-drawer>
</template>
<script>
import { mapState } from 'vuex'

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 }
}
export default {
  name: 'UserAdd',
  props: {
    userAddVisiable: {
      default: false
    }
  },
  data () {
    return {
      user: {},
      loading: false,
      formItemLayout,
      defaultPassword: '',
      form: this.$form.createForm(this),
      validateStatus: 'success',
      help: '',
      roleData: [],
      reservoirData: [],
      validatorRules: {
        password: {
          initialValue: '',
          rules: [
            {message: '请输入密码'},
            {pattern: /^[0-9a-zA-Z_]{6,}$/, message: '密码不能少于6位,包含数字、字母、下划线'}
          ]
        }
      }
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.account.user
    })
  },
  methods: {
    reset () {
      this.user = {}
      this.help = ''
      this.loading = false
      this.form.resetFields()
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    // 角色列表
    getRoleList () {
      this.$get('web/user/getRoleList').then((r) => {
        this.roleData = r.data.data
      })
    },
    // 水库列表
    getReservoirList () {
      this.$get('web/hidden/getReservoirList').then((r) => {
        this.reservoirData = r.data.data
      })
    },
    handleSubmit () {
      /* if (this.validateStatus !== 'success') {
        this.handleUserNameBlur()
      } */
      this.form.validateFields((err, values) => {
        if (!err && this.validateStatus === 'success') {
          this.loading = true
          if (this.user.reservoirIds !== undefined) {
            this.user.reservoirIds = this.user.reservoirIds.join(',')
          }
          this.$post('web/user/addUser', {
            ...this.user
          }).then((r) => {
            if (r.data.code === 1) {
              this.reset()
              this.$emit('success')
            } else {
              this.$message.error(r.data.msg)
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    handleUserNameBlur () {
      let username = this.user.username.trim()
      if (username.length) {
        if (username.length > 10) {
          this.validateStatus = 'error'
          this.help = '用户名不能超过10个字符'
        } else if (username.length < 2) {
          this.validateStatus = 'error'
          this.help = '用户名不能少于2个字符'
        } else {
          this.validateStatus = 'validating'
          this.$get(`server/user.php?action=usercheck&username=${username}`).then((r) => {
            if (r.data) {
              this.validateStatus = 'success'
              this.help = ''
            } else {
              this.validateStatus = 'error'
              this.help = '抱歉，该用户名已存在'
            }
          })
        }
      } else {
        this.validateStatus = 'error'
        this.help = '用户名不能为空'
      }
    }
  },
  watch: {
    userAddVisiable (newVal) {
      if (newVal) {
        this.getRoleList()
        this.getReservoirList()
      }
    }
  }
}
</script>
