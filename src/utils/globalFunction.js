import mapviewer from 'utils/viewer'
let globalFunction = {
  getNowFormatDate () {
    var date = new Date()
    var seperator1 = '-'
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var strDate = date.getDate()
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate
    return currentdate
  },
  /**
   *
   * @param dateNow :Date类
   * @param intervalDays ：间隔天数
   * @param bolPastTime  ：Boolean,判断在参数date之前，还是之后，
   */
  getDateRange (dateNow, intervalDays, bolPastTime) {
    let oneDayTime = 24 * 60 * 60 * 1000
    let list = []
    let lastDay

    if (bolPastTime === true) {
      lastDay = new Date(dateNow.getTime() - intervalDays * oneDayTime)
      list.push(this.formateDate(lastDay))
      list.push(this.formateDate(dateNow))
    } else {
      lastDay = new Date(dateNow.getTime() + intervalDays * oneDayTime)
      list.push(this.formateDate(dateNow))
      list.push(this.formateDate(lastDay))
    }
    return list
  },
  formateDate (time) {
    let year = time.getFullYear()
    let month = time.getMonth() + 1
    let day = time.getDate()

    if (month < 10) {
      month = '0' + month
    }

    if (day < 10) {
      day = '0' + day
    }

    return year + '-' + month + '-' + day + ''
  },
  getNowDate () {
    let time = ''
    let date = new Date()
    let year = date.getFullYear() // 年
    let month = date.getMonth() + 1 // 月
    let day = date.getDate()
    if (day < 10) {
      day = '0' + day
    }
    let hour = date.getHours()
    let min = date.getMinutes()
    if (min < 10) {
      min = '0' + min
    }
    let second = date.getSeconds()
    if (second < 10) {
      second = '0' + second
    }
    time = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + second
    return time
  },
  getTime () {
    let time = ''
    let date = new Date()
    let year = date.getFullYear() // 年
    let month = date.getMonth() + 1 // 月
    let day = date.getDate()
    let hour = date.getHours()
    let min = date.getMinutes()
    if (min < 10) {
      min = '0' + min
    }
    time = year + '.' + month + '.' + day + ' ' + hour + ':' + min
    return time
  },
  // 获取前一个月的日期
  // 入参格式：YYYY-MM-DD
  getPreMonthDay (date) {
    var arr = date.split('-')
    var year = arr[0] // 当前年
    var month = arr[1] // 当前月
    var day = arr[2] // 当前日
    // 验证日期格式为YYYY-MM-DD
    var reg = date.match(/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/)
    if ((!reg) || (month > 12) || (day > 31)) {
      console.log('日期或格式有误！请输入正确的日期格式（年-月-日）')
      return
    }
    var pre_year = year // 前一个月的年
    var pre_month = parseInt(month) - 1 // 前一个月的月，以下几行是上月数值特殊处理
    if (pre_month === 0) {
      pre_year = parseInt(pre_year) - 1
      pre_month = 12
    }
    var pre_day = parseInt(day) // 前一个月的日，以下几行是特殊处理前一个月总天数
    var pre_month_alldays = new Date(pre_year, pre_month, 0).getDate() // 巧妙处理，返回某个月的总天数
    if (pre_day > pre_month_alldays) {
      pre_day = pre_month_alldays
    }
    if (pre_month < 10) { // 补0
      pre_month = '0' + pre_month
    } else if (pre_day < 10) { // 补0
      pre_day = '0' + pre_day
    }
    var pre_month_day = pre_year + '-' + pre_month + '-' + pre_day
    return pre_month_day
  },
  titleStyle (index) { // 页面刷新后重新将对应标题处理为选中状态
    let doms = document.getElementsByClassName('menu-item')[index]
    doms.className = 'ant-menu-item menu-item menu-selected'
    // doms.childNodes[0].style.color = '#5affce'
    // doms.style.borderTop = '3px solid #5affce'
  },
  refreshData (myChart, data) { // 切换城市 图表数据更新
    let option = myChart.getOption()
    option.series[0].data = data
    myChart.setOption(option)
  },
  wgs84togcj02 (lng, lat) {
    var PI = 3.1415926535897932384626
    var a = 6378245.0
    var ee = 0.00669342162296594323
    if (this.out_of_china(lng, lat)) {
      return [lng, lat]
    } else {
      var dlat = this.transformlat(lng - 105.0, lat - 35.0)
      var dlng = this.transformlng(lng - 105.0, lat - 35.0)
      var radlat = lat / 180.0 * PI
      var magic = Math.sin(radlat)
      magic = 1 - ee * magic * magic
      var sqrtmagic = Math.sqrt(magic)
      dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
      dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
      var mglat = lat + dlat
      var mglng = lng + dlng
      return [mglng, mglat]
    }
  },
  gcj02towgs84 (lng, lat) {
    var PI = 3.1415926535897932384626
    var a = 6378245.0
    var ee = 0.00669342162296594323
    if (this.out_of_china(lng, lat)) {
      return [lng, lat]
    } else {
      var dlat = this.transformlat(lng - 105.0, lat - 35.0)
      var dlng = this.transformlng(lng - 105.0, lat - 35.0)
      var radlat = lat / 180.0 * PI
      var magic = Math.sin(radlat)
      magic = 1 - ee * magic * magic
      var sqrtmagic = Math.sqrt(magic)
      dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
      dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
      var mglat = lat + dlat
      var mglng = lng + dlng
      return [lng * 2 - mglng, lat * 2 - mglat]
    }
  },
  transformlat (lng, lat) {
    var PI = 3.1415926535897932384626
    var a = 6378245.0
    var ee = 0.00669342162296594323
    var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0
    return ret
  },
  transformlng (lng, lat) {
    var PI = 3.1415926535897932384626
    var a = 6378245.0
    var ee = 0.00669342162296594323
    var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
    ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0
    ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0
    return ret
  },
  out_of_china (lng, lat) {
    return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false)
  },
  viewerControl (_this) {
    let that = _this
    let Cesium = _this.Cesium
    let viewer = mapviewer.viewer
    // console.log(viewer.camera)
    // 获取当前相机高度
    let height = Math.ceil(viewer.camera.positionCartographic.height)
    // console.log(height)
    let lenEntity = viewer.entities._entities._array.length
    // console.log(viewer.dataSources.get(0))
    for (let i = 0; i < lenEntity; i++) {
      let item = viewer.entities._entities._array[i]
      if (item._name === 'hiddenPoint' || item._name === 'monitorPoint' || item._name === 'eventPoint' ||
       item._name === 'equip' || item._name === 'model' ||
        item._name === 'wide' || item._name === 'ration' || item._name === 'warnPoint' || item._name === 'centerPoint' ||
        item._name === 'linkLine' || item._name === 'personPoint') {
        if (height < 110000) {
          let lon = item._properties._longitude._value
          let lat = item._properties._latitude._value
          item._position._value = Cesium.Cartesian3.fromDegrees(lon, lat, 0)
        } else {
          // console.log(item.name)
          let lon = item._properties._longitude._value
          let lat = item._properties._latitude._value
          item._position._value = Cesium.Cartesian3.fromDegrees(lon, lat, 3000)
        }
        // item.show = true
      }
      // 首页设备数据经纬度参数特殊处理
      if (item._name === 'pnMonitorPoint') {
        if (height < 110000) {
          let lon = item._properties._projPnLongitude._value
          let lat = item._properties._projPnLatitude._value
          item._position._value = Cesium.Cartesian3.fromDegrees(lon, lat, 0)
        } else {
          let lon = item._properties._projPnLongitude._value
          let lat = item._properties._projPnLatitude._value
          item._position._value = Cesium.Cartesian3.fromDegrees(lon, lat, 3000)
        }
        // item.show = true
      }
      // 专业设备监测页面经纬度参数特殊处理
      if (item._name === 'hiddenPointMon') {
        if (height < 110000) {
          let lon = item._properties._hiddenLongitude._value
          let lat = item._properties._hiddenLatitude._value
          item._position._value = Cesium.Cartesian3.fromDegrees(lon, lat, 0)
        } else {
          let lon = item._properties._hiddenLongitude._value
          let lat = item._properties._hiddenLatitude._value
          item._position._value = Cesium.Cartesian3.fromDegrees(lon, lat, 3000)
        }
        // item.show = true
      }
      // 集群数据
      if (item._name === 'monitorPointCluster' || item._name === 'hiddenPointCluster' || item._name === 'personPointCluster') {
        if (height < 110000) {
          let lon = item._properties._longitude._value
          let lat = item._properties._latitude._value
          item._position._value = Cesium.Cartesian3.fromDegrees(lon, lat, 0)
        } else {
          let lon = item._properties._longitude._value
          let lat = item._properties._latitude._value
          item._position._value = Cesium.Cartesian3.fromDegrees(lon, lat, 5000)
        }
        // item.show = true
      }
    }
    // 根据高度判断行政区划显示与否
    let len = viewer.dataSources.length
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        var dataSource = viewer.dataSources.get(i)
        if (height < 110000) {
          // dataSource.show = false
          let entities = dataSource.entities.values
          for (let i = 0; i < entities.length; i++) {
            let entity = entities[i]
            entity.polygon.material = Cesium.Color.fromCssColorString('#143268').withAlpha(0.01)
            // 悬浮高亮时判断显示隐藏
            that.$emit('hidePoly', true)
          }
        } else {
          // dataSource.show = true
          let entities = dataSource.entities.values
          for (let i = 0; i < entities.length; i++) {
            let entity = entities[i]
            entity.polygon.material = Cesium.Color.fromCssColorString('#143268').withAlpha(0.6)
            // 悬浮高亮时判断显示隐藏
            that.$emit('hidePoly', false)
          }
        }
      }
    }
  }
}
export default globalFunction
