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

        </a-col>
        <a-col :span="12">

        </a-col>
      </a-row>
    </div>
</template>

<script>
import overview from './overview.vue'
import Visual from './visual'
import TrendStatistic from './trendStatistic'
import Weather from './weather'
export default {
  name: 'rain-monitor',
  components: {
    overview,
    Visual,
    TrendStatistic,
    Weather
  }
}
</script>

<style scoped>

</style>
