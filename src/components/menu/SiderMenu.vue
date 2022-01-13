<template>
  <a-layout-sider
    :class="[theme, 'sider', isMobile ? null : 'shadow', fixSiderbar? 'ant-fixed-sidemenu' : null]"
    width="256px"
    :collapsible="collapsible"
    v-model="collapsed"
    :trigger="null">
    <div :class="['logo', theme]">
      <!-- <router-link to="/">
        
      </router-link> -->
      <img v-if="mainMenu === 'reservoir'" :style="{marginBottom: '22px'}" src="static/img/logo.png" alt="">
      <img v-else src="static/img/logo.png" alt="">
      <span class="menutitle" v-if="mainMenu === 'reservoir'">{{ reservoirList.find(item => item.reservoirId === reservoirId ).reservoirName }}</span>
      <a-dropdown v-if="mainMenu === 'reservoir'" :trigger="['click']">
        <a-icon type="unordered-list" :style="{ fontSize: '20px', float: 'right', marginTop: '20px', color: 'white', cursor: 'pointer', marginRight: '10px' }" />
        <a-menu slot="overlay">
          <a-menu-item @click="changeReservoir(item.reservoirId)" v-for="item in reservoirList" :key="item.reservoirId">
            {{ item.reservoirName }}
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      
    </div>
    <i-menu :theme="theme" :collapsed="collapsed" :menuData="menuData" @select="onSelect"/>
    
  </a-layout-sider>
</template>

<script>
import IMenu from './menu'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'SiderMenu',
  components: {IMenu},
  data () {
    return {
    }
  },
  props: {
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menuData: {
      type: Array,
      required: true
    },
    mainMenu: {
      type: String,
      required: false,
      default: ''
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    }
  },
  computed: {
    ...mapState({
      isMobile: state => state.setting.isMobile,
      fixSiderbar: state => state.setting.fixSiderbar,
      reservoirList: state => state.account.reservoirList,
      reservoirId: state => state.account.reservoirId
    })
  },
  mounted() {
  },
  watch: {

  },
  methods: {
    ...mapMutations({
      setReservoirId: 'account/setReservoirId'
    }),
    changeReservoir (value) {
      this.setReservoirId(value)
    },
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    }
  }
}
</script>

<style lang="less" scoped>
  .menutitle {
    color: white;
    font-size: 15px;
    margin-left: 10px;
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    display: inline-block;
  }
  .shadow {
    box-shadow: 1px 0 6px rgba(0, 21, 41, .35);
  }
  .sider {
    z-index: 16;
    position: relative;
    overflow-x: hidden;
    &.light {
      background-color: #fff;
    }
    &.dark {
      background-color: #393e46;
    }
    &.ant-fixed-sidemenu {
      position: fixed;
      overflow-y: auto;
      height: 100%;
    }
    .logo {
      height: 59px;
      position: relative;
      line-height: 59px;
      padding-left: 24px;
      -webkit-transition: all .3s;
      transition: all .3s;
      overflow: hidden;
      &.light {
        background-color: #fff;
        border-bottom: 1px solid #f8f8f8;
      }
      &.dark {
        background-color: #393e46;
        h1 {
          color: #fff;
        }
      }
      h1 {
        color: #fff;
        font-size: 20px;
        margin: 0 0 0 12px;
        font-family: Chinese Quote,-apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
        font-weight: 600;
        display: inline-block;
        height: 32px;
        line-height: 32px;
        vertical-align: middle;
      }
      img {
        width: 32px;
        display: inline-block;
        vertical-align: initial;
      }
    }
  }
</style>
