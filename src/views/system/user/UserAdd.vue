<template>
  <a-drawer
    title="添加用户"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="userAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='姓名'
                   v-bind="formItemLayout"
                   :validateStatus="validateStatus"
                   :help="help">
        <a-input v-model="user.username"
                 @blur="handleUserNameBlur"
                 v-decorator="['username',{rules: [{ required: true, message: '用户名不能为空'}]}]"/>
      </a-form-item>
      <a-form-item label='密码' v-bind="formItemLayout">
        <a-tooltip title='新用户默认密码为 1234qwer'>
          <a-input type='password' readOnly :value="defaultPassword"/>
        </a-tooltip>
      </a-form-item>
      <!-- <a-form-item label='邮箱' v-bind="formItemLayout">
        <a-input
          v-model="user.email"
          v-decorator="['email',{rules: [
            { type: 'email', message: '请输入正确的邮箱' },
            { max: 50, message: '长度不能超过50个字符'}
          ]}]"/>
      </a-form-item> -->
      <a-form-item label="手机" v-bind="formItemLayout">
        <a-input
          v-model="user.mobile"
          v-decorator="['mobile', {rules: [
            { pattern: '^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$', message: '请输入正确的手机号'}
          ]}]"/>
      </a-form-item>
      <a-form-item label='角色' v-bind="formItemLayout">
        <a-select
          mode="multiple"
          :allowClear="true"
          v-model="user.roleId"
          style="width: 100%"
          v-decorator="['role',{rules: [{ required: true, message: '请选择角色' }]}]">
          <a-select-option v-for="r in roleData" :key="r.roleId">{{r.roleName}}</a-select-option>
        </a-select>
      </a-form-item>
      <!-- <a-form-item label='关注密码'
                   v-bind="formItemLayout"
                   :validateStatus="validateStatus"
                   >
        <a-input type='password' v-model="user.followPswd"
                v-decorator="['followPswd']"/>
      </a-form-item> -->
      <a-form-item label='职位' v-bind="formItemLayout">
        <a-tree-select
          :allowClear="true"
          :dropdownStyle="{ maxHeight: '220px', overflow: 'auto' }"
          :treeData="deptTreeData"
          v-decorator="['deptId']"
          v-model="user.deptId">
        </a-tree-select>
      </a-form-item>
      <a-form-item label='水库权限' v-bind="formItemLayout">
        <a-select
          mode="multiple"
          :allowClear="true"
          v-model="user.role"
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
      user: {
        username: '',
        type: '1'
      },
      loading: false,
      roleData: [],
      deptTreeData: [],
      projData: [
        {key: '0', value: '密云水库'},
        {key: '1', value: '延庆水库'}
      ],
      formItemLayout,
      defaultPassword: '1234qwer',
      form: this.$form.createForm(this),
      validateStatus: '',
      help: ''
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.account.user
    })
  },
  methods: {
    reset () {
      this.validateStatus = ''
      this.help = ''
      this.user.username = ''
      this.loading = false
      this.form.resetFields()
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    handleSubmit () {
      if (this.validateStatus !== 'success') {
        this.handleUserNameBlur()
      }
      this.form.validateFields((err, values) => {
        if (!err && this.validateStatus === 'success') {
          this.loading = true
          this.user.roleId = this.user.roleId.join(',')
          if (this.user.projs && this.user.projs !== null && this.user.projs !== '') {
            this.user.followProjId = this.user.projs.join(',')
          }
          this.user.createUserId = this.currentUser.userId
          this.$post('server/user.php', {
            ...this.user,
            action: 'insertUser'
          }).then((r) => {
            this.reset()
            this.$emit('success')
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
    userAddVisiable () {
      if (this.userAddVisiable) {
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
