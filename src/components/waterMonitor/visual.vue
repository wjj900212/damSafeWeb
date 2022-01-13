<template>
  <!-- 场景可视化 -->
  <div class="visual">
    <div class="tit">
      <span>场景可视化</span>
      <a-select v-model="currentScene">
        <a-select-option v-for="v,i in sceneData" :key="i" :value="v.sceneId">{{v.sceneName}}</a-select-option>
      </a-select>
    </div>

    <a-card-grid style="width: 100%; text-align: center; padding: 5px">
      <!-- :activeKey="currentScene" -->
      <design :data="sceneData" ></design>
    </a-card-grid>
  </div>
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
        designData: [],
        sceneData:[] //二维列表
      };
    },
    watch: {
      hiddenId: {
        handler: function (n, o) {
          // console.log(n)
          if(n)this.getData()
        },
        immediate: true
      }
    },
    methods: {
      getData(){
        let o={
          hiddenId:this.hiddenId,
          sceneType:1
        }
        this.currentScene=''
        this.sceneData=[]
        this.$get("/web/hiddenScene/getHiddenConfigInfo",o).then(res=>{
          let rr=res.data
          if(rr.code!=1){
            this.$message.error(rr.msg)
            return
          }
          if(rr.data.length>0){
          this.currentScene=rr.data[0].sceneId
          this.sceneData=rr.data
          }
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
