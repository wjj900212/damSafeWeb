<template>
  <!-- 场景可视化 -->
  <a-card title="场景可视化" :bodyStyle="{ padding: '5px' }">
    <a-select slot="extra" v-model="currentScene" @change="sceneChange">
      <a-select-option v-for="v,i in sceneDataArr" :key="i" :value="v.sceneId">{{v.sceneName}}</a-select-option>
    </a-select>
    <div style="width: 100%; text-align: center; padding: 5px;overflow: auto;">
      <!-- :activeKey="currentScene" -->
      <design :data="sceneData"></design>
    </div>
  </a-card>
</template>

<script>
  import design from "../design/design.vue"
  export default {
    props: ["hiddenId"],
    components: {
      design
    },
    data() {
      return {
        currentScene: '',
        sceneDataArr: [], //二维列表
        sceneData: {}
      };
    },
    watch: {
      hiddenId: {
        handler: function (n, o) {
          // console.log(n)
          if (n) this.getData()
          else {
            this.currentScene = ''
            this.sceneDataArr = []
            this.sceneData = {}
          }
        },
        immediate: true
      }
    },
    methods: {
      getData() {
        let o = {
          hiddenId: this.hiddenId,
          sceneType: 1
        }
        this.currentScene = ''
        this.sceneDataArr = []
        this.sceneData = {}
        this.$get("/web/hiddenScene/getHiddenConfigInfo", o).then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return
          }
          if (rr.data.length > 0) {
            this.currentScene = rr.data[0].sceneId
            this.sceneDataArr = rr.data
            this.sceneData = rr.data[0]
          }
        })
      },
      sceneChange() {
        this.sceneData = this.sceneDataArr.find(v => {
          return v.sceneId == this.currentScene
        })
      }
    },
  }

</script>
<style scoped>
  /* @import url(); 引入公共css类 */
  .tit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f2f2f2;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }

  .tit>span {
    font-size: 1.6rem;
  }

</style>
