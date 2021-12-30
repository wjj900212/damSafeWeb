<template>
  <div class="app-container">
    <div ref="gantt" class="left-container" />
  </div>
</template>
<script>
import gantt from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
import 'dhtmlx-gantt/codebase/locale/locale_cn'
export default {
  name: 'DhtmlxGantt',
  props: {
    tasks: {
      required: true
    }
  },
  data () {
    return {
    }
  },
  mounted () {
    this.configGantt()
    // 初始化
    gantt.init(this.$refs.gantt)
    // 数据解析
    gantt.parse(this.tasks)
  },
  methods: {
    configGantt () {
      gantt.config.columns = [{
        name: 'text', label: ' ', width: '*', tree: true
      }]
      gantt.config.row_height = 21
      gantt.config.scale_unit = 'month'
      gantt.config.scale_height = 65
      gantt.config.date_scale = '%Y年 %M'
      gantt.config.min_column_width = 31
      gantt.config.show_progress = true
      gantt.config.prevent_default_scroll = false
      gantt.config.grid_width = 245
      gantt.config.show_task_cells = false
      gantt.config.show_marker = true
      gantt.config.grid_resize = false
      gantt.config.smart_scales = true
      gantt.config.subscales = [
        { unit: 'week', step: 1, date: '第 %W 周' },
        {
          unit: 'day',
          step: 1,
          date: '%j',
          css: (date) => {
            let subClassName = 'sub_scale'
            if (date.getDay() === 6 || date.getDay() === 0) subClassName += ' weekend'
            return subClassName
          }
        }
      ]
      gantt.config.drag_links = false
      gantt.config.details_on_dblclick = false
      // 只读模式
      gantt.config.readonly = true
      // 拖拉任务
      // gantt.config.order_branch = true
      // gantt.config.order_branch_free = true
    }
  }
}
</script>
<style>
  .left-container {
    height: 300px;
    width: auto;
    overflow: auto;
  }
</style>
