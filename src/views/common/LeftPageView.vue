<template>
    <a-config-provider :locale="locale">
    <div id="app" style="height: 100%;">
      <a-layout class="ant-col-24" style="height:100%">
        <a-layout-sider style="flex:0 0 0 30%;max-width: 256px; min-width: 256px; width: 256px;">
          <sider-menu :theme="theme" :menuData="subTitles" :collapsed="collapsed" :collapsible="true" />
          <!-- <side-menu :subTitles="subTitles">
          </side-menu> -->
        </a-layout-sider>
        <page-layout :title="title">
            <keep-alive v-if="multipage">
            <router-view ref="page"/>
            </keep-alive>
            <router-view ref="page" v-else/>
        </page-layout>
      </a-layout>
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import PageLayout from './PageLayout'
import SiderMenu from '~/menu/SiderMenu'
import { mapState, mapMutations } from 'vuex'
/* import request from 'utils/request'
import db from 'utils/localstorage' */
export default {
  name: 'LeftPageView',
  components: {PageLayout, SiderMenu},
  data () {
    return {
      locale: zhCN,
      title: '',
      subTitles: [],
      collapsed: false
    }
  },
  computed: {
    multipage () {
      return this.$store.state.setting.multipage
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
  mounted () {
    this.getPageHeaderInfo()
    this.setRoute()
  },
  watch: {
    '$route' (to, from) {
      let topath = to.path
      let toarr = topath.split('/')
      let topathname = this.getFirstValue(toarr)
      let frompath = from.path
      let fromarr = frompath.split('/')
      let frompathname = this.getFirstValue(fromarr)
      if (topathname !== frompathname) {
        this.setRoute()
      }
    }
  },
  updated () {
    this.getPageHeaderInfo()
  },
  methods: {
    ...mapMutations({setSidebar: 'setting/setSidebar'}),
    getPageHeaderInfo () {
      this.title = this.$route.name
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
      // let trees = routers.find((item) => item.path === '/').children
      this.subTitles = []
      this.subTitles = this.getChildren(routers, '/' + pathname)
      // menuData = routers.find((item) => item.path === '/').children.filter((menu) => {
      //   let meta = menu.meta
      //   if (typeof meta.isShow === 'undefined' || meta.isShow == null) {
      //     return true
      //   } else return meta.isShow
      // })
      // const asyncMenu = require('./disasterOverview.json')
      // if (this.$route.path === '/disaster/potential') {
      //   this.subTitles = asyncMenu[0].disasterOverview[0].children[0].children
      // } else if (this.$route.path === '/professional/equipment') {
      //   this.subTitles = asyncMenu[0].disasterOverview[0].children[0].children
      // } else if (this.$route.path === '/management/HiddenDangerPoint') {
      //   this.subTitles = asyncMenu[0].management[0].children[0].children
      // }
      /* let user = db.get('USER')
      request.get(`admin/menu/${user.username}`).then((res) => {
        let route = res.data
        console.log(route)
        if (this.$route.path === '/disaster/potential') {
          this.subTitles = route[0].children[1].children
        } else if (this.$route.path === '/professional/equipment') {
          this.subTitles = route[0].children[2].children
        }
      }) */
      // console.log(this.$route.path)
      // console.log(routers)
    },
    selectMenu (key) {

    }
  }
}
</script>

<style lang="less" scoped>
  .extraImg{
    margin-top: -60px;
    text-align: center;
    width: 195px;
    img{
      width: 100%;
    }
  }
</style>
