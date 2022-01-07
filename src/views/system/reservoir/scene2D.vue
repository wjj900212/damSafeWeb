<template>
  <!-- 监测场景可视化 scene2D -->
  <a-modal :visible="visible" title="二维可视化配置" width="1000px" @cancel="$emit('close')">
    <div style="display: flex;height: auto;min-height: 450px;">
      <div style="flex: 0.25;border-right:1px solid #e9e9e9;">
        <div style="margin:5px;">
          <a-input-search v-model="searchStr" placeholder="搜索监测点" @search="onSearch" />
        </div>
         <div v-if="pnTreeList.length > 0" class="pnTree" style="height: calc(100% - 70px);overflow-y: scroll;">
          <a-tree v-model="checkedKeys" checkable :disabled="treeDisabled" :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent" :treeData="pnTreeList" @expand="onExpand" @check="onCheck">
            <template slot="title" slot-scope="record">
              <div style="display: inline-block;" v-html="record.title"></div>
            </template>
          </a-tree>
        </div>
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
                :parentW="765" :parentH="398" :x="v.xaxis" :y="v.yaxis">
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
    <visualAdd :visible="isShowAddScene" :hiddenId="hiddenPointSource.hiddenId" @getScenePicPath="getScenePicPath" @onClose="()=>{isShowAddScene=false}" />
  </a-modal>
</template>

<script>
import VueDragResize from 'vue-drag-resize'
import visualAdd from './scene2D_add.vue'
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
    hiddenPointSource: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      searchStr: '',
      panes: [], // 场景列表
      pnTreeList: [],
      expandedKeys: ['all'],
      autoExpandParent: true,
      checkedKeys: [],
      imgFile: '',
      imgUrl: '',
      itemList: [],
      actItemI: 0,
      activetabInd: 0, // 当前选择的场景下标
      isShowAddScene: false // 显示添加场景弹框
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.getProjPnTreeList()
        this.getHiddenSceneList()
      }
    },
    imgUrl (newVal) {
      this.imgUrl = newVal
    },
    panes (newVal) {
      let _this = this
      _this.panes = newVal
      console.log('当前场景及监测点信息', newVal)
      if (newVal.length === 0) {
        _this.treeDisabled = true
      } else {
        _this.treeDisabled = false
      }
    },
    checkedKeys (newVal, oldVal) {
      this.checkedKeys = newVal
      let pnId = []
      if (newVal.length === 0) {
        oldVal = newVal
        console.log('newVal.length', this.panes.find(item => item.sceneId === this.activeKey))
        this.panes.find(item => item.sceneId === this.activeKey).itemList = []
        this.panes = Object.assign([], this.panes)
      }
      if (oldVal.length !== 0 || newVal.length === 1 || newVal.length === this.checkedKeys.length) {
        pnId = this.diffent(newVal, oldVal)
      }
      if (pnId.length !== 0) {
        let isExite = newVal.findIndex(item => item === pnId[0])
        console.log('isExite', isExite)
        if (isExite === 0) {
          if (this.panes.find(item => item.sceneId === this.activeKey).itemList.length === 0) {
            for (let i = 0; i < pnId.length; i++) {
              this.getIconUrl({
                pnId: pnId[i]
              })
            }
          }
        } else if (isExite > 0) {
          for (let i = 0; i < pnId.length; i++) {
            this.getIconUrl({
              pnId: pnId[i]
            })
          }
        } else if (isExite < 0) {
          let itemList = this.panes.find(item => item.sceneId === this.activeKey).itemList
          for (let i = 0; i < itemList.length; i++) {
            if (itemList[i].projPnId === pnId[0]) {
              itemList.splice(i, 1)
            }
          }
          this.panes = Object.assign([], this.panes)
        }
      }
      /* console.log('当前场景信息', this.panes) */
      console.log('newVal', newVal)
      console.log('oldVal', oldVal)
    }
  },
  methods: {
    // 搜索监测点
    onSearch () {},
    callback () {
      console.log(this.activetabInd)
    },
    // 初始化获取隐患点场景配置信息
    getHiddenSceneList (params = {}) {
      let _this = this
      params.hiddenId = this.hiddenPointSource.hiddenId
      this.$get('web/hiddenScene/getHiddenSceneList', {...params}).then((r) => {
        if (r.data.code === 1) {
          _this.panes = r.data.data
          if (r.data.data.length !== 0) {
            _this.panes.find(item => {
              if (item.itemList === undefined) {
                item.itemList = []
              }
            })
            _this.activeKey = r.data.data[0].sceneId
            _this.imgUrl = r.data.data[0].sceneImage
            _this.getHiddenConfig(r.data.data[0].sceneId)
          }
        }
      })
    },
    // 获取场景的配置信息
    getHiddenConfig (sceneId) {
      let _this = this
      this.$get('web/hiddenScene/getHiddenConfig', {
        sceneId: sceneId
      }).then((r) => {
        if (r.data.code === 1) {
          // console.log('场景中选中监测点信息', r.data.data)
          for (let i = 0; i < _this.panes.length; i++) {
            if (_this.panes[i].sceneId === sceneId) {
              _this.panes[i].itemList = r.data.data
            }
          }
          _this.panes = Object.assign([], _this.panes)
          if (r.data.data.length !== 0) {
            let checkkey = []
            for (let i = 0; i < r.data.data.length; i++) {
              checkkey.push(r.data.data[i].projPnId)
            }
            _this.checkedKeys = checkkey
            // console.log('初始化获取场景中选中监测点id', checkkey)
          }
        }
      })
    },
    // 获取监测点列表
    getProjPnTreeList (params = {}) {
      params.hiddenId = this.hiddenPointSource.hiddenId
      params.flag = 1
      this.$get('web/hiddenScene/getProjPnList', {...params}).then((r) => {
        let projPnData = r.data.data
        let treePnData = [{title: this.hiddenPointSource.hiddenName + '(' + projPnData.length + ')', key: 'all', children: []}]
        for (let i = 0; i < projPnData.length; i++) {
          let treePn = {}
          treePn.title = projPnData[i].pnName + '<br/>(' + projPnData[i].devBasicStrId + ')'
          treePn.key = projPnData[i].pnId
          treePn.children = []
          treePnData[0].children.push(treePn)
        }
        this.pnTreeList = treePnData
        console.log('树值', this.pnTreeList)
      })
    },
    getScenePicPath (scenePath) {
      console.log('添加的场景信息', scenePath)
      const panes = this.panes
      const activeKey = scenePath.sceneId
      panes.push(scenePath)
      this.panes = panes
      this.activeKey = activeKey
      this.imgUrl = scenePath.sceneImage
      this.checkedKeys = []
      let itemList = this.panes.find(item => item.sceneId === this.activeKey)
      itemList.itemList = []
    },
    // 点击选中 需要拖拽的下标
    dragClick (i) {
      this.itemList.forEach((v) => {
        v.isActive = false
      })
      this.itemList[i].isActive = true
      this.dragActI = i
    },
    dragging (newRect) {
      console.log(newRect)
    }
  }
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
    width: 765px;
    height: 398px;
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
