<template>
    <div style="width: 100%;">
      <a-row :gutter="24" :style="{ marginBottom: '24px' }">
        <a-col :span="12">
          <overview v-bind="$attrs"></overview>
        </a-col>
        <a-col :span="12">
          <visual v-bind="$attrs"></visual>
        </a-col>
      </a-row>
      <a-row :gutter="24" :style="{ marginBottom: '24px' }">
        <a-col :span="24">
          <trendStatistic v-bind="$attrs"></trendStatistic>
        </a-col>
      </a-row>
      <a-row :gutter="24" :style="{ marginBottom: '24px' }">
        <a-col :span="24">
          <weather v-bind="$attrs"></weather>
        </a-col>
      </a-row>
      <a-row :gutter="24" :style="{ marginBottom: '24px' }">
        <a-col :span="12">
          <warn-msg v-bind="$attrs"></warn-msg>
        </a-col>
        <a-col :span="12">
          <record v-bind="$attrs"></record>
        </a-col>
      </a-row>
    </div>
</template>

<script>
import overview from './overview.vue'
import Visual from './visual'
import TrendStatistic from './trendStatistic'
import Weather from './weather'
import WarnMsg from '@/components/warnMsg/warnMsg'
import Record from '@/components/devopsRecord/record'
export default {
  name: 'rain-monitor',
  components: {
    overview,
    Visual,
    TrendStatistic,
    Weather,
    WarnMsg,
    Record
  }
}
</script>

<style scoped>

</style>
