<template>
  <!-- 浸润线配置 phreaticLine -->
  <a-modal :visible="visible" title="浸润线配置" width="1100px" @cancel="$emit('close')">
    <div style="display: flex;height: auto;min-height: 450px;">
      <div style="width:300px;border-right:1px solid #e9e9e9;">
        <div style="margin:5px;">
          <a-input-search v-model="searchStr" placeholder="搜索监测点" @search="onSearch" />
        </div>
        <div v-if="pnTreeList.length > 0" class="pnTree" style="height: calc(100% - 70px);overflow-y: scroll;">
          <a-tree v-model="checkedKeys" checkable :disabled="treeDisabled" :expanded-keys="expandedKeys"
            :defaultExpandAll="autoExpandParent" :treeData="pnTreeList" @expand="onExpand" @check="onCheck">
            <template slot="title" slot-scope="record">
              <div style="display: inline-block;" v-html="record.title"></div>
            </template>
          </a-tree>
        </div>
      </div>
      <div style="width:100%;position: relative;padding:5px;">
        <!-- :disabled="panes.length > 4" @click="add" -->
        <div style="position: absolute;top:0px;right: 0px;z-index: 2;">
          <a-button type="primary" icon="plus" @click="isShowAddScene=true">添加</a-button>
        </div>
        <a-tabs v-model="activetabInd" hide-add type="editable-card" class="tabStyle" style="width: 100%;"
          @change="tabCallback" @edit="onTabEdit">
          <a-tab-pane v-for="(pane,ind) in panes" :key="ind">
            <template slot="tab">
              <span :title="pane.sceneName">{{ pane.sceneName | ellipsis(6) }}</span>
            </template>
            <div class="tempCon" ref="tempBox">
              <img :src="pane.sceneImage" class="upImged" />
              <VueDragResize :w="pane.scaleConfig.width" :h="pane.scaleConfig.scaleh" :isResizable="true"
                :parentLimitation="true" :parentW="765" :parentH="398" :x="pane.scaleConfig.xaxis"
                :y="pane.scaleConfig.yaxis" v-on:resizing="resizeYconfig" v-on:dragging="resizeYconfig">
                <div class="yLine" :style="{height:pane.scaleConfig.scaleh+'px'}"></div>
              </VueDragResize>
              <VueDragResize v-for="(v,i) in pane.itemList" :key="i" :isActive="v.isActive" :w="v.width" :h="v.height"
                :isResizable="v.isResizable" :parentLimitation="true" :parentW="765" :parentH="398" :x="v.xaxis"
                :y="v.yaxis" v-on:clicked="itemActInd=i" v-on:resizing="resize" v-on:dragging="resize">
                <div
                  style="background: url('static/img/圆角矩形2640.png');width: 98px;height: 36px;background-size:100% 100%;position: absolute;top:-39px;left:-5px;">
                  <span style="color:#ffffff;display:flex;justify-content: center;line-height: 25px;"
                    :title="v.pnName">{{v.pnName | ellipsis(6)}}</span>
                </div>
                <img :src="v.path" alt="" :style="{width:v.width+ 'px',height: v.height + 'px'}">
              </VueDragResize>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <template slot="footer">
      <a-button type="primary" @click="handleSave">确定</a-button>
    </template>
    <phreaticAdd :sceneType="1" :visible="isShowAddScene" :hiddenId="hiddenId" @getScenePicPath="getScenePicPath"
      @onClose="()=>{isShowAddScene=false}" />
  </a-modal>
</template>

<script>
  import VueDragResize from 'vue-drag-resize'
  import phreaticAdd from './phreaticAdd.vue'
  export default {
    components: {
      VueDragResize,
      phreaticAdd
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      hiddenId: {
        type: Number,
        default: 0
      },
    },
    watch: {
      visible(newVal) {
        if (newVal) {
          this.getProjPnTreeList()
          this.getHiddenSceneList()
        }
      },
    },
    data() {
      return {
        searchStr: '', //搜索监测点
        pnTreeList: [], // 监测点列表
        checkedKeys: [],
        treeDisabled: false, //监测点是否可选
        expandedKeys: ['all'],
        autoExpandParent: true,
        activetabInd: 0, // 当前选择的场景下标
        panes: [], //场景列表
        isShowAddScene: false,
        itemActInd: '' //可视化配置 itemList中选中的项
      };
    },
    methods: {
      onTabEdit(targetKey, action) {
        if (action == 'remove') this.tarRemove(targetKey)
      },
      tarRemove(targetKey) {
        console.log(targetKey)
        let p={sceneId:this.panes[targetKey].sceneId}
        this.$post('/web/hiddenScene/deleteScene',p).then(res=>{
            let rr=res.data
            if(rr.code!=1){
                this.$message.error(rr.msg)
                return false
            }
            this.panes.splice(targetKey,1)
        })
      },
      onExpand(expandedKeys) {
        // console.log('onExpand', expandedKeys)
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
      },
      onCheck(checkedKeys) {
        // console.log('checkedKeys-----', checkedKeys)
        let allEmle = checkedKeys.findIndex(item => typeof item === 'string')
        console.log('选择多选框', allEmle)
        if (allEmle >= 0) {
          // checkedKeys.pop()
          checkedKeys.splice(allEmle, 1)
        }
        this.checkedKeys = checkedKeys
        console.log(this.checkedKeys)
        this.checkedKeysConfig()
      },
      //   选择点配置
      checkedKeysConfig() {
        // console.log(this.panes[this.activetabInd])
        let arr = JSON.parse(JSON.stringify(this.panes[this.activetabInd].itemList))
        arr.forEach((v, i) => {
          let has = this.checkedKeys.findIndex(h => {
            return h == v.projPnId
          })
          if (has == -1) {
            this.panes[this.activetabInd].itemList.splice(i, 1)
            this.$forceUpdate()
          }
        })
        let noBeing = []
        this.checkedKeys.forEach(v => {
          let has = this.panes[this.activetabInd].itemList.findIndex(vv => {
            return vv.projPnId == v
          })
          if (has == -1) {
            let obj = {
              projPnId: v,
              xaxis: 0,
              yaxis: 0,
              width: 36,
              height: 36,
              sceneId: this.panes[this.activetabInd].sceneId,
              isActive: false,
              isResizable: false
            }
            noBeing.push(obj)
          }
        })
        if (noBeing.length > 0) this.getIconUrl(noBeing[0], 0, noBeing)
      },
      // 搜索监测点
      onSearch(value) {
        this.getProjPnTreeList({
          projPnName: value
        })
      },
      // 获取监测点列表
      getProjPnTreeList(params = {}) {
        params.hiddenId = this.hiddenId
        this.$get('web/hiddenScene/getProjPnList', {
          ...params
        }).then((r) => {
          let projPnData = r.data.data
          let treePnData = []
          projPnData.forEach(v => {
            let treeHidden = {}
            treeHidden.title = v.hiddenName
            treeHidden.key = v.hiddenId + 'all'
            treeHidden.children = []
            v.list.forEach(vv => {
              let treePn = {}
              treePn.title = vv.pnName + '<br/>(' + vv.devCode + ')'
              treePn.key = vv.pnId
              treePn.children = []
              treeHidden.children.push(treePn)
            })
            treePnData.push(treeHidden)
          })
          this.pnTreeList = treePnData
        })
      },
      //   添加的场景信息
      getScenePicPath(sceneMsg) {
        console.log('添加的场景信息', sceneMsg)
        sceneMsg.itemList = []
        let obj = {
          width: 50,
          scaleh: 100,
          xaxis: 10,
          yaxis: 0
        }
        sceneMsg.scaleConfig = obj
        this.panes.push(sceneMsg)
        this.activetabInd = this.panes.length - 1
        this.checkedKeys=[]
      },

      // 初始化配置列表
      getHiddenSceneList(params = {}) {
        let _this = this
        params.dataId = this.hiddenId
        params.sceneType = 1
        this.$get('web/hiddenScene/getHiddenSceneList', {
          ...params
        }).then((r) => {
          if (r.data.code === 1) {
            _this.panes = r.data.data
            if (r.data.data.length !== 0) {
              _this.panes.forEach(item => {
                if (!item.scaleConfig) {
                  let obj = {
                    width: 50,
                    scaleh: 100,
                    xaxis: 10,
                    yaxis: 0
                  }
                  item.scaleConfig = obj
                } else {
                  item.scaleConfig = JSON.parse(item.scaleConfig)
                  item.scaleConfig.width = 50
                }
                item.itemList = []
              })
              _this.getHiddenConfig(r.data.data[0].sceneId)
            }
          }
        })
      },

      // 获取场景的配置信息
      getHiddenConfig(sceneId) {
        let _this = this
        this.$get('web/hiddenScene/getHiddenConfig', {
          sceneId: sceneId
        }).then((r) => {
          let rr = r.data
          rr.data.forEach(v => {
            v.width = 36
            v.height = 36
            v.isActive = false
            v.isResizable = false
          })
          //   this.panes[this.activetabInd].itemList = this.panes[this.activetabInd].itemList.concat(rr.data)
          this.panes[this.activetabInd].itemList = rr.data
          this.panes = Object.assign([], this.panes)
          this.$forceUpdate()
          console.log('------------', this.panes[this.activetabInd].itemList)
          this.checkedKeys = this.panes[this.activetabInd].itemList.map(v => {
            return v.projPnId
          })
        })
      },
      //   切换场景
      tabCallback() {
        // console.log(this.activetabInd)
        this.getHiddenConfig(this.panes[this.activetabInd].sceneId)
        // this.checkedKeys=this.panes[this.activetabInd].itemList.map(v=>{
        //     return v.projPnId
        // })

      },
      // 根据设备条码找到设备对应的图标
      getIconUrl(obj, i, arr) {
        console.log(obj, i, arr)
        this.$post('web/hiddenScene/findIcon', {
          pnId: obj.projPnId
        }).then(res => {
          let rr = res.data
          obj.path = rr.data.path
          obj.pnName = rr.data.pnName

          this.panes[this.activetabInd].itemList.push(obj)
          this.$forceUpdate()
          if (++i < arr.length) this.getIconUrl(arr[i], i, arr)
        })
      },
      //   y轴位置配置
      resizeYconfig(newRect) {
        newRect.height = newRect.height < 20 ? 20 : newRect.height
        this.panes[this.activetabInd].scaleConfig.scaleh = newRect.height
        this.panes[this.activetabInd].scaleConfig.xaxis = newRect.left
        this.panes[this.activetabInd].scaleConfig.yaxis = newRect.top
        this.$forceUpdate()
      },
      resize(newRect) {
        this.panes[this.activetabInd].itemList[this.itemActInd].xaxis = newRect.left
        this.panes[this.activetabInd].itemList[this.itemActInd].yaxis = newRect.top
      },
      //   保存
      handleSave() {
        console.log(this.panes)
        let itemData = []
        this.panes.forEach(v => {
          v.itemList.forEach(vv => {
            vv.scalex = v.scaleConfig.xaxis
            vv.scaley = v.scaleConfig.yaxis
            vv.scaleh = v.scaleConfig.scaleh
            itemData.push(vv)
          })
        })
        console.log(itemData)
        this.$postDate('web/hiddenScene/addOrUpdateConfig?dataId=' + this.hiddenId + '&sceneType=1', itemData).then(
          res => {
            if (res.data.code === 1) {
              this.$emit('close')
              this.$message.success('可视化配置成功')
            }
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
<style lang="less" scoped>
  /* @import url(); 引入公共css类 */
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

  .yLine {
    width: 2px;
    height: 100px;
    background-color: red;
  }

</style>
