<template>
  <a-locale-provider :locale="chinese">
    <div id="mk">
      <router-view/>
    </div>
  </a-locale-provider>
</template>
<script>

import enquireScreen from './utils/device'
import chinese from 'ant-design-vue/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'

export default {
  name: 'mk',
  data () {
    return {
      chinese
    }
  },
  created () {
    let _this = this
    enquireScreen(isMobile => {
      _this.$store.commit('setting/setDevice', isMobile)
    })
  }
}
/**
 *对Date的扩展，将 Date 转化为指定格式的String
 *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *例子：
 *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  return fmt
}
</script>
<style lang="less">
  body,html{
    font-family: "Microsoft YaHei UI";
    font-size: 62.5%;
  }
  .icon-size{
    font-size: 1.6rem;
  }
  :global {
    .dragable-ghost {
      border: 1px dashed #aaaaaa;
      opacity: 0.65;
    }
    .dragable-chose {
      border: 1px dashed #aaaaaa;
      opacity: 0.65;
    }
    .dragable-drag {
      border: 1px dashed #aaaaaa;
      opacity: 0.65;
    }
  }

  ::-webkit-scrollbar {
    width: .5rem;
    height: .5rem;
  }

  ::-webkit-scrollbar-track {
    border-radius: 1px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 1px;
    background: rgba(0, 0, 0, .2);
  }

  .multi-page {
    margin: -24px 0 0
  }

  .single-page {
    margin: 0;
    width: 100%;
    margin: 10px;
    overflow: auto;
    min-width: 1200px;
  }

  .card-area {
    width: 100%
  }
  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .not-menu-page {
    background: #fff;
    padding: 16px 32px;
    border-left: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
  }

  .ant-btn, .ant-input, .input, .ant-pagination-item, .ant-pagination-prev .ant-pagination-item-link,
  .ant-pagination-next .ant-pagination-item-link, .ant-tag, .ant-modal-content, .ant-select-selection,
  .ant-select-dropdown, .ant-input-group-addon, .ant-input-number-input, .ant-input-number,
  .ant-pagination-options-quick-jumper input, .ant-alert {
    border-radius: 2px !important;
  }

  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab, .ant-tabs.ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
    border-radius:  3px 3px 0 0 !important;
  }

  .ant-card-wider-padding .ant-card-body {
    padding: 5px 10px;
  }

  .ant-modal-mask {
    background-color: rgba(0, 0, 0, 0.6) !important;
  }

  .ant-modal-header {
    border-bottom-color: #fff !important;
  }

  .ant-menu-dark .ant-menu-inline.ant-menu-sub {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) inset !important;
  }

  .ant-menu-inline .ant-menu-item, .ant-menu-vertical .ant-menu-item {
    margin-top: 0 !important;
  }
  .ant-menu-dark, .ant-menu-dark .ant-menu-sub {
    background: #393e46 !important;
  }

  .ant-table-row-expand-icon {
    margin-right: 1rem !important;
  }

  :root .ant-tabs-tab-prev {
    border: 1px solid #e8e8e8;
    border-radius: 3px 0 0 0;
    background: #fafafa;
  }
  .ant-card-loading{
    &:after{
      width: 0 !important;
    }
  }
  .ant-tabs-tab-next.ant-tabs-tab-arrow-show {
    border: 1px solid #e8e8e8;
    border-radius: 0 3px 0 0;
    background: #fafafa;
  }
  .ant-layout-header, .system-top-menu {
    height: 81px !important;
    line-height: unset !important;
  }
  .ant-form-item {
    margin-bottom: 1rem !important;
  }
  .ant-menu-inline, .ant-menu-vertical, .ant-menu-vertical-left {
    border-right: 0 solid #ccc !important;
  }
  .ant-drawer-body {
    padding-bottom: 3rem !important;
  }
  .page-tabs .ant-tabs-close-x {
    margin-left: 0.3rem! important;
    &:hover {
      color: #f95476 !important;
    }
  }
  .drawer-bootom-button {
    position: absolute;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }
  .search {
    margin-bottom: .5rem !important;
  }
  i {
    font-size: .97rem;
  }
  p {
    /*overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;*/
   word-wrap: break-word;
  }
  @media screen and (min-width: 1400px) {
  }

  @media screen and (max-width: 1399px) {
    p, .ant-pagination, .ant-form, .ant-dropdown, .ant-form-item, .ant-select, .ant-breadcrumb, .ant-form label, .ant-btn, .ant-table,
    .ant-menu-vertical .ant-menu-item, .ant-menu-vertical-left .ant-menu-item, .ant-menu-vertical-right .ant-menu-item, .ant-menu-inline .ant-menu-item, .ant-menu-vertical .ant-menu-submenu-title, .ant-menu-vertical-left .ant-menu-submenu-title, .ant-menu-vertical-right .ant-menu-submenu-title, .ant-menu-inline .ant-menu-submenu-title {
      font-size: 13px !important;
    }
    .ant-card-head {
      font-size: 14px !important;
    }
    .page-tabs .ant-tabs-nav-container {
      font-size: 13px !important;
    }
  }
</style>
