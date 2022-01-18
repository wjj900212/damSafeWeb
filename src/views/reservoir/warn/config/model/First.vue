<template>
    <div style="padding-top:50px;text-align: center">
      <div style="margin-bottom:10px;">
        <label for="scene">监测场景:</label>
        <a-select
          id="scene"
          style="width:200px;"
          v-model="thresholdEditMoreObj.first.hiddenName"
          @change="handleSceneChange"
          placeholder="请选择监测场景"
        >
          <a-select-option v-for="item in typeList" :key="item.hiddenId" :value="item.hiddenName">
            {{item.hiddenName}}
          </a-select-option>
        </a-select>
      </div>
      <div>
        <label for="devType">设备类型:</label>
        <a-select
          id="devType"
          style="width:200px;"
          v-model="thresholdEditMoreObj.first.devModelName"
          @change="handleDevChange"
          placeholder="请选择设备类型"
        >
          <a-select-option v-for="item in devTypeList" :key="item.devModelId" :value="item.devModelName+'||'+item.devModelId">
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
    devTypeList: {
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
      scene: {}
    }
  },
  mounted () {
  },
  watch: {

  },
  methods: {
    handleSceneChange (value, key) {
      this.scene.hiddenId = key.data.key
      this.scene.hiddenName = value
    },
    handleDevChange (value) {
      let devInfo = value.split('||')
      this.scene.devModelId = devInfo[1]
      this.scene.devModelName = devInfo[0]
      this.$emit('updateThresholdDev', this.scene)
    }
  }
}
</script>

<style scoped>

</style>
