<template>
  <a-cascader
    v-model="casdata"
    :options="options"
    :loadData="loadData"
    @popupVisibleChange="popupVisibleChange"
    change-on-select
    placeholder="请选择所属区域"
    @change="onChange" />
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'cascader',
  props: {
    defaultValue: {
      default: []
    },
    updateOptions: {
      default: []
    }
  },
  data () {
    return {
      options: [],
      distType: '0',
      casdata: [],
      distData: {},
      defaultOptions: []
    }
  },
  computed: {
    ...mapState({
      user: state => state.account.user,
      cityName: state => state.account.cityName,
      cityCode: state => state.account.cityCode,
      cityType: state => state.account.cityType
    })
  },
  mounted () {
    console.log('1111')
    this.distType = '0'
    // let defaultValue = ['110000', '110100', '110108']
    this.init()
    if (this.defaultValue.length > 0) {
      this.options = this.updateOptions
      this.casdata = this.defaultValue
    } else {
      this.options = this.defaultOptions
    }
  },
  methods: {
    popupVisibleChange (value) {
      this.options = this.defaultOptions
    },
    onChange (value, selectedOptions) {
      // this.casdata = []
      console.log('ssss:', this.casdata)
      for (let i = 0; i < value.length; i++) {
        if (value[i] === '000000') {
          this.distType = '0'
        } else if (value[i].replace(/(0+)$/g, '').length === 2) {
          this.distType = '1'
        } else if (value[i].replace(/(0+)$/g, '').length === 4) {
          this.distType = '2'
        } else {
          this.distType = '3'
        }
      }
      if (selectedOptions) {
        let targetOption = selectedOptions[selectedOptions.length - 1]
        this.distData.cityCode = targetOption.value
        this.distData.cityName = targetOption.label
        this.distData.type = this.distType
        this.$emit('getDistData', this.distData)
      } else {
        this.$emit('getDistData', {})
      }
    },
    loadData (selectedOptions) {
      console.log('selected:', selectedOptions)
      let that = this
      let distDataList = []
      let targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      let params = {
        cityCode: targetOption.value,
        type: that.distType
      }
      // this.getCityCodeList(params)
      this.$get('area/listCounty', {
        ...params
      }).then((r) => {
        if (r.data.code === 1) {
          let distList = r.data.data
          for (let i = 0; i < distList.length; i++) {
            let distData = {}
            if (that.distType === '2' || that.distType === '3') {
              distData.value = distList[i].cityCode
              distData.label = distList[i].name
            } else {
              distData.value = distList[i].cityCode
              distData.label = distList[i].name
              distData.isLeaf = false
            }
            distDataList.push(distData)
          }
        }
      })
      // load options lazily
      setTimeout(() => {
        targetOption.loading = false
        targetOption.children = distDataList
        that.options = [...that.options]
      }, 1500)
      console.log(that.options)
    },
    getCityCodeList (params = {}) {
      this.$get('area/listCounty', {
        ...params
      }).then((r) => {
        if (r.data.code === 1) {
          let distList = r.data.data
          let datamap = []
          for (let i = 0; i < distList.length; i++) {
            let distData = {}
            if (this.cityType === 2 || this.cityType === 3) {
              distData.value = distList[i].cityCode
              distData.label = distList[i].name
            } else {
              distData.value = distList[i].cityCode
              distData.label = distList[i].name
              distData.isLeaf = false
            }
            // this.options.push(distData)
            datamap.push(distData)
          }
          // this.options = datamap
          this.defaultOptions = datamap
        }
      })
    },
    init () {
      this.options = []
      // let that = this
      let params = {}
      params = {
        cityCode: '000000',
        type: 0
      }
      this.getCityCodeList(params)
    }
  },
  watch: {
    defaultValue (val) { // 监听数据发生改变 刷新图表数据
      this.casdata = val
      console.log('defaultValue:', val)
      if (this.defaultValue.length > 0) {
        this.options = this.updateOptions
        console.log('**********cascader*********')
        console.log(this.casdata)
        console.log(this.options)
      } else {
        this.options = this.defaultOptions
      }
    }
  }
}
</script>

<style scoped>

</style>
