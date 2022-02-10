<template>
  <a-layout-header :class="[fixHeader && 'ant-header-fixedHeader', layout === 'side' ? (sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed') : null, theme, 'global-header' ]">
    <div :class="['global-header-wide']" v-if="homeVisible">
      <div :class="['global-header-left']">
        <div style="height: 5.4rem;display: flex;">
          <div style="display: flex;border-right:1px solid #2AA7D3;text-align: center;">
            <div style="margin-right:1rem;width:40%;">
              <div><img style="width:3.8rem;height: 3.8rem;margin-top:-0.2rem;" :src="'static/img/weather/'+weatherData.code+'@2x.png'"/></div>
              <div style="color:#289FC9;font-size: 1.4rem;margin-top:0.3rem;" v-if="cityName === '全国'">北京</div>
              <div style="color:#289FC9;font-size: 1.4rem;margin-top:0.3rem;" v-else>{{cityName}}</div>
            </div>
            <div style="flex: 1;margin-right:1rem;">
              <div style="color:#2AA7D3;font-size: 3rem;margin-top: -0.8rem;">{{weatherData.temp}}°</div>
              <div style="color:#289FC9;font-size: 1.4rem;">{{weatherData.wether}}</div>
            </div>
          </div>
          <div style="flex:1;text-align: center;">
            <div id="title-day" style="color:#C3CDE5;font-size: 2rem;">{{time2}}</div>
            <div id="title-date" style="color:#C3CDE5;font-size: 1.4rem;">{{time1}}</div>
          </div>
        </div>
      </div>
      <div :class="['global-header-center']">
        <img src="static/img/name.png">
      </div>
      <div :class="['global-header-right']">
        <div style="margin-right:2rem;">
          <img src="static/img/控制台.png" @click="toRouterPath"/>
        </div>
        <header-avatar :homeVisible="homeVisible" class="header-item"/>
      </div>
    </div>
    <div v-else :class="['global-header-control']">
      <div style="display: flex;">
        <div style="padding:0.5rem 1.4rem;margin-right:2rem;">
          <img src="static/img/logo .png"/>
        </div>
        <div>
          <ul>
            <li v-for="(nav,index) in navList" :class="[{'navActive' : selectId === nav.id}]" :key="index" @click="selectNav(nav)">
              <img style="margin-right:0.5rem;" :src="nav.imgIcon">{{nav.name}}
            </li>
          </ul>
        </div>
      </div>
      <div :class="['global-header-right']">
        <a-popover class="warnPopover" trigger="click" placement="bottomRight" v-model="isShowPopover">
          <template slot="title">
            <div style="display: flex;justify-content: space-between;align-content: space-between;">
              <div>共{{RealTimeDynamic.length}}条消息</div>
              <div><a @click="toWarnMessage">更多消息</a></div>
            </div>
          </template>
          <template slot="content">
            <div
              v-infinite-scroll="handleInfiniteOnLoad"
              class="demo-infinite-container"
              :infinite-scroll-disabled="busy"
              :infinite-scroll-distance="10"
            >
              <a-list :data-source="RealTimeDynamic">
                <a-list-item slot="renderItem" slot-scope="item, index">
                  <a-list-item-meta :description="item.content">
                    <template slot="title">
                      <span :style="{color:getText(parseInt(item.warnLevel)).color}">
                      <span v-if="item.warnType === '1'">[设备预警]</span>
                      <span v-if="item.warnType === '2'">[安全预警]</span>
                      <span v-if="item.warnType === '5'">[模型预警]</span>
                    </span>
                      <a href="#">{{ item.title }}</a>
                    </template>

                  </a-list-item-meta>
                  <div>{{item.time}}</div>
                </a-list-item>
                <div v-if="loading && !busy" class="demo-loading-container">
                  <a-spin />
                </div>
              </a-list>
            </div>
          </template>
          <a-badge :count="countMessage">
            <img src="static/img/消息 (4).png" @click="getwarnMessage"/>
          </a-badge>
        </a-popover>
        <header-avatar :homeVisible="homeVisible" class="header-item"/>
        <!--<header-avatar-system class="header-item"/>-->
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import HeaderAvatar from './HeaderAvatar'
import IMenu from '@/components/menu/menu'
import { mapState } from 'vuex'
import infiniteScroll from 'vue-infinite-scroll'
import {getText} from '../../utils/utils'

export default {
  name: 'GlobalHeader',
  components: {IMenu, HeaderAvatar},
  props: ['collapsed', 'menuData'],
  directives: { infiniteScroll },
  data () {
    return {
      homeVisible: true,
      isShowList: false,
      weatherIcon: {'晴': '0', '多云': '9'},
      week: ['日', '一', '二', '三', '四', '五', '六'],
      weatherData: '',
      time1: '',
      time2: '',
      navList: [
        {id: 1, imgIcon: 'static/img/水库安全监测-selected.png', name: '水库安全监测', path: '/reservoir/reservoir/generalview'},
        {id: 2, imgIcon: 'static/img/系统管理-normal.png', name: '系统管理', path: '/system/reservoir/reservoir'}
      ],
      selectId: 1,
      countMessage: 0,
      RealTimeDynamic: [],
      data: [],
      loading: false,
      busy: false,
      isShowPopover: false // 点击角标，弹出气泡框显隐

    }
  },
  computed: {
    ...mapState({
      isMobile: state => state.setting.isMobile,
      layout: state => state.setting.layout,
      systemName: state => state.setting.systemName,
      sidebarOpened: state => state.setting.sidebar.opened,
      fixHeader: state => state.setting.fixHeader,
      cityName: state => state.account.cityName
    }),
    theme () {
      return this.layout === 'side' ? 'light' : this.$store.state.setting.theme
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.path === '/home') {
        this.homeVisible = true
      } else {
        this.homeVisible = false
      }
    }
  },
  beforeMount () {
    this.getRealTimeDynamic((r) => {
      let data = r.data.data
      this.RealTimeDynamic = data
    })
  },
  mounted () {
    let path = this.$route.path
    if (path === '/home') {
      this.homeVisible = true
    } else {
      this.homeVisible = false
    }
    this.getTime()
    this.getRealTimeWeather()
    this.getUnreadCount()
  },
  methods: {
    getText (str) {
      return getText(str)
    },
    // 当前城市天气接口
    getRealTimeWeather (params = {}) {
      if (this.cityName === '全国') {
        params.city = '北京市'
      } else {
        params.city = this.cityName
      }
      this.$get('web/monitorScene/realTimeWeather', {
        ...params
      }).then((r) => {
        let dataList = r.data.data
        this.weatherData = dataList
        console.log('当前天气：', dataList)
      })
    },
    getTime () {
      setInterval(() => {
        let date = new Date()
        let year = date.getFullYear() // 年
        let month = date.getMonth() + 1 // 月
        let day = date.getDate()
        let zhou = date.getDay()
        let hour = date.getHours()
        let min = date.getMinutes()
        if (min < 10) {
          min = '0' + min
        }
        let ss = date.getSeconds()
        if (ss < 10) {
          ss = '0' + ss
        }
        this.time1 = year + '/' + month + '/' + day + ' ' + '星期' + this.week[zhou]
        this.time2 = hour + ':' + min + ':' + ss
      }, 1000)
    },
    toWarnMessage () {
      this.$router.push('/reservoir/warn/message')
      this.isShowPopover = false
    },
    selectNav (nav) {
      this.selectId = nav.id
      if (nav.id === 1) {
        this.navList[0].imgIcon = 'static/img/水库安全监测-selected.png'
        this.navList[1].imgIcon = 'static/img/系统管理-normal.png'
      } else {
        this.navList[0].imgIcon = 'static/img/水库安全监测-normal.png'
        this.navList[1].imgIcon = 'static/img/系统管理-selected.png'
      }
      this.$router.push(nav.path)
    },
    getwarnMessage () {
      this.getRealTimeDynamic()
    },
    toggleCollapse () {
      this.$emit('toggleCollapse')
    },
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    },
    toRouterPath () {
      this.$router.push('/reservoir/reservoir/generalview')
      this.isShowPopover = false
    },
    // 获取预警未读消息数量
    getUnreadCount () {
      this.$get('web/earlyWarningBasic/getUnreadCount').then((r) => {
        let data = r.data.data
        this.countMessage = data
      })
    },
    // 获取预警列表
    getRealTimeDynamic (callback) {
      let params = {}
      params.flag = 1
      this.$get('web/onePicture/RealTimeDynamic', {
        ...params
      }).then(callback)
    },
    handleInfiniteOnLoad () {
      const data = this.RealTimeDynamic
      this.loading = true
      if (data.length > 14) {
        this.$message.warning('Infinite List loaded all')
        this.busy = true
        this.loading = false
        return
      }
      this.getRealTimeDynamic(res => {
        this.RealTimeDynamic = data.concat(res.data.data)
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .buttonlist {
    width: 110px;
    z-index: 10;
    position: absolute;
    right: 120px;
    background: white;
    top: 60px;
  }
  .trigger {
    font-size: 20px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color .3s;
  }
  .header-item{
    padding: 0 19px;
    display: inline-block;
    height: 100%;
    cursor: pointer;
    vertical-align: middle;
    i{
      font-size: 16px;
      color: rgba(0,0,0,.65);
    }
  }
  .global-header{
    padding: 0 12px 0 0;
    -webkit-box-shadow: 0 1px 4px rgba(0,21,41,.08);
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    position: relative;
    &.light{
      background: #fff;
    }
    &.dark{
      background: #393e46;
    }
    .global-header-wide{
      display: flex;
      justify-content: space-between;
      align-content: space-between;
      background: linear-gradient(-1deg, #000F3F, #072B9F) !important;
      .global-header-left{
        width:15%;
        padding:1.3rem 2rem 1.4rem 2rem;
      }
      .global-header-center{
        flex: 1;
        background: url("../../../static/img/组979.png") no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .global-header-right{
      width:15%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .global-header-control{
      display: flex;
      justify-content: space-between;
      align-content: space-between;
      height: 100%;
      ul {
        display:flex;
        justify-content: center;
        align-items:center;
        height: 100%;
        padding:0px !important;
      }
      li {
        list-style-type: none;
        width:auto;
        margin:10px;
        text-align: center;
        font-size: 1.6rem;
        font-family: Source Han Sans CN;
        font-weight: 400;
        cursor: pointer;
      }
      .navActive{
        color: #1890FF;
      }
    }
  }
  .ant-header-fixedHeader {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 15;
    width: 100%;
    transition: width .2s;

    &.ant-header-side-opened {
      width: 100%;
      // padding-left: 254px;
    }

    &.ant-header-side-closed {
      width: 100%;
      padding-left: 80px;
    }
  }
  .demo-infinite-container {
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    overflow: auto;
    padding: 8px 24px;
    height: 300px;
  }
  .demo-loading-container {
    position: absolute;
    bottom: 40px;
    width: 100%;
    text-align: center;
  }
</style>
