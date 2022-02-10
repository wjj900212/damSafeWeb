<template>
  <!--<nav v-show="showLeft" class="side-menu ant-col-4">-->
    <div class="nav">
     <!-- <a-button type="primary" style="margin-bottom: 16px" @click="toggleCollapsed">
        <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
      </a-button>-->
        <a-menu theme="dark" :inline-collapsed="collapsed" mode="inline" @select="selectMenu" :selectedKeys="firstkey"  :defaultSelectedKeys="[0]">
            <a-menu-item v-for="(subTitle, key) in subTitles"  :key = "key" :path="subTitle.path">
              <router-link :to="subTitle.path">
              <a-icon type="inbox" />
              <span>{{subTitle.name}}</span>
              </router-link>
            </a-menu-item>
        </a-menu>
   </div>
  <!-- </nav>-->
</template>
<script>
export default {
  name: 'SideMenu',
  components: {},
  props: ['subTitles'],
  data () {
    return {
      showLeft: true,
      active: false,
      collapsed: false,
      ind: 0,
      path: '',
      firstkey: []
    }
  },
  mounted () {
    if (this.$route.query.projBasicId) {
      this.ind = this.$route.query.projBasicId
    } else {
      this.ind = 0
    }
  },
  created () {
    this.initData()
  },
  methods: {
    getIndexOf (arr) {
      let that = this
      let ind = 0
      arr.forEach(function (item, index) {
        if (that.$route.path === item.path) {
          ind = index
        }
      })
      return ind
    },
    initData () {
    },
    selectMenu (item, key, selectedKeys) {
      this.firstkey = item.selectedKeys
      // console.log(item)
      // this.$emit('menuSelect', obj)
    }
  },
  watch: {
    subTitles (value) {
      console.log('=====88=====')
      console.log(this.$route.path)
      console.log('=====88=====')
      console.log(value)
      console.log(this.getIndexOf(value))
      this.firstkey = [this.getIndexOf(value)]
      // if(to !== from){
      //   this.firstkey = [0]
      // } else {
      //   this.firstkey = [0]
      // }
    }
  }
}
</script>
<style lang="less" scoped>
.side-menu {
    color: #a7b1c2;
    width: 200px;
    background: #393e46;
    .nav {
        z-index: 2;
        list-style: none;
        padding: 0px;

        > li.active {
            color: #fff;
        }

        > li > a {
            padding: 4px 10px 4px 40px;
            display: block;
            text-align: left;

            &:hover {
                cursor: pointer;
                color: #fff;
            }
        }
        .ant-tabs-tabpane {
            overflow-y: auto;
            height: calc(100vh - 125px);
        }
    }
}
.active{ border: 1px solid #59A1F6;}
.unactive{border:0;}
.ant-tag:hover {
  opacity: 1 !important;
}
</style>
