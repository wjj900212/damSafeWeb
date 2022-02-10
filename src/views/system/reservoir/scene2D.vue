<template>
  <!-- 监测场景可视化 scene2D -->
  <a-modal :visible="visible" title="二维可视化配置" width="1100px" @cancel="handleCancel">
    <div style="display: flex;height: auto;min-height: 450px;">
      <div style="width:300px;border-right:1px solid #e9e9e9;">
        <div style="margin:5px;">
          <a-input-search v-model="searchStr" placeholder="搜索监测点" @search="onSearch" />
        </div>
         <div v-if="pnTreeList.length > 0" class="pnTree" style="height: calc(100% - 70px);overflow-y: scroll;">
          <a-tree v-model="checkedKeys" checkable :disabled="treeDisabled" :expanded-keys="expandedKeys" :defaultExpandAll="autoExpandParent" :treeData="pnTreeList" @expand="onExpand" @check="onCheck">
            <template slot="title" slot-scope="record">
              <div style="display: inline-block;" v-html="record.title"></div>
            </template>
          </a-tree>
        </div>
      </div>
      <div style="width:100%;position: relative;padding:5px;">
        <div style="position: absolute;top:0px;right: 0px;z-index: 2;">
          <a-button type="primary" icon="plus" :disabled="panes.length > 4" @click="add">添加</a-button>
        </div>
        <a-tabs v-model="activeKey" hide-add type="editable-card" class="tabStyle" style="width: 100%;"
          @change="callback" @edit="onEdit">
          <a-tab-pane v-for="pane in panes" :key="pane.sceneId" :closable="pane.closable">
            <template slot="tab">
              <span :title="pane.sceneName">{{ pane.sceneName | ellipsis(6) }}</span>
            </template>
            <div class="tempCon" ref="tempBox">
              <img :src="pane.sceneImage" class="upImged" v-if="imgUrl" />
              <VueDragResize v-for="(v,i) in pane.itemList" :key="i" :isActive="v.isActive" :w="v.width-28" :h="v.height-28"
                v-on:clicked="dragClick(i)" v-on:dragging="resize" :isResizable="false" :parentLimitation="true"
                :parentW="765" :parentH="398" :x="v.xaxis" :y="v.yaxis">
                <div style="background: url('static/img/圆角矩形2640.png');width: 98px;height: 36px;background-size:100% 100%;position: absolute;top:-39px;left:-5px;">
                  <span style="color:#ffffff;display:flex;justify-content: center;line-height: 25px;" :title="v.pnName">{{v.pnName | ellipsis(6)}}</span>
                </div>
                <img :src="v.path" alt="" :style="{width:(v.width - 22) + 'px',height: (v.height - 22) + 'px'}">
              </VueDragResize>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <template slot="footer">
      <a-button type="primary" @click="handleSave">确定</a-button>
    </template>
    <visualAdd :sceneType="sceneType" :hiddenType="hiddenType" :visible="isShowAddScene" :hiddenId="id" @getScenePicPath="getScenePicPath" @onClose="()=>{isShowAddScene=false}" />
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
    id: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      default: ''
    },
    sceneType: {
      type: Number,
      default: 0
    },
    hiddenType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      activeKey: '',
      searchStr: '',
      treeDisabled: false,
      panes: [], // 场景列表
      pnTreeList: [],
      expandedKeys: ['all'],
      autoExpandParent: true,
      checkedKeys: [],
      imgFile: '',
      imgUrl: '',
      itemList: [],
      actItemI: 0,
      // activetabInd: 0, // 当前选择的场景下标
      isShowAddScene: false // 显示添加场景弹框
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.getHiddenSceneList()
        this.getProjPnTreeList()
      }
    },
    imgUrl (newVal) {
      this.imgUrl = newVal
    },
    panes (newVal) {
      let _this = this
      _this.panes = newVal
      // console.log('当前场景及监测点信息', newVal)
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
        console.log(this.panes)
        if (this.panes.find(item => item.sceneId === this.activeKey) !== undefined) {
          console.log('newVal.length', this.panes.find(item => item.sceneId === this.activeKey))
          this.panes.find(item => item.sceneId === this.activeKey).itemList = []
          this.panes = Object.assign([], this.panes)
        }
      }
      if (oldVal.length !== 0 || newVal.length === 1 || newVal.length === this.checkedKeys.length) {
        pnId = this.diffent(newVal, oldVal)
      }
      if (pnId.length !== 0) {
        let isExite = newVal.findIndex(item => item === pnId[0])
        /* console.log('isExite', isExite)
        console.log('pnId', pnId) */
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
    onSearch (value) {
      this.getProjPnTreeList({
        projPnName: value
      })
    },
    // 初始化获取隐患点场景配置信息
    getHiddenSceneList (params = {}) {
      let _this = this
      params.dataId = this.id
      params.sceneType = this.sceneType
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
      if (this.sceneType === 0) {
        params.reservoirId = this.id
      } else {
        params.hiddenId = this.id
      }
      this.$get('web/hiddenScene/getProjPnList', {...params}).then((r) => {
        let projPnData = r.data.data
        let treePnData = []
        for (let i = 0; i < projPnData.length; i++) {
          let treeHidden = {}
          treeHidden.title = projPnData[i].hiddenName
          treeHidden.key = projPnData[i].hiddenId + 'all'
          treeHidden.children = []
          treePnData.push(treeHidden)
          console.log('二维可视化数列表', treePnData)
          for (let j = 0; j < projPnData[i].list.length; j++) {
            let treePn = {}
            treePn.title = projPnData[i].list[j].pnName + '<br/>(' + projPnData[i].list[j].devCode + ')'
            treePn.key = projPnData[i].list[j].pnId
            treePn.children = []
            treePnData[i].children.push(treePn)
          }
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
    // 根据设备条码找到设备对应的图标
    getIconUrl (params = {}) {
      let _this = this
      console.log('场景上的监测点列表', _this.panes.find(item => item.sceneId === _this.activeKey).itemList.length)
      // if (_this.panes.find(item => item.sceneId === _this.activeKey).itemList.length === 0) {
      this.$post('web/hiddenScene/findIcon', {...params}).then((r) => {
        if (r.data.code === 1) {
          let iconInfo = r.data.data
          iconInfo.projPnId = params.pnId
          iconInfo.sceneId = _this.activeKey
          iconInfo.xaxis = 0
          iconInfo.yaxis = 0
          let itemList = _this.panes.find(item => item.sceneId === _this.activeKey).itemList
          itemList.push(iconInfo)
          // 新建一个空对象将对象复制进空对象再赋值给监听的值，这种方法可以监听到对象属性的新增和修改
          _this.panes = Object.assign([], _this.panes)
          // console.log('监测设备icon信息', itemList)
          // console.log('场景上的监测点', itemList.itemList)
        }
      })
      // }
    },
    onExpand (expandedKeys) {
      console.log('onExpand', expandedKeys)
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) {
      console.log('checkedKeys-----', checkedKeys)
      for (let i = 0; i < checkedKeys.length; i++) {
        let allEmle = checkedKeys.findIndex(item => typeof item === 'string')
        if (allEmle >= 0) {
          // checkedKeys.pop()
          checkedKeys.splice(allEmle, 1)
        }
      }

      this.checkedKeys = checkedKeys
    },
    resize (newRect) {
      let itemList = this.panes.find(item => item.sceneId === this.activeKey).itemList
      itemList[this.actItemI].yaxis = newRect.top
      itemList[this.actItemI].xaxis = newRect.left
      // console.log('this.itemList', this.itemList)
    },
    dragClick (i) {
      let itemList = this.panes.find(item => item.sceneId === this.activeKey).itemList
      itemList.forEach((v) => {
        v.isActive = false
      })
      itemList[i].isActive = true
      this.actItemI = i
      console.log('this.itemList=====dragClick', itemList)
    },
    callback () {
      let itemList = this.panes.find(item => item.sceneId === this.activeKey)
      if (itemList.itemList === undefined) {
        itemList.itemList = []
      }
      if (itemList.itemList.length === 0) {
        this.checkedKeys = []
        this.getHiddenConfig(this.activeKey)
      } else {
        let checkkey = []
        for (let i = 0; i < itemList.itemList.length; i++) {
          checkkey.push(itemList.itemList[i].projPnId)
        }
        this.checkedKeys = checkkey
      }
      console.log('callback---newVal', this.checkedKeys)
    },
    handleCancel () {
      this.checkedKeys = []
      this.$emit('close')
    },
    handleSave () {
      let iconData = []
      for (let i = 0; i < this.panes.length; i++) {
        for (let j = 0; j < this.panes[i].itemList.length; j++) {
          let icon = {}
          icon.projPnId = this.panes[i].itemList[j].projPnId
          icon.sceneId = this.panes[i].itemList[j].sceneId
          icon.xaxis = this.panes[i].itemList[j].xaxis
          icon.yaxis = this.panes[i].itemList[j].yaxis
          iconData.push(icon)
        }
      }
      this.$postDate('web/hiddenScene/addOrUpdateConfig?dataId=' + this.id + '&sceneType=' + this.sceneType, iconData).then((r) => {
        if (r.data.code === 1) {
          this.handleCancel()
          this.$message.success('可视化配置成功')
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    onEdit (targetKey, action) {
      console.log('action', action)
      this[action](targetKey)
    },
    add () {
      this.isShowAddScene = true
    },
    // 删除场景
    remove (targetKey) {
      let _this = this
      let scenePath = this.panes.find(item => item.sceneId === targetKey)
      console.log('要删除的tab', targetKey)
      console.log('获取场景信息', this.panes)
      console.log('获取场景信息', scenePath)
      this.$confirm({
        title: `确定要删除${scenePath.sceneName}?`,
        content: '该场景下的配置将会被全部删除，请谨慎操作！',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          _this.deleteScene(targetKey)
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    deleteScene (targetKey) {
      this.$post('web/hiddenScene/deleteScene', {
        sceneId: targetKey
      }).then((r) => {
        if (r.data.code === 1) {
          this.checkedKeys = []
          this.$message.success('删除成功')
          let activeKey = this.activeKey
          let lastIndex
          this.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
              lastIndex = i - 1
            }
          })
          const panes = this.panes.filter(pane => pane.sceneId !== targetKey)
          if (panes.length && activeKey === targetKey) {
            if (lastIndex >= 0) {
              activeKey = panes[lastIndex].sceneId
            } else {
              activeKey = panes[0].sceneId
            }
          }
          this.panes = panes
          this.activeKey = activeKey
        } else {
          this.$message.error(r.data.msg)
        }
      })
    },
    diffent (fArr, cArr) {
      let diffRes = []
      let fDatas = []
      let cDatas = []
      for (let i in fArr) {
        let flg = false
        for (let j in cArr) {
          if (cArr[j] === fArr[i]) {
            flg = true
            break
          }
        }
        if (!flg) {
          fDatas.push(fArr[i])
        }
      }
      for (let i in cArr) {
        let flg = false
        for (let j in fArr) {
          if (fArr[j] === cArr[i]) {
            flg = true
            break
          }
        }
        if (!flg) {
          cDatas.push(cArr[i])
        }
      }
      diffRes.push(...cDatas.concat(fDatas))
      console.log('两个数组不同值', diffRes)
      return diffRes
    }
  },
  filters: {
    // 名称过长时用...代替
    ellipsis (value, num) {
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
