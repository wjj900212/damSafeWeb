<template>
  <div :class="[multipage === true ? 'multi-page':'single-page', 'not-menu-page', 'home-page']">
    <a-row :gutter="8" class="head-info">
      <a-card class="head-info-card">
        <a-col :span="12">
          <div class="head-info-avatar">
            <img alt="头像" :src="avatar">
          </div>
          <div class="head-info-count">
            <div class="head-info-welcome">
              {{welcomeMessage}}
            </div>
            <div class="head-info-desc">
              <p>{{user.deptName ? user.deptName : '暂无部门'}} | {{user.roleName ? user.roleName : '暂无角色'}}</p>
            </div>
            <div class="head-info-time">上次登录时间：{{user.lastLoginTime ? user.lastLoginTime : '第一次访问系统'}}</div>
          </div>
        </a-col>
        <a-col :span="12">
          <div>
            <a-row class="more-info">
              <a-col :span="4"></a-col>
              <a-col :span="4"></a-col>
              <a-col :span="4"></a-col>
              <a-col :span="4">
                <head-info title="回款" :content="HKdata" type="HK" @click="showDetail"  :center="false" :bordered="false"/>
              </a-col>
              <a-col :span="4">
                <head-info title="外包支出" :content="WBdata" type="WB" @click="showDetail"  :center="false" />
              </a-col>
              <a-col :span="4">
                <head-info title="营运支出" :content="YYdata" type="YY" @click="showDetail" :center="false" :bordered="false"/>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-card>
    </a-row>
    <a-row :gutter="8" class="count-info">
      <a-col :span="12" class="visit-count-wrapper">
        <div class="mb-1">
          <a-form
            size="small"
            layout="inline"
          >
            <a-form-item label="时间范围">
              <a-range-picker  size="small" style="width:260px;"  @change="handleDateChange"/>
            </a-form-item>
          </a-form>
        </div>
        <a-card class="visit-count">
          <apexchart ref="count" type=bar height=300 :options="chartOptions" :series="series" @click="onClick" />
        </a-card>
      </a-col>
    </a-row>
    <!-- 回款明细 -->
    <hk-list
      ref="hkList"
      :dataSource="HKDataList"
      @close="handleClose"
      @exportExcel="exportExcel"
      :hkListVisiable="hkList.visible">
    </hk-list>
    <!-- 外包明细 -->
    <wb-list
      ref="wbList"
      :dataSource="WBDataList"
      @close="handleClose"
      @exportExcel="exportExcel"
      :wbListVisiable="wbList.visible">
    </wb-list>
    <!-- 营运明细 -->
    <yy-list
      ref="yyList"
      :dataSource="YYDataList"
      @close="handleClose"
      @exportExcel="exportExcel"
      :yyListVisiable="yyList.visible">
    </yy-list>
  </div>
</template>
<script>
import HeadInfo from '@/views/common/HeadInfo'
import {mapState} from 'vuex'
import moment from 'moment'
import HkList from '@/views/common/HkList.vue'
import WbList from '@/views/common/WbList.vue'
import YyList from '@/views/common/YyList.vue'
moment.locale('zh-cn')

export default {
  name: 'HomePage',
  components: {HeadInfo, HkList, WbList, YyList},
  data () {
    return {
      series: [],
      chartOptions: {
        chart: {
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '35%'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: []
        },
        fill: {
          opacity: 1

        }
      },
      hkList: {
        visible: false
      },
      wbList: {
        visible: false
      },
      yyList: {
        visible: false
      },
      HKdata: 0,
      WBdata: 0,
      YYdata: 0,
      userRole: '',
      userDept: '',
      lastLoginTime: '',
      welcomeMessage: '',
      year: '1',
      startDate: '',
      endDate: '',
      HKDataList: [],
      YYDataList: [],
      WBDataList: []
    }
  },
  computed: {
    ...mapState({
      multipage: state => state.setting.multipage,
      user: state => state.account.user
    }),
    avatar () {
      return `static/avatar/${this.user.avatar}`
    }
  },
  methods: {
    welcome () {
      const date = new Date()
      const hour = date.getHours()
      let time = hour < 6 ? '早上好' : (hour <= 11 ? '上午好' : (hour <= 13 ? '中午好' : (hour <= 18 ? '下午好' : '晚上好')))
      let welcomeArr = [
        '喝杯咖啡休息下吧☕',
        '几天没见又更好看了呢😍',
        '今天又写了几个Bug🐞呢',
        '今天在群里吹水了吗',
        '今天吃了什么好吃的呢',
        '今天您微笑了吗😊',
        '今天帮助别人解决问题了吗',
        '准备吃些什么呢',
        '周末要不要去看电影？'
      ]
      let index = Math.floor((Math.random() * welcomeArr.length))
      return `${time}，${this.user.username}，${welcomeArr[index]}`
    },
    getHomeInfo () {
      let startDate = this.startDate
      let endDate = this.endDate
      this.$get(`server/proj.php`, {
        startDate: startDate,
        endDate: endDate,
        action: 'getHomeInfo'
      }).then((r) => {
        let data = r.data
        this.HKDataList = data.HK
        this.WBDataList = data.WB
        this.YYDataList = data.YY
        this.HKdata = this.getSum(data.HK, 'Amount')
        this.WBdata = this.getSum(data.WB, 'Amount')
        this.YYdata = this.getSum(data.YY, 'Amount')
        this.$refs.count.updateSeries([
          {
            name: '项目情况',
            data: [this.HKdata, this.WBdata, this.YYdata]
          }
        ], true)
        this.$refs.count.updateOptions({
          xaxis: {
            categories: ['回款', '外包支出', '营运支出']
          },
          title: {
            text: '项目回款和支出情况(默认为当月)',
            align: 'left'
          }
        }, true, true)
      }).catch((r) => {
        console.error(r)
        // this.$message.error('获取首页信息失败')
      })
    },
    handleDateChange (dates, dateStrings) {
      this.startDate = dateStrings[0]
      this.endDate = dateStrings[1]
      this.getHomeInfo()
    },
    exportExcel (type) {
      let startDate = this.startDate
      let endDate = this.endDate
      this.$export(`server/writeExcel.php`, {
        startDate: startDate,
        endDate: endDate,
        type: type,
        action: 'exportExcel'
      })
    },
    showDetail (type) {
      switch (type) {
        case 'HK':
          this.hkList.visible = true
          break
        case 'WB':
          this.wbList.visible = true
          break
        case 'YY':
          this.yyList.visible = true
          break
      }
    },
    handleClose (type) {
      switch (type) {
        case 'HK': this.hkList.visible = false
          break
        case 'WB': this.wbList.visible = false
          break
        case 'YY': this.yyList.visible = false
          break
      }
    },
    getSum (arr, field, typeid) {
      let sum = 0
      arr.forEach((item) => {
        if (typeid !== undefined) {
          if (item['TypeId'] === typeid) {
            sum += parseFloat(item[field])
          }
        } else {
          sum += parseFloat(item[field])
        }
      })
      return Math.round(sum * 100) / 100
    },
    onClick (info) {
      console.log(info)
    }
  },
  mounted () {
    this.welcomeMessage = this.welcome()
    this.getHomeInfo()
    // setInterval(this.getHomeInfo, 600000)
  }
}
</script>
<style lang="less">
  .home-page {
    .head-info {
      margin-bottom: .5rem;
      .head-info-card {
        padding: .5rem;
        border-color: #f1f1f1;
        .head-info-avatar {
          display: inline-block;
          float: left;
          margin-right: 1rem;
          img {
            width: 5rem;
            border-radius: 2px;
          }
        }
        .head-info-count {
          display: inline-block;
          float: left;
          .head-info-welcome {
            font-size: 1.05rem;
            margin-bottom: .1rem;
          }
          .head-info-desc {
            color: rgba(0, 0, 0, 0.45);
            font-size: .8rem;
            padding: .2rem 0;
            p {
              margin-bottom: 0;
            }
          }
          .head-info-time {
            color: rgba(0, 0, 0, 0.45);
            font-size: .8rem;
            padding: .2rem 0;
          }
        }
      }
    }
    .count-info {
      .visit-count-wrapper {
        padding-left: 0 !important;
        .visit-count {
          padding: .5rem;
          border-color: #f1f1f1;
          .ant-card-body {
            padding: .5rem 1rem !important;
          }
        }
      }
      .project-wrapper {
        padding-right: 0 !important;
        .project-card {
          border: none !important;
          .ant-card-head {
            border-left: 1px solid #f1f1f1 !important;
            border-top: 1px solid #f1f1f1 !important;
            border-right: 1px solid #f1f1f1 !important;
          }
          .ant-card-body {
            padding: 0 !important;
            table {
              width: 100%;
              td {
                width: 50%;
                border: 1px solid #f1f1f1;
                padding: .6rem;
                .project-avatar-wrapper {
                  display:inline-block;
                  float:left;
                  margin-right:.7rem;
                  .project-avatar {
                    color: #42b983;
                    background-color: #d6f8b8;
                  }
                }
              }
            }
          }
          .project-detail {
            display:inline-block;
            float:left;
            text-align:left;
            width: 78%;
            .project-name {
              font-size:.9rem;
              margin-top:-2px;
              font-weight:600;
            }
            .project-desc {
              color:rgba(0, 0, 0, 0.45);
              p {
                margin-bottom:0;
                font-size:.6rem;
                white-space:normal;
              }
            }
          }
        }
      }
    }
  }
</style>
