<template>
    <div style="padding-top:50px;text-align: center">
      <div style="margin-bottom:10px;">
        <label for="scene">监测场景:</label>
        <a-select
          id="scene"
          style="width:200px;"
          v-model="thresholdEditMoreObj.first.scene"
          @change="handleChange"
          placeholder="请选择监测场景"
        >
          <a-select-option v-for="item in devTypeList" :key="item.devModelId" :value="item.devModelName">
            {{item.devModelName}}
          </a-select-option>
        </a-select>
      </div>
      <div>
        <label for="devType">设备类型:</label>
        <a-select
          id="devType"
          style="width:200px;"
          v-model="thresholdEditMoreObj.first.devModelName"
          @change="handleChange"
          placeholder="请选择设备类型"
        >
          <a-select-option v-for="item in devTypeList" :key="item.devModelId" :value="item.devModelName">
            {{item.devModelName}}
          </a-select-option>
        </a-select>
      </div>
      <div style="margin-top:5px;">
        <span style="color:#999999;">注意：仅适用同一类型设备批量设置!</span>
      </div>
    </div>
</template>

<script>
export default {
  name: 'first',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    typeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    thresholdEditMoreObj: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      devTypeList: [],
      dev: {}
    }
  },
  mounted () {
    this.devTypeList = this.typeList
  },
  watch: {
    typeList (newVal) {
      this.devTypeList = newVal
    }
  },
  methods: {
    handleChange (value, key) {
      this.dev = {
        devModelName: value,
        devModelId: key.data.key
      }
      this.$emit('updateThresholdDev', this.dev)
    }
  }
}
</script>

<style scoped>

</style>
