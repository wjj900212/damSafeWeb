<template>
  <a-layout>
    <!-- <drawer v-if="isMobile" :openDrawer="collapsed" @change="onDrawerChange">
      <sider-menu :theme="theme" :menuData="menuData" :collapsed="false" :collapsible="false" @menuSelect="onMenuSelect"/>
    </drawer>
    <sider-menu :theme="theme" v-else-if="layout === 'side'" :menuData="menuData" :collapsed="collapsed" :collapsible="true" />
    <drawer :open-drawer="settingBar" placement="right">
      <setting />
    </drawer> -->
    <a-layout>
      <global-header :menuData="menuData" :collapsed="collapsed" @toggleCollapse="toggleCollapse"/>
      <a-layout-content :style="{height:'calc(100vh - 59px)'}" :class="fixHeader ? 'fixed-header-content' : null">
        <slot></slot>
      </a-layout-content>
      <!--<a-layout-footer style="padding: .29rem 0" class="copyright">
        <global-footer :copyright="copyright"/>
      </a-layout-footer>-->
    </a-layout>
  </a-layout>
</template>

<script>
import GlobalHeader from './GlobalHeader'
import GlobalFooter from './GlobalFooter'
import Drawer from '~/tool/Drawer'
import SiderMenu from '~/menu/SiderMenu'
import Setting from '~/setting/Setting'
import { mapState, mapMutations } from 'vuex'
import { triggerWindowResizeEvent } from 'utils/common'

const minHeight = window.innerHeight - 76

let menuData = []

export default {
  name: 'GlobalLayout',
  components: {Setting, SiderMenu, Drawer, GlobalFooter, GlobalHeader},
  data () {
    return {
      minHeight: minHeight + 'px',
      collapsed: false,
      menuData: menuData
    }
  },
  computed: {
    paddingLeft () {
      return this.fixSiderbar && this.layout === 'side' && !this.isMobile ? `${this.sidebarOpened ? 256 : 80}px` : '0'
    },
    ...mapState({
      sidebarOpened: state => state.setting.sidebar.opened,
      isMobile: state => state.setting.isMobile,
      theme: state => state.setting.theme,
      layout: state => state.setting.layout,
      copyright: state => state.setting.copyright,
      fixSiderbar: state => state.setting.fixSiderbar,
      fixHeader: state => state.setting.fixHeader,
      settingBar: state => state.setting.settingBar.opened
    })
  },
  methods: {
    ...mapMutations({setSidebar: 'setting/setSidebar'}),
    toggleCollapse () {
      this.collapsed = !this.collapsed
      this.setSidebar(!this.collapsed)
      triggerWindowResizeEvent()
    },
    onDrawerChange (show) {
      this.collapsed = show
    },
    onMenuSelect () {
      this.toggleCollapse()
    },
    getChildren (tree, nodename) {
      let temp = []
      let node = tree.find((item) => item.path === nodename)
      if (node) {
        temp = node.children
      } else {
        temp = this.getChildren(tree.children, nodename)
      }
      return temp
    },
    getFirstValue (arr) {
      var filtered = arr.filter(function (el) {
        return el !== ''
      })
      return filtered[0]
    },
    setRoute () {
      let routers = this.$db.get('USER_ROUTER')
      console.log(routers)
      let path = this.$route.path
      let arr = path.split('/')
      let pathname = this.getFirstValue(arr)
      console.log(routers)
      console.log(pathname)
      let trees = routers.find((item) => item.path === '/').children
      this.subTitles = []
      this.subTitles = this.getChildren(trees, '/' + pathname)
    }
  },
  watch: {
    '$route' (to, from) {
      console.log('11111111111')
      // let topath = to.path
      // let toarr = topath.split('/')
      // let topathname = this.getFirstValue(toarr)
      // let frompath = from.path
      // let fromarr = frompath.split('/')
      // let frompathname = this.getFirstValue(fromarr)
      // console.log(topathname, frompathname)
      // if (topathname !== frompathname) {
      //   this.setRoute()
      // }
    }
  },
  beforeCreate () {
    let routers = this.$db.get('USER_ROUTER')
    // menuData = routers.find((item) => item.path === '/').children.filter((menu) => {
    //   let meta = menu.meta
    //   if (typeof meta.isShow === 'undefined' || meta.isShow == null) {
    //     return true
    //   } else return meta.isShow
    // })
    // console.log(menuData)
  }
}
</script>

<style lang="less" scoped>
  .setting{
    background-color: #1890ff;
    color: #fff;
    border-radius: 5px 0 0 5px;
    line-height: 40px;
    font-size: 22px;
    width: 40px;
    height: 40px;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  }
  .fixed-header-content {
    margin: 59px 0px 0 !important;
  }
</style>
