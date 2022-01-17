<template>
  <a-modal
    title="添加预警规则"
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
          v-model="safetyParams.reserveName"
          v-decorator="[
            'reserveName',
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
          v-model="safetyParams.reserveType"
          v-decorator="[
            'reserveType',
            {
              rules: [{ required: true,message: '请填写预案类型' }]
            }
          ]"
          style="width: 100%"
          placeholder="请选择"
          >
          <a-select-option v-for="g in safetyTypeList" :key="(g.typeId).toString()">{{g.typeName}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label='描述'>
        <a-textarea
          placeholder="请输入"
          :auto-size="{ minRows: 2, maxRows: 6 }"
          v-model="safetyParams.desc"
          v-decorator="[
            'desc'
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label='详情'>
        <editorCom ref="addSafetyBox" :key="randomKey" putUrl="file/uploadDetailsImage" delUrl="file/deleteDetailsImage">
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
      },
      safetyParams: {},
      safetyTypeList: [
        {typeId: '0', typeName: '综合预案'},
        {typeId: '11', typeName: '渗流监测'},
        {typeId: '12', typeName: '渗压监测'},
        {typeId: '13', typeName: '大坝变形监测'},
        {typeId: '14', typeName: '大坝微动监测'},
        {typeId: '15', typeName: '雨情监测'},
        {typeId: '16', typeName: '水情监测'}
      ]
    }
  },
  methods: {
    handleCancel () {
      this.$emit('onClose')
    },
    reset () {
      this.form.resetFields()
      this.$emit('onClose')
    },
    addSafety () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.safetyParams.details = this.$refs.addSafetyBox.content
          this.$postDate('web/reservoirPlan/addPlan', {
            ...this.safetyParams
          }).then((r) => {
            this.$emit('fetch')
            this.reset()
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
