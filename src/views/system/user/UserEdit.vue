<template>
  <a-drawer
    title="修改用户"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="userEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='姓名' v-bind="formItemLayout">
        <a-input v-decorator="['userName',{rules: [{ required: true, message: '用户名不能为空'}]}]"/>
      </a-form-item>
      <a-form-item label="手机" v-bind="formItemLayout">
        <a-input
          v-decorator="['mobile', {rules: [
            {required: true, pattern: '^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$', message: '请输入正确的手机号'}
          ]}]"/>
      </a-form-item>
      <a-form-item label='角色' v-bind="formItemLayout">
        <a-select
          :allowClear="true"
          style="width: 100%"
          v-decorator="[
            'roleId',
            {rules: [{ required: true, message: '请选择角色' }]}
          ]">
          <a-select-option v-for="r in roleData" :key="r.roleId.toString()">{{r.roleName}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label='水库权限' v-bind="formItemLayout">
        <a-select
          mode="multiple"
          :allowClear="true"
          style="width: 100%"
          v-decorator="['reservoirIds']">
          <a-select-option v-for="r in reservoirData" :key="r.reservoirId.toString()">{{r.reservoirName}}</a-select-option>
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
import {mapState, mapMutations} from 'vuex'

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 }
}
export default {
  name: 'UserEdit',
  props: {
    userEditVisiable: {
      default: false
    }
  },
  data () {
    return {
      formItemLayout,
      form: this.$form.createForm(this),
      userId: '',
      loading: false,
      validateStatus: '',
      roleData: [],
      reservoirData: []
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.account.user
    })
  },
  methods: {
    ...mapMutations({
      setUser: 'account/setUser'
    }),
    onClose () {
      this.loading = false
      this.form.resetFields()
      this.$emit('close')
    },
    setFormValues ({...user}) {
      this.userId = user.userId
      let fields = ['userName', 'mobile', 'roleId', 'reservoirIds']
      Object.keys(user).forEach((key) => {
        if (fields.indexOf(key) !== -1) {
          this.form.getFieldDecorator(key)
          let obj = {}
          obj[key] = user[key]
          this.form.setFieldsValue(obj)
        }
      })
      if (user.reservoirId) {
        this.form.getFieldDecorator('reservoirIds')
        let reservoirIdArr = user.reservoirId.split(',')
        this.form.setFieldsValue({'reservoirIds': reservoirIdArr})
      }
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
      this.form.validateFields((err, values) => {
        console.log(!err)
        if (!err) {
          this.loading = true
          let user = this.form.getFieldsValue()
          user.userId = this.userId
          user.reservoirIds = user.reservoirIds.join(',')
          this.$post('web/user/editUser', {
            ...user
          }).then((r) => {
            if (r.data.code === 1) {
              this.onClose()
              this.$emit('success')
            } else {
              this.$message.error(r.data.msg)
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  },
  watch: {
    userEditVisiable (newVal) {
      if (newVal) {
        this.getRoleList()
        this.getReservoirList()
      }
    }
  }
}
</script>
