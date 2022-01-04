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
        <a-input readOnly v-decorator="['username']"/>
      </a-form-item>
      <a-form-item label="手机" v-bind="formItemLayout">
        <a-input
          v-decorator="['mobile', {rules: [
            { pattern: '^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$', message: '请输入正确的手机号'}
          ]}]"/>
      </a-form-item>
      <a-form-item label='角色' v-bind="formItemLayout">
        <a-select
          mode="multiple"
          :allowClear="true"
          style="width: 100%"
          v-decorator="[
            'roleId',
            {rules: [{ required: true, message: '请选择角色' }]}
          ]">
          <a-select-option v-for="r in roleData" :key="r.roleId.toString()">{{r.roleName}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label='职位' v-bind="formItemLayout">
        <a-tree-select
          :allowClear="true"
          :dropdownStyle="{ maxHeight: '220px', overflow: 'auto' }"
          :treeData="deptTreeData"
          @change="onDeptChange"
          v-model="userDept">
        </a-tree-select>
      </a-form-item>
      <a-form-item label='水库权限' v-bind="formItemLayout">
        <a-select
          mode="multiple"
          :allowClear="true"
          style="width: 100%"
          v-decorator="['proj']">
          <a-select-option v-for="r in projData" :key="r.key">{{r.value}}</a-select-option>
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
      deptTreeData: [],
      roleData: [],
      userDept: '',
      projData: [],
      userId: '',
      loading: false,
      validateStatus: ''
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
      let fields = ['username', 'email', 'status', 'ssex', 'mobile', 'realName', 'followPswd', 'description']
      Object.keys(user).forEach((key) => {
        if (fields.indexOf(key) !== -1) {
          this.form.getFieldDecorator(key)
          let obj = {}
          obj[key] = user[key]
          this.form.setFieldsValue(obj)
        }
      })
      if (user.roleId) {
        this.form.getFieldDecorator('roleId')
        let roleArr = user.roleId.split(',')
        this.form.setFieldsValue({'roleId': roleArr})
      }
      if (user.deptId) {
        this.userDept = user.deptId
      }
      // if (user.followProjId) {
      //   this.form.getFieldDecorator('projBasicId')
      //   let followProjIdArr = user.followProjId.split(',')
      //   this.form.setFieldsValue({'projBasicId': followProjIdArr})
      // }
    },
    onDeptChange (value) {
      this.userDept = value
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        console.log(!err)
        if (!err) {
          this.loading = true
          let user = this.form.getFieldsValue()
          user.roleId = user.roleId.join(',')
          user.userId = this.userId
          user.deptId = this.userDept
          user.createUserId = this.currentUser.userId
          if (user.projBasicId && user.projBasicId !== null && user.projBasicId !== '') {
            user.followProjId = user.projBasicId.join(',')
          }
          this.$post('server/user.php', {
            ...user,
            action: 'updateUser'
          }).then((r) => {
            this.loading = false
            this.$emit('success')
            // 如果修改用户就是当前登录用户的话，更新其state
            if (user.username === this.currentUser.username) {
              this.$get(`server/user.php?action=userDetail&username=${user.username}`).then((r) => {
                this.setUser(r.data)
              })
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  },
  watch: {
    userEditVisiable () {
      if (this.userEditVisiable) {
        this.$get('server/role.php?action=list').then((r) => {
          this.roleData = r.data
        })
        this.$get('server/dept.php?action=depttree').then((r) => {
          this.deptTreeData = r.data.rows.children
        })
        // let projBasic = {}
        // projBasic.projBasicCreateUser = this.currentUser.userId
        // this.$get('admin/proj/list', {
        //   ...projBasic
        // }).then((r) => {
        //   this.projData = r.data
        // })
      }
    }
  }
}
</script>
