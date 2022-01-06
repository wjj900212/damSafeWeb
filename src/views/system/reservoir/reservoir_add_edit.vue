<template>
  <!-- 添加 / 编辑 水库 -->
  <a-form :form="form" @submit="handleSubmit" class="reservoir_add_edit" v-bind="formItemLayout">
    <div class="title"><span class="line"></span>基本信息</div>
    <a-form-item label="所属项目" v-bind="formItemLayout">
      <a-input v-decorator="[
          'username',
          { rules: [{ required: true, message: 'Please input your name' }] },
        ]" placeholder="Please input your name" />
    </a-form-item>
    <a-form-item label="水库名称" v-bind="formItemLayout">
      <a-input v-decorator="[
          'username',
          { rules: [{ required: true, message: 'Please input your name' }] },
        ]" placeholder="Please input your name" />
    </a-form-item>
    <a-form-item label="水库地址" v-bind="formItemLayout">
      <a-input v-decorator="[
          'username',
          { rules: [{ required: true, message: 'Please input your name' }] },
        ]" placeholder="Please input your name" />
    </a-form-item>
    <a-form-item label="位置坐标" v-bind="formItemLayout">
      <a-input v-decorator="[
          'username',
          { rules: [{ required: true, message: 'Please input your name' }] },
        ]" placeholder="Please input your name" />
    </a-form-item>
    <a-form-item label="管理单位" v-bind="formItemLayout">
      <a-input v-decorator="[
          'username',
          { rules: [{ required: true, message: 'Please input your name' }] },
        ]" placeholder="Please input your name" />
    </a-form-item>
    <a-form-item label="水库规模" v-bind="formItemLayout">
      <a-input v-decorator="[
          'username',
          { rules: [{ required: true, message: 'Please input your name' }] },
        ]" placeholder="Please input your name" />
    </a-form-item>
    <a-form-item label="设计库容" v-bind="formItemLayout">
      <a-input v-decorator="['username']" placeholder="Please input your name" />
    </a-form-item>
    <a-form-item label="建设时间" v-bind="formItemLayout">
      <a-input v-decorator="['username']" placeholder="Please input your name" />
    </a-form-item>
    <a-form-item label="实景图" v-bind="formItemLayout">
      <a-input v-decorator="['username']" placeholder="Please input your name" />
    </a-form-item>
    <a-form-item label="水库介绍" v-bind="formItemLayout">
      <a-input v-decorator="['username']" placeholder="Please input your name" />
    </a-form-item>
    <a-form-item label="详细介绍" v-bind="formItemLayout">
      <editorCom ref="editorBox" :key="new Date().getTime()" >
      </editorCom>
    </a-form-item>
    <!-- <div class="title"><span class="line"></span>自定义信息</div> -->
    <a-form-item>
      <a-button type="primary" html-type="submit">保存</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
  import editorCom from "@/components/editor/editor"
  export default {
    name: 'reservoir_add_edit',
    components: {
      editorCom
    },
    data() {
      return {
        formItemLayout: {
          labelCol: {
            span: 6
          },
          wrapperCol: {
            span: 12
          }
        },
        form: this.$form.createForm(this),
      };
    },
    methods: {
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
      },
    },
  }

</script>
<style scoped>
  /* @import url(); 引入公共css类 */
  .reservoir_add_edit {
    width: 100%;
  }

  .title {
    width: 100%;
    font-weight: 500;
    font-size: 1.2rem;
    line-height: 30px;
    display: flex;
    align-items: center;
  }

  .line {
    width: 3px;
    height: 28px;
    background-color: #069afe;
    /* margin: 0 auto; */
    margin-right: 5px;
  }

</style>
