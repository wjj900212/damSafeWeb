<template>
  <a-modal
    title="编辑预警规则"
    :visible="visible"
    width="750px"
    @cancel="handleCancel"
  >
    <a-form
      :labelCol="{ span: 6 }"
      :wrapperCol="{ span: 18 }"
      :form="form"
      layout="vertical"
    >
      <a-form-item v-bind="formItemLayout" label='预案名称'>
        <a-input
          v-decorator="[
            'name',
            {
              rules: [{ required: true,message: '请填写预案名称' }]
            }
          ]"
          placeholder="请输入预案名称"
        ></a-input>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label='预案类型'>
        <a-select
          :allowClear="true"
          v-decorator="[
            'type',
            {
              rules: [{ required: true,message: '请填写预案类型' }]
            }
          ]"
          style="width: 100%"
          placeholder="请选择"
          @change="handleWarnChange">
          <a-select-option v-for="g in warnLevelList" :key="(g.id).toString()">{{g.label}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label='描述'>
        <a-textarea
          placeholder="请输入"
          :auto-size="{ minRows: 2, maxRows: 6 }"
          v-decorator="[
            'type1'
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label='详情'>
        <editorCom ref="addSafetyBox" :key="randomKey" putUrl="admin/proj/uploadProjDetailsImage" delUrl="admin/proj/delProjArticleImage">
        </editorCom>
      </a-form-item>
    </a-form>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button :style="{ marginRight: '8px' }" @click="handleCancel()">
        关闭
      </a-button>
      <a-button type="primary" @click="addSafety()">
        确认
      </a-button>
    </div>
  </a-modal>
</template>

<script>
import editorCom from '@/components/editor/editor'
export default {
  name: 'safety-add',
  components: {
    editorCom
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      randomKey: new Date().getTime(),
      form: this.$form.createForm(this, { name: 'safetyForm' }),
      formItemLayout: {
        labelCol: {span: 3},
        wrapperCol: {span: 20}
      }
    }
  },
  methods: {
    handleCancel () {
      this.$emit('onClose')
    },
    setFormValues({...proj}) {
      let fields = ['name', 'type', 'type1']
      Object.keys(proj).forEach((key) => {
        if (fields.indexOf(key) !== -1) {
          this.form.getFieldDecorator(key)
          let obj = {}
          obj[key] = proj[key]
          this.form.setFieldsValue(obj)
        }
      })
      setTimeout(() => {
        this.$refs.addSafetyBox.content = proj.projDetails
      }, 300);
    }
  }
}
</script>

<style scoped>

</style>
