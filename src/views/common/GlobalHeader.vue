<template>
  <a-layout-header :class="[fixHeader && 'ant-header-fixedHeader', layout === 'side' ? (sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed') : null, theme, 'global-header' ]">
    <div :class="['global-header-wide']" v-if="homeVisible">
      <div :class="['global-header-left']">
        <div style="height: 5.4rem;display: flex;">
          <div style="flex:1;display: flex;border-right:1px solid #2AA7D3;text-align: center;">
            <div style="margin-right:1rem;width:40%;">
              <div><img style="width:3.8rem;height: 3.8rem;margin-bottom:0.7rem;" src="static/img/weather/0@2x.png"/></div>
              <div style="color:#289FC9;font-size: 1.4rem;" v-if="cityName === '全国'">北京</div>
              <div style="color:#289FC9;font-size: 1.4rem;" v-else>{{cityName}}</div>
            </div>
            <div style="flex: 1;">
              <div style="color:#2AA7D3;font-size: 3rem;">{{weatherData.temp}}°</div>
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
        <header-avatar class="header-item"/>
      </div>
    </div>
    <div v-else :class="['global-header-control']">
      <div style="display: flex;">
        <div style="padding:0.5rem 1.4rem;margin-right:1rem;">
          <img src="static/img/logo .png"/>
        </div>
        <div>
          <ul>
            <li v-for="(nav,index) in navList" :class="[{'navActive' : selectId === nav.id}]" :key="index" @click="selectNav(nav)">
              <img style="margin-right:0.5rem;" :src="nav.imgIcon"/>{{nav.name}}
            </li>
          </ul>
        </div>
      </div>
      <div :class="['global-header-right']">
        <div style="margin-right:2rem;">
          <a-badge count="5">
            <img src="static/img/消息 (4).png" @click="toRouterPath"/>
          </a-badge>
        </div>
        <header-avatar-system class="header-item"/>
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import HeaderAvatar from './HeaderAvatar'
import HeaderAvatarSystem from './HeaderAvatarSystem'
import IMenu from '@/components/menu/menu'
import { mapState } from 'vuex'

export default {
  name: 'GlobalHeader',
  components: {IMenu, HeaderAvatar, HeaderAvatarSystem},
  props: ['collapsed', 'menuData'],
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
        {id: 1, imgIcon: 'static/img/水库安全监测-normal.png', name: '水库安全监测', path: '/reservoir/reservoir/generalview'},
        {id: 2, imgIcon: 'static/img/系统管理-normal.png', name: '系统管理', path: '/system/reservoir/reservoir'}
      ],
      selectId: 1

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
  mounted () {
    let path = this.$route.path
    if (path === '/home') {
      this.homeVisible = true
    } else {
      this.homeVisible = false
    }
    this.getTime()
    this.getRealTimeWeather()
  },
  methods: {
    showList () {},
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
        // document.getElementById('title-date').innerHTML = time1
        this.time2 = hour + ':' + min + ':' + ss
        // document.getElementById('title-day').innerHTML = time2
      }, 1000)
    },
    selectNav (nav) {
      this.selectId = nav.id
      this.$router.push(nav.path)
    },
    toRouterPath () {
      this.$router.push('/reservoir/reservoir/generalview')
    },
    toggleCollapse () {
      this.$emit('toggleCollapse')
    },
    onSelect (obj) {
      this.$emit('menuSelect', obj)
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
</style>
