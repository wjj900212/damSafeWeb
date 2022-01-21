<template>
  <!-- 场景可视化 -->
  <div class="visual">
    <a-card title="场景可视化" :bodyStyle="{ padding: '5px' }">
      <a-select
        slot="extra"
        v-model="scene"
        placeholder="选择场景"
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
      <div style="width: 100%; text-align: center; padding: 5px;overflow: auto;">
        <design :data="designData"></design>
      </div>
    </a-card>
  </div>
</template>

<script>
import Design from '@/components/design/design.vue'
export default {
  components: {Design},
  props: ['hiddenId'],
  data () {
    return {
      current: 'jack',
      scene: '',
      sceneData: [],
      designData: {}
    }
  },
  watch: {
    hiddenId: {
      handler: function (n, o) {
        this.getDesignConfig()
      },
      immediate: true
    }
  },
  mounted () {
    // this.getDesignConfig()
  },
  methods: {
    handleSceneChange () {

    },
    getDesignConfig () {
      const { hiddenId } = this
      if (hiddenId === -1) {
          return;
      }
      const params = {
        hiddenId: hiddenId,
        sceneType: '1'
      }
      this.$get('web/hiddenScene/getHiddenConfigInfo', {
        ...params
      }).then((r) => {
        if (r.data.data !== null) {
          let data = r.data.data
          this.sceneData = data
          if (data.length > 0) {
            this.scene = data[0].sceneId
            this.designData = data[0]
          } else {
            this.designData = {}
          }
        }
      })
    }
  }
}

</script>
<style scoped>
  /* @import url(); 引入公共css类 */

</style>
