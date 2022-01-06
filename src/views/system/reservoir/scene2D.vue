<template>
  <!-- 监测场景可视化 scene2D -->
  <a-modal :visible="visible" title="二维可视化配置" width="1200px" @cancel="$emit('close')">

    <div style="display: flex;height: auto;min-height: 500px;">
      <div style="flex: 0.25;border-right:1px solid #e9e9e9;">
        <div style="margin:5px;">
          <a-input-search v-model="searchStr" placeholder="搜索监测点" @search="onSearch" />
        </div>
        <!-- <div v-if="pnTreeList.length > 0" class="pnTree" style="height: calc(100% - 70px);overflow-y: scroll;">
          <a-tree v-model="checkedKeys" checkable :disabled="treeDisabled" :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent" :treeData="pnTreeList" @expand="onExpand" @check="onCheck">
            <template slot="title" slot-scope="record">
              <div style="display: inline-block;" v-html="record.title"></div>
            </template>
          </a-tree>
        </div> -->
      </div>
      <div style="flex: 0.75;position: relative;padding:5px;">
        <!-- :disabled="panes.length > 4" @click="add" -->
        <div style="position: absolute;top:0px;right: 0px;z-index: 2;">
          <a-button type="primary" icon="plus" @click="isShowAddScene=true">添加</a-button>
        </div>
        <a-tabs v-model="activetabInd" hide-add type="editable-card" class="tabStyle" style="width: 100%;"
          @change="callback">
          <a-tab-pane v-for="(pane,ind) in panes" :key="ind">
            <template slot="tab">
              <span :title="pane.sceneName">{{ pane.sceneName | ellipsis(6) }}</span>
            </template>
            <div class="tempCon" ref="tempBox">
              <img :src="pane.sceneImage" class="upImged" />
              <VueDragResize v-for="(v,i) in pane.itemList" :key="i" :isActive="v.isActive" :w="v.width" :h="v.height"
                v-on:clicked="dragClick(i)" v-on:dragging="dragging" :isResizable="false" :parentLimitation="true"
                :parentW="900" :parentH="600" :x="v.xaxis" :y="v.yaxis">
                <div
                  style="background: url('static/img/圆角矩形2640.png');width: 128px;height: 48px;position: absolute;top:-48px;">
                  <span style="color:#ffffff;display:flex;justify-content: center;line-height: 40px;"
                    :title="v.pnName">{{v.pnName | ellipsis(9)}}</span>
                </div>
                <img :src="v.path" alt="" style="width:100%;height: 100%;">
              </VueDragResize>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <template slot="footer">
      <a-button type="primary">确定</a-button>
    </template>
    <visualAdd :visible="isShowAddScene" hiddenId="1" @onClose="()=>{isShowAddScene=false}" />
  </a-modal>
</template>

<script>
  import VueDragResize from 'vue-drag-resize'
  import visualAdd from "./scene2D_add.vue"
  export default {
    components: {
      visualAdd,
      VueDragResize
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        searchStr: '',
        panes: [{
            sceneId: 1,
            sceneName: '场景1',
            sceneImage: "https://img0.baidu.com/it/u=1985782942,2642646797&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333",
            itemList: [{
              bonline: 0,
              configId: 149,
              devCode: "",
              devModelName: "",
              height: 58,
              path: "https://test.isafety.zgcsafety.com.cn/admin/pmapp/download/scanFileStream?projBasicId=&functionType=modelPicture&id=23&filename=164074282535087c609a684e54a9895c91f073eea49c7.png",
              pnName: "微芯桩4.0位移版_001",
              projPnId: 385,
              sceneId: 41,
              status: "",
              width: 58,
              xaxis: 0,
              yaxis: 0
            }]
          },
          {
            sceneId: 2,
            sceneName: '场景2',
            sceneImage: "https://img1.baidu.com/it/u=3653784530,2326162019&fm=26&fmt=auto"
          },
          {
            sceneId: 3,
            sceneName: '场景3',
            sceneImage: "https://img1.baidu.com/it/u=853986521,3980232579&fm=26&fmt=auto"
          },
        ], //场景列表
        activetabInd: 0, //当前选择的场景下标
        isShowAddScene: false, //显示添加场景弹框
      };
    },
    methods: {
      // 搜索监测点
      onSearch() {},
      callback() {
        console.log(this.activetabInd)
      },
      // 点击选中 需要拖拽的下标
      dragClick(i) {
        this.itemList.forEach((v) => {
          v.isActive = false;
        });
        this.itemList[i].isActive = true;
        this.dragActI = i;
      },
      dragging(newRect) {
        console.log(newRect)
      }
    },
  }

</script>
<style lang="less" scoped>
  .pnTree /deep/ .ant-tree li .ant-tree-node-content-wrapper {
    height: auto !important;
  }

  .sceneConfig /deep/ .ant-modal {
    top: 50px !important;
  }

  .checkboxTree {
    position: absolute;
    right: 0;
  }

  .upImged {
    width: 100%;
    height: 100%;
  }

  .tempCon {
    width: 900px;
    height: 600px;
    background-color: #f2f2f2;
    position: relative;
  }

  .tabStyle /deep/ * {
    .ant-tabs-tab {
      border: 1px solid #0FAA84 !important;
      border-radius: 4px !important;
      background: #FFFFFF !important;
      color: #0FAA84 !important;
      margin-right: 10px !important;
    }

    .ant-tabs-tab-active {
      background: #42B982 !important;
      color: #FFFFFF !important;

      .ant-tabs-close-x {
        color: #FFFFFF !important;
      }
    }

    .ant-tabs-nav-container {
      margin-bottom: 0px !important;
    }
  }

  .tabStyle /deep/ .ant-tabs-bar {
    margin: 0 0 10px 0 !important;
    border-bottom: 0px !important;
  }

</style>
