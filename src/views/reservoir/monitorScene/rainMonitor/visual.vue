<template>
  <!-- 场景可视化 -->
  <div class="visual">
    <a-card title="水库可视化">
      <a-select
        slot="extra"
        v-model="scene"
        placeholder="选择场景"
        option-filter-prop="children"
        @change="handleSceneChange"
      >
        <a-select-option
          v-for="item in sceneData"
          :value="item.id"
          :key="item.id"
        >
          {{ item.name }}
        </a-select-option>
      </a-select>
      <a-card-grid style="width: 100%; text-align: center; padding: 5px">
        <design :data="designData"></design>
      </a-card-grid>
    </a-card>
  </div>
</template>

<script>
import Design from '@/components/design/design.vue'
export default {
  components: {Design},
  props: ['pointId'],
  data () {
    return {
      current: 'jack',
      scene: '',
      sceneData: [],
      designData: {}
    }
  },
  watch: {
    pointId: {
      handler: function (n, o) {
        console.log(n)
      },
      immediate: true
    }
  },
  methods: {
    handleSceneChange () {

    }
  }
}

</script>
<style scoped>
  /* @import url(); 引入公共css类 */

</style>
