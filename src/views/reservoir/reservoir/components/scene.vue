<template>
  <a-card>
    <div class="scene">
      <div class="card">
        <img src="static/img/control/可视化.png"/>
        <span>水库可视化</span>
      </div>
      <a-select
        v-model="defaultValue"
        placeholder="选择场景"
        :style="{width:'15rem'}"
        option-filter-prop="children"
        @change="handleSceneChange"
      >
        <a-select-option
          v-for="item in sceneData"
          :value="item.sceneId"
          :key="item.sceneId"
        >
          {{ item.sceneName }}
        </a-select-option>
      </a-select>
    </div>
    <div
      style="
        width: 100%;
        height: 410px;
        text-align: center;
        overflow: auto;
        padding: 5px;
      "
    >
      <design :data="designData"></design>
    </div>
  </a-card>
</template>
<script>
import design from '@/components/design/design.vue'
export default {
  name: 'scene',
  components: {
    design
  },
  props: {
    sceneData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      defaultValue: undefined,
      designData: {}
    }
  },
  computed: {},
  mounted () {
    const { sceneData } = this
    this.defaultValue = sceneData.length > 0 ? sceneData[0].sceneId : undefined
    this.designData = sceneData.length > 0 ? sceneData[0] : {}
  },
  updated () {},
  watch: {
    sceneData (val) {
      // 监听数据发生改变 刷新图表数据
      const { sceneData } = this
      this.defaultValue =
        sceneData.length > 0 ? sceneData[0].sceneId : undefined
      this.designData = sceneData.length > 0 ? sceneData[0] : {}
    }
  },
  methods: {
    handleSceneChange (value) {
      const data = this.sceneData.find((item) => item.sceneId === value)
      this.designData = data
    }
  }
}
</script>

<style lang="less" scoped>

</style>
