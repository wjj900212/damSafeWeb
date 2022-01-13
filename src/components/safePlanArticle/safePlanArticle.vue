<template>
  <!-- 安全管理预案 -->
  <a-modal v-model="safeVisible" title="安全管理预案" width="750px" @cancel="handleCancel">
    <a-tabs v-model="tabKey" tab-position="top">
      <a-tab-pane v-for="v,i in articleArr" :key="(i+1)">
        <template slot="tab">
          <div>{{v.reserveName}}</div>
        </template>
        <div v-html="v.desc"></div>
        <div v-html="v.details"></div>
      </a-tab-pane>
      <!-- <a-empty v-if="articleArr.length==0" ></a-empty> -->
    </a-tabs>
    <template slot="footer">
      <div class="steps-action">
        <a-button @click="handleCancel">
          关闭
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
  export default {
    data() {
      return {
        tabKey: 1,
        articleArr: []
      };
    },
    props: {
      safeVisible: {
        type: Boolean,
        default: false
      },
      reserveType: {
        type: Number,
        default: 0
      }
    },
    watch: {
      reserveType: {
        handler: function (n, o) {
          this.getData()
        },
        immediate: true
      }
    },
    methods: {
      handleCancel() {
        this.$emit('onClose')
      },
      getData() {
        this.$get("/web/reservoirPlan/getPlanListNoPage?reserveType=" + this.reserveType).then(res => {
          let rr = res.data
          if (rr.code != 1) {
            this.$message.error(rr.msg)
            return false
          }
          this.articleArr = rr.data
        })
      }
    },
    filters: {
      // 名称过长时用...代替
      ellipsis(value, num) {
        if (!value) {
          return ''
        }
        if (value.length > num) {
          return value.slice(0, num) + '...'
        }
        return value
      }
    }
  }

</script>
<style scoped>
</style>
