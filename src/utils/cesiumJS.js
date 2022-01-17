import globalFunction from 'utils/globalFunction'
import mapviewer from 'utils/viewer'
let monitorBillboardUrl = {
  0: 'static/images/monitor_point_0.png',
  1: 'static/images/monitor_point_1.png',
  2: 'static/images/monitor_point_2.png',
  3: 'static/images/monitor_point_3.png',
  4: 'static/images/monitor_point_4.png',
  'other': 'static/images/monitor_point_gray.png',
  'devBasicId0': 'static/images/monitor_point_devBasicId0.png',
  'devBasicId1': 'static/images/monitor_point_devBasicId1.png'
}
let hiddenBillboardUrl = {
  0: 'static/images/hidden_point_0.png',
  1: 'static/images/hidden_point_1.png',
  2: 'static/images/hidden_point_2.png',
  3: 'static/images/hidden_point_3.png',
  4: 'static/images/hidden_point_4.png',
  'other': 'static/images/hidden_point_gray.png'
}
let pickedDynamicPictureEvent
let pickedEntity
let wheelTimeout
let cesiumJS = {
  monCount: 0,
  EARTH_RADIUS: 6378137.0,
  handler: '',
  prListener: '',
  eventInited: false,
  testPie: [],
  pointPrimitives: null,
  newData: [],
  tempHiddenInsideData: {},
  isHiddenHomePointSelected: false,
  hiddenId: 0,
  pnId: 0,
  ObjType: '',
  selectObj: {},
  ObjStatus: 0, // 判断点击隐患点或者监测点是否飞行
  locateToChina (vue) {
    let viewer = mapviewer.viewer
    let Cesium = vue.Cesium
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(107.12656, 30.72759, 10000000.0),
      duration: 1
    })
  },
  locateToXY (x, y, vue) {
    let viewer = mapviewer.viewer
    let Cesium = vue.Cesium
    let coord = globalFunction.gcj02towgs84(x, y)
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(coord[0], coord[1], 3000.0),
      duration: 3
    })
  },
  initMap (vue, page, isShowLegend) {
    let that = this
    let viewer = mapviewer.viewer
    let Cesium = vue.Cesium
    Cesium.Camera.DEFAULT_OFFSET = new Cesium.HeadingPitchRange(0, -90, 0)
    that.isHiddenHomePointSelected = false
    // 分页面初始化代码
    if (page === 'homePage') {
      // document.getElementById('globle-mask').style.display = 'block'
      setTimeout(() => {
        vue.$get('warnWeb/newHome/hiddenInfoInMap', {
          ...{}
        }).then((r) => {
          let data = r.data.data
          that.showHomeHiddenHighestWarnPoints(data, vue)
        })
      }, 1200)
      // 隐患风险等级
      setTimeout(() => {
        that.getHiddenInfo(vue, {})
        that.getMonInfo(vue, {})
      }, 2500)
      that.eventInited = false
      that.initHomeEvent(vue)
      that.removeHomeWheelEvent(vue)
      // viewer.camera.moveEnd.addEventListener(() => {
      //   //获取当前相机高度
      //   let extent = that.getCurrentExtent(vue)
      //   // if (extent.height < 200000) {
      //     if (Object.keys(extent).length > 1) {
      //       that.getHiddenInfo(vue, extent)
      //       that.getMonInfo(vue, extent)
      //     }
      //   // }
      //   console.log('地图变化监听事件',extent)
      // })
      // 根据地图高度切换图例显隐
      that.initHomeWheelEvent(vue, function (height) {
        // console.log('地图高度', height)
        if (height > 200000) {
          isShowLegend.devPoint = false
          isShowLegend.warnLevel = true
        } else {
          isShowLegend.devPoint = true
          isShowLegend.warnLevel = false
        }
      })
    } else if (page === 'RealTime') {
      that.removeHomeWheelEvent(vue)
      that.initRouteEvent(vue)
    } else if (page === 'SeoQuery') {
      document.getElementById('globle-mask').style.display = 'none'
      that.initRouteEvent(vue)
    }
    // 禁用双击事件
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
  },
  getPolygon (extent) {
    let geometry = '(' + extent.xmin + ' ' + extent.ymax + ',' +
    extent.xmax + ' ' + extent.ymax + ',' +
    extent.xmax + ' ' + extent.ymin + ',' +
    extent.xmin + ' ' + extent.ymin + ',' +
    extent.xmin + ' ' + extent.ymax + ')'
    console.log(geometry)
    return geometry
  },
  getHiddenInfo (vue, extent) {
    // 隐患点和监测点和隐患范围
    let that = this
    // let polygon = this.getPolygon(extent)
    vue.$get('warnWeb/homePage/getAdminInfo', {
      // ...{ cityCode: vue.cityCode, polygon: polygon }
      ...{ cityCode: vue.cityCode }
    }).then((r) => {
      let data = r.data.data
      that.showHiddenHomePoints(data.hiddenList, vue)
      // document.getElementById('globle-mask').style.display = 'none'
    })
  },
  getMonInfo (vue, extent) {
    let that = this
    // let polygon = this.getPolygon(extent)
    vue.$get('warnWeb/homePage/getAdminInfo2', {
      // ...{ cityCode: vue.cityCode, polygon: polygon }
      ...{ cityCode: vue.cityCode }
    }).then((r) => {
      let data = r.data.data
      // // 添加监测点数组
      that.addMonHomePoints(data.pnList, vue)
      // document.getElementById('globle-mask').style.display = 'none'
    })
  },
  initRouteEvent (vue) {
    let that = this
    let Cesium = vue.Cesium
    let viewer = mapviewer.viewer
    if (true) {
      that.eventInited = true
      // 实体点击事件
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)// 移除事件
      handler.setInputAction(function (evt) {
        var ray1 = viewer.camera.getPickRay(evt.position)
        var cartesian = viewer.scene.globe.pick(ray1, viewer.scene)
        let earthPosition = viewer.camera.pickEllipsoid(evt.position, viewer.scene.globe.ellipsoid)
        let cartographic = Cesium.Cartographic.fromCartesian(earthPosition)
        let lng = Cesium.Math.toDegrees(cartographic.longitude) // 经度值
        let lat = Cesium.Math.toDegrees(cartographic.latitude) // 纬度值
        let coord = globalFunction.wgs84togcj02(lng, lat)
        let pickedObjects = viewer.scene.drillPick(evt.position)
        let opdata = that.getDataList(pickedObjects)
        let r = {}
        r.longitude = lng
        r.latitude = lat
        if (!Cesium.defined(opdata) || opdata.length < 2) {
          that.doPickOther(opdata[0], vue)
        } else {
          that.showPointList(r, opdata, vue)
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }
  },
  doPickOther (pick, vue) {
    let that = this
    let Cesium = vue.Cesium
    let viewer = mapviewer.viewer
    console.log('单点')
    console.log(pick)
    let obj = {}
    if (Cesium.defined(pick) && (pick.name === 'hiddenPoint')) {
      obj = { type: 'hiddenPoint', id: pick.id, status: 0 }
      vue.getHiddenPointDetail(pick.id)
      that.locateToPoint(obj, vue, true)
      vue.locateToList(pick)
    } else if (Cesium.defined(pick) && (pick.name === 'monitorPoint')) {
      obj = { type: 'monitorPoint', id: pick.id, status: 0 }
      vue.getProjPnDetail(pick.id)
      that.locateToPoint(obj, vue, true)
      vue.locateToList(pick)
    } else {
      that.handler = ''
      if (that.prListener !== '') {
        vue.ispointsPanel = false
        viewer.scene.postRender.removeEventListener(that.prListener)
      }
    }
  },
  getCurrentExtent (vue) {
    // 范围对象
    let Cesium = vue.Cesium
    let viewer = mapviewer.viewer
    let extent = {}
    // 得到当前三维场景
    let scene = viewer.scene
    // 得到当前三维场景的椭球体
    var ellipsoid = scene.globe.ellipsoid
    var canvas = scene.canvas
    // canvas左上角
    var car3_lt = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, 0), ellipsoid)

    // canvas右下角
    var car3_rb = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(canvas.width, canvas.height), ellipsoid)

    // 当canvas左上角和右下角全部在椭球体上
    if (car3_lt && car3_rb) {
      var carto_lt = ellipsoid.cartesianToCartographic(car3_lt)
      var carto_rb = ellipsoid.cartesianToCartographic(car3_rb)
      extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude)
      extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude)
      extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude)
      extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude)
    } else if (!car3_lt && car3_rb) {
      var car3_lt2 = null
      var yIndex = 0
      do {
        // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
        yIndex <= canvas.height ? yIndex += 10 : canvas.height
        car3_lt2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, yIndex), ellipsoid)
      } while (!car3_lt2)
      var carto_lt2 = ellipsoid.cartesianToCartographic(car3_lt2)
      var carto_rb2 = ellipsoid.cartesianToCartographic(car3_rb)
      extent.xmin = Cesium.Math.toDegrees(carto_lt2.longitude)
      extent.ymax = Cesium.Math.toDegrees(carto_lt2.latitude)
      extent.xmax = Cesium.Math.toDegrees(carto_rb2.longitude)
      extent.ymin = Cesium.Math.toDegrees(carto_rb2.latitude)
    }
    // 获取高度
    extent.height = Math.ceil(viewer.camera.positionCartographic.height)
    return extent
  },
  initHomeEvent (vue) {
    let that = this
    let Cesium = vue.Cesium
    let viewer = mapviewer.viewer
    // 实体点击事件
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(function (evt) {
      var ray1 = viewer.camera.getPickRay(evt.position)
      var cartesian = viewer.scene.globe.pick(ray1, viewer.scene)
      let earthPosition = viewer.camera.pickEllipsoid(evt.position, viewer.scene.globe.ellipsoid)
      let cartographic = Cesium.Cartographic.fromCartesian(earthPosition)
      let lng = Cesium.Math.toDegrees(cartographic.longitude) // 经度值
      let lat = Cesium.Math.toDegrees(cartographic.latitude) // 纬度值
      let coord = globalFunction.wgs84togcj02(lng, lat)
      let pickedObjects = viewer.scene.drillPick(evt.position)
      let opdata = that.getDataList(pickedObjects)
      let r = {}
      r.longitude = lng
      r.latitude = lat
      if (!Cesium.defined(opdata) || opdata.length < 2) {
        that.doPick(opdata[0], vue)
      } else {
        if (Object.keys(that.selectObj).length !== 0) {
          that.locateToHomePagePoint(that.selectObj, vue, false)
        }
        that.showPointList(r, opdata, vue)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  },
  getDataList (pickData) {
    let data = []
    for (let index = 0; index < pickData.length; index++) {
      if (pickData[index].hasOwnProperty('collection')) {
        let obj = {}
        obj.id = JSON.parse(JSON.stringify(pickData[index].id.id))
        obj.name = JSON.parse(JSON.stringify(pickData[index].id.name))
        if (obj.name === 'highestWarnPoint') {
          console.log(pickData[index].id)
          obj.label = JSON.parse(JSON.stringify(pickData[index].id.attribute.projBasicName))
          obj.alarmCount = JSON.parse(JSON.stringify(pickData[index].id.attribute.alarmCount))
          obj.hiddenName = JSON.parse(JSON.stringify(pickData[index].id.attribute.hiddenName))
        } else if (obj.name === 'hiddenPoint') {
          obj.label = JSON.parse(JSON.stringify(pickData[index].id.label.text._value))
          obj.warnType = JSON.parse(JSON.stringify(pickData[index].id.attribute.warnType))
          obj.projBasicName = JSON.parse(JSON.stringify(pickData[index].id.attribute.projBasicName))
          obj.warnInformation = JSON.parse(JSON.stringify(pickData[index].id.attribute.warnInformation))
          obj.warnTime = JSON.parse(JSON.stringify(pickData[index].id.attribute.warnTime))
        } else if (obj.name === 'monitorPoint') {
          obj.label = JSON.parse(JSON.stringify(pickData[index].id.label.text._value))
          obj.warnType = JSON.parse(JSON.stringify(pickData[index].id.attribute.warnType))
          obj.pnName = JSON.parse(JSON.stringify(pickData[index].id.attribute.pnName))
          obj.warnInformation = JSON.parse(JSON.stringify(pickData[index].id.attribute.warnInformation))
          obj.warnTime = JSON.parse(JSON.stringify(pickData[index].id.attribute.warnTime))
        }
        obj.level = JSON.parse(JSON.stringify(pickData[index].id.attribute.level))
        obj.longitude = JSON.parse(JSON.stringify(pickData[index].id.attribute.longitude))
        obj.latitude = JSON.parse(JSON.stringify(pickData[index].id.attribute.latitude))
        data.push(obj)
      }
    }
    return data
  },
  doPick (pick, vue) {
    let that = this
    let Cesium = vue.Cesium
    let viewer = mapviewer.viewer
    console.log(that.selectObj)
    if (Object.keys(that.selectObj).length !== 0) {
      that.locateToHomePagePoint(that.selectObj, vue, false)
    }
    let obj = {}
    if (Cesium.defined(pick) && (pick.name === 'highestWarnPoint')) {
      if (pick !== undefined) {
        that.warnId = pick.id
      }
      that.showHighestWarnPointPopup(pick, vue)
    } else if (Cesium.defined(pick) && (pick.name === 'hiddenPoint')) {
      if (pick !== undefined) {
        that.hiddenId = pick.id
        that.ObjType = 'hiddenPoint'
        obj = { type: 'hiddenPoint', id: pick.id, status: 0 }
        that.locateToHomePagePoint(obj, vue, true)
      }
    } else if (Cesium.defined(pick) && (pick.name === 'monitorPoint')) {
      if (pick !== undefined) {
        that.pnId = pick.id
        that.ObjType = 'monitorPoint'
        obj = { type: 'monitorPoint', id: pick.id, status: 0 }
        that.locateToHomePagePoint(obj, vue, true)
      }
    } else {
      that.handler = ''
      if (that.prListener !== '') {
        viewer.scene.postRender.removeEventListener(that.prListener)
        vue.ismonHomePointPopup = false,
        vue.ishiddenHomePointPopup = false,
        vue.ishighestWarnPointPopup = false,
        vue.ispointsPanel = false
        if (that.ObjType !== '') {
          obj = ''
          if (that.ObjType === 'hiddenPoint') {
            obj = { type: that.ObjType, id: that.hiddenId, status: 0 }
          } else if (that.ObjType === 'monitorPoint') {
            obj = { type: that.ObjType, id: that.pnId, status: 0 }
          }
          that.locateToHomePagePoint(obj, vue, false)
        }
      }
    }
    that.selectObj = obj
  },
  clearPopup (vue) {
    this.handler = ''
    let viewer = mapviewer.viewer
    if (this.prListener !== '') {
      viewer.scene.postRender.removeEventListener(this.prListener)
      vue.ismonHomePointPopup = false,
      vue.ishiddenHomePointPopup = false,
      vue.ishighestWarnPointPopup = false,
      vue.ispointsPanel = false
    }
  },
  hiddenLayers (vue) {
    let viewer = mapviewer.viewer
    let layers = viewer.dataSources._dataSources
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].type === 'CustomDataSource') {
        viewer.dataSources.getByName(layers[i]._name)[0].show = false
      }
    }
    console.log(layers)
  },
  showHomeHiddenHighestWarnPoints (records, vue) {
    let Cesium = vue.Cesium
    let viewer = mapviewer.viewer
    let myEntityCollection = new Cesium.CustomDataSource('yhfxLayers')
    viewer.dataSources.add(myEntityCollection)
    myEntityCollection.type = 'CustomDataSource'
    for (let i = 0; i < records.length; i++) {
      let record = records[i]
      let entity = this.showHomeHiddenHighestWarnPoint(record, vue)
      myEntityCollection.entities.add(entity)
    }
  },
  showHomeHiddenHighestWarnPoint (record, vue) {
    let Cesium = vue.Cesium
    let viewer = mapviewer.viewer
    let lng = parseFloat(record.longitude)
    let lat = parseFloat(record.latitude)
    let coord = globalFunction.gcj02towgs84(lng, lat)
    record.longitude = coord[0]
    record.latitude = coord[1]
    let level = record.level
    let _color = '#ffffff'
    let name = 'highestWarnPoint'
    if (level === 1) {
      _color = 'rgb(79, 129, 233)'
    } else if (level === 2) {
      _color = 'rgb(235, 196, 61)'
    } else if (level === 3) {
      _color = 'rgb(247, 146, 65)'
    } else if (level === 4) {
      _color = 'rgb(255, 89, 90)'
    } else if (level === 0) {
      _color = '#00DAB5'
    } else {
      _color = 'gray'
    }
    let count = 0
    let clu = 0
    if (level !== 0) {
      count = record.alarmCount
      clu = Math.log(count) * 5 + 15
    } else {
      clu = 15
    }
    let options = {
      show: true,
      name: name,
      id: record.id,
      position: Cesium.Cartesian3.fromDegrees(coord[0], coord[1]),
      attribute: record,
      point: {
        show: true, // default
        color: Cesium.Color.fromCssColorString(_color).withAlpha(1), // default: WHITE
        pixelSize: clu, // default: 1
        outlineColor: Cesium.Color.fromCssColorString('#000000').withAlpha(0.5), // default: BLACK
        outlineWidth: 0, // default: 0
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(200000)
      }
    }
    let entity = new Cesium.Entity(options)
    return entity
  },
  /**
   *
   * @param {*} record
   * @param {*} vue
   */
  showHomeIncrementData (record, vue) { // 增量
    if (!record || record === null || !(record instanceof Object)) return
    let Cesium = vue.Cesium
    let viewer = mapviewer.viewer
    let entityCollection, entity
    if (record.warnType === 1) {
      entityCollection = viewer.dataSources.getByName('jcdLayers')[0]
     
      entity = entityCollection && entityCollection.entities.getById(record.pnId)
      if (entity) {
        this.updateMonHomePoint(record, vue, entity)
      } else {
        // 新增监测点
        this.addMonHomePoint({
          hiddenName: record.hiddenName,
          pnName: record.pnName,
          id: record.id,
          hiddenId: record.hiddenId,
          level: record.level,
          pnId: record.pnId,
          cityName: record.cityName,
          warnType: record.warnType,
          warnTime: record.warningTime,
          warningInformation: record.warningInformation,
          longitude: record.hiddenLongitude,
          latitude: record.hiddenLatitude
        }, vue, true)
      }
    } else if (record.warnType === 2) { // 安全预警 更新隐患点数据
      entityCollection = viewer.dataSources.getByName('yhdLayers')[0]
      entity = entityCollection && entityCollection.entities.getById(record.hiddenId)
      if (entity) {
        this.updateHiddenHomePoint(record, vue, entity)
      } else {
        // 新增隐患点
        this.addHiddenHomePoint({
          level: record.level,
          id: record.id,
          name: record.hiddenName,
          warnType: record.warnType,
          warnTime: record.warningTime,
          warningInformation: record.warningInformation,
          hiddenId: record.hiddenId,
          longitude: record.hiddenLongitude,
          latitude: record.hiddenLatitude
        }, vue, true)
      }
    }
  },
  initHomeWheelEvent (vue, callback) {
    let that = this
    let Cesium = vue.Cesium
    let viewer = mapviewer.viewer
    viewer.screenSpaceEventHandler.setInputAction(function (wheelment) {
      clearTimeout(wheelTimeout)
      wheelTimeout = setTimeout(() => {
        let height = Math.ceil(viewer.camera.positionCartographic.height)
        callback(height)
      }, 1000)
    }, Cesium.ScreenSpaceEventType.WHEEL)
  },
  removeHomeWheelEvent (vue) {
    let that = this
    let Cesium = vue.Cesium
    let viewer = mapviewer.viewer
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.WHEEL)
  },
  showSelectedHiddenFeatures (hiddenId, projBasicName, vue) {
    let that = this
    let viewer = mapviewer.viewer
    let layer = viewer.dataSources.getByName('yhdLayers')[0]
    let Cesium = vue.Cesium
    this.hiddenId = hiddenId
    that.isHiddenHomePointSelected = true
    let item = layer.entities.getById(hiddenId)
    viewer.flyTo(item, {
      duration: 0.5,
      offset: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90),
        range: 2000
      }
    })
  },
  showHiddenHomePoints (datalist, vue) {
    let Cesium = vue.Cesium
    let viewer = mapviewer.viewer
    let myEntityCollection = new Cesium.CustomDataSource('yhdLayers')
    let yhfwEntityCollection = new Cesium.CustomDataSource('yhfwLayers')
    if (viewer.dataSources.getByName('yhdLayers').length === 0) {
      viewer.dataSources.add(myEntityCollection)
      myEntityCollection.type = 'CustomDataSource'
    }
    if (viewer.dataSources.getByName('yhfwLayers').length === 0) {
      viewer.dataSources.add(yhfwEntityCollection)
      yhfwEntityCollection.type = 'CustomDataSource'
    }
    myEntityCollection.entities.removeAll()
    yhfwEntityCollection.entities.removeAll()
    for (let i = 0; i < datalist.length; i++) {
      let record = datalist[i]
      let prop = {
        id: record.id,
        longitude: record.longitude,
        latitude: record.latitude,
        name: record.name,
        projBasicName: record.projBasicName,
        level: record.level,
        warnTime: record.warnTime,
        warnInformation: record.warnInformation,
        warnType: record.type
      }
      this.addHiddenHomePoint(prop, vue)
      this.addHiddenHomePointScope(record.scope, vue)
    }
  },
  updateHiddenHomePoint (record, vue, entity) {
    let viewer = mapviewer.viewer
    let formerRecord = entity.attribute
    formerRecord.warnInformation = record.warningInformation
    formerRecord.warnTime = record.warningTime
    if (formerRecord.level !== record.level) {
      // 根据等级选择适应的图标，如果没有则默认灰色
      let _hiddlenBillboardUrl = hiddenBillboardUrl.other
      if (hiddenBillboardUrl[record.level]) {
        _hiddlenBillboardUrl = hiddenBillboardUrl[record.level]
      }
      console.log(_hiddlenBillboardUrl)
      entity.billboard.image = _hiddlenBillboardUrl
    }
    entity.billboard.color = undefined
    entity.billboard.color = this.alertUp(vue)
    setTimeout(() => {
      entity.billboard.color = undefined
    }, 30000)
  },
  addHiddenHomePoint (record, vue, isAlarm = false) {
    let Cesium = vue.Cesium
    let viewer = mapviewer.viewer
    let myEntityCollection = viewer.dataSources.getByName('yhdLayers')[0]
    let lng = parseFloat(record.longitude)
    let lat = parseFloat(record.latitude)
    // let coord = [lng, lat]
    let coord = globalFunction.gcj02towgs84(lng, lat)
    let prop = {
      longitude: coord[0],
      latitude: coord[1],
      id: record.hiddenId,
      type: 1,
      name: record.name,
      level: record.level,
      projBasicName: record.projBasicName,
      warnTime: record.warnTime,
      warnInformation: record.warnInformation,
      warnType: record.warnType
    }
    // 根据等级选择适应的图标，如果没有则默认灰色
    let _hiddlenBillboardUrl = hiddenBillboardUrl.other
    if (hiddenBillboardUrl[record.level]) {
      _hiddlenBillboardUrl = hiddenBillboardUrl[record.level]
    }
    let height = 0
    let positions = Cesium.Cartographic.fromDegrees(coord[0], coord[1])
    Cesium.when(new Cesium.sampleTerrain(viewer.terrainProvider, 14, [positions]), (updatedPositions) => {
      self.height = updatedPositions[0].height
      if (updatedPositions[0].height !== undefined) {
        height = updatedPositions[0].height
      }
      let options = {
        show: true,
        name: 'hiddenPoint',
        id: record.id,
        position: Cesium.Cartesian3.fromDegrees(coord[0], coord[1], height),
        attribute: prop,
        billboard: { // 图标
          image: _hiddlenBillboardUrl,
          scale: 0.9,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000)
        },
        label: { // 文字标签
          text: record.name,
          font: '800 28px Helvetica', // 15pt monospace
          scale: 0.5,
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 4,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -30), // 偏移量
          translucencyByDistance: new Cesium.NearFarScalar(
            1.5e2,
            1.0,
            1.5e8,
            0.0
          ),
          showBackground: false,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 20000)
        }
      }
      let entity = new Cesium.Entity(options)
      myEntityCollection.entities.add(entity)
      if (isAlarm) {
        entity.billboard.color = this.alertUp(vue)
        setTimeout(() => {
          entity.billboard.color = undefined
        })
      }
    })
  },
  addHiddenHomePointScope (data, vue) {
    let that = this
    let viewer = mapviewer.viewer
    let Cesium = vue.Cesium
    let myEntityCollection = viewer.dataSources.getByName('yhfwLayers')[0]
    if (data !== '' && data !== null) {
      let positions = that.transformCoord(data, vue)
      console.log(positions)
      let options = {
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(positions),
          material: new Cesium.Color.fromCssColorString('#FFD700').withAlpha(0.1)
        },
        polyline: {
          positions: positions.concat(positions[0]),
          clampToGround: true,
          width: 3,
          material: new Cesium.Color.fromCssColorString('#FFD700').withAlpha(1)
        }
      }
      let entity = new Cesium.Entity(options)
      myEntityCollection.entities.add(entity)
    }
  },
  transformCoord (data, vue) {
    let Cesium = vue.Cesium
    let data2 = data.split(',')
    let positions = []
    for (let i = 0; i < data2.length; i++) {
      let data2Array = data2[i].split(' ')
      let lng = parseFloat(data2Array[0])
      let lat = parseFloat(data2Array[1])
      let coord = globalFunction.gcj02towgs84(lng, lat)
      let item = Cesium.Cartesian3.fromDegrees(coord[0], coord[1], 0)
      positions.push(item)
    }
    return positions
  },
  addMonHomePoints (records, vue) {
    let Cesium = vue.Cesium
    let viewer = mapviewer.viewer
    let entityCollection = new Cesium.CustomDataSource('jcdLayers')
    if (viewer.dataSources.getByName('jcdLayers').length === 0) {
      viewer.dataSources.add(entityCollection)
      entityCollection.type = 'CustomDataSource'
    }
    entityCollection.entities.removeAll()
    let monitorPoints = records
    for (let i = 0; i < monitorPoints.length; i++) {
      let lng = parseFloat(monitorPoints[i].pnLongitude)
      let lat = parseFloat(monitorPoints[i].pnLatitude)
      let coord = globalFunction.gcj02towgs84(lng, lat)
      monitorPoints[i].longitude = coord[0]
      monitorPoints[i].latitude = coord[1]
      let record = monitorPoints[i]
      this.addMonHomePoint(record, vue)
    }
  },
  updateMonHomePoint (record, vue, entity) {
    let viewer = mapviewer.viewer
    let formerRecord = entity.attribute
    formerRecord.warnInformation = record.warningInformation
    if (formerRecord.level !== record.level) {
      let _monitorPointUrl = monitorBillboardUrl.other
      if (monitorBillboardUrl[record.level]) {
        _monitorPointUrl = monitorBillboardUrl[record.level]
      }
      entity.billboard.image = _monitorPointUrl
    }
    entity.billboard.color = undefined
    entity.billboard.color = this.alertUp(vue)
    setTimeout(() => {
      entity.billboard.color = undefined
    }, 30000)
  },
  addMonHomePoint (record, vue, isAlarm) {
    let Cesium = vue.Cesium
    let viewer = mapviewer.viewer
    let entityCollection = viewer.dataSources.getByName('jcdLayers')[0]
    let level = record.level
    // 新改监测点为图片的代码
    let _monitorPointUrl = ''
    if (record.isPhoto === 0) {
      if (monitorBillboardUrl[level]) {
        if (record.devBasicId === 0) {
          _monitorPointUrl = monitorBillboardUrl.other
        } else {
          if (record.basicOnline === 0) { // 设备在线
            _monitorPointUrl = monitorBillboardUrl[level]
          } else { // 设备离线
            _monitorPointUrl = monitorBillboardUrl.other
          }
        }
      }
    } else { // 相机设备
      if (record.devBasicId === 0) {
        _monitorPointUrl = monitorBillboardUrl.devBasicId0
      } else {
        _monitorPointUrl = monitorBillboardUrl.devBasicId1
      }
    }
    let height = 0
    let positions = Cesium.Cartographic.fromDegrees(record.longitude, record.latitude)
    Cesium.when(new Cesium.sampleTerrain(viewer.terrainProvider, 14, [positions]), (updatedPositions) => {
      self.height = updatedPositions[0].height
      if (updatedPositions[0].height !== undefined) {
        height = updatedPositions[0].height
      }
      let options = {
        name: 'monitorPoint',
        id: record.pnId,
        position: Cesium.Cartesian3.fromDegrees(record.longitude, record.latitude, height),
        attribute: record,
        billboard: { // 图标
          image: _monitorPointUrl,
          scale: 0.9,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000)
        },
        label: { // 文字标签
          text: record.pnName,
          font: '800 28px Helvetica', // 15pt monospace
          scale: 0.5,
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 4,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -35), // 偏移量
          translucencyByDistance: new Cesium.NearFarScalar(
            1.5e2,
            1.0,
            1.5e8,
            0.0
          ),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 20000),
          showBackground: false
        }
      }
      let entity = new Cesium.Entity(options)
      entityCollection.entities.add(entity)
      if (isAlarm) {
        entity.billboard.color = this.alertUp(vue)
        setTimeout(() => {
          entity.billboard.color = undefined
        })
      }
    })
  },
  // 日告警等级弹出框
  showHighestWarnPointPopup (record, vue) {
    let that = this
    let viewer = mapviewer.viewer
    let Cesium = vue.Cesium
    if (that.prListener !== '') {
      viewer.scene.postRender.removeEventListener(that.prListener)
      vue.ismonHomePointPopup = false,
      vue.ishiddenHomePointPopup = false,
      vue.ishighestWarnPointPopup = false,
      vue.ispointsPanel = false
    }
    vue.ishighestWarnPointPopup = true
    let _color = '#ffffff'
    let text = ''
    if (record.level === 1) {
      _color = 'rgb(79, 129, 233)'
      text = '蓝色注意&nbsp;' + record.alarmCount
    } else if (record.level === 2) {
      _color = 'rgb(235, 196, 61)'
      text = '黄色警示&nbsp;' + record.alarmCount
    } else if (record.level === 3) {
      _color = 'rgb(247, 146, 65)'
      text = '橙色警报&nbsp;' + record.alarmCount
    } else if (record.level === 4) {
      _color = 'rgb(255, 89, 90)'
      text = '红色警报&nbsp;' + record.alarmCount
    } else if (record.level === 0) {
      _color = '#00DAB5'
      text = '无警告'
    }
    document.getElementById('hwpp-proj').innerHTML = record.label
    document.getElementById('hwpp-hidden').innerHTML = record.hiddenName
    document.getElementById('warnPointInfo').innerHTML = text
    document.getElementById('warnPointInfo').style.color = _color
    that.prListener = function () {
      let lng = record.longitude
      let lat = record.latitude
      let pp = new Cesium.Cartesian3.fromDegrees(lng, lat, 0)
      let changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, pp)
      let x = changedC.x // - ($('#trackPopUpContent').width()) / 2;
      let y = changedC.y // - ($('#trackPopUpContent').height());
      vue.highestWarnPosition.left = x + 20 + 'px'
      vue.highestWarnPosition.top = y - 60 + 'px'
    }
    that.handler = viewer.scene.postRender.addEventListener(that.prListener)
  },
  showHiddenHomePointPopup (record, vue) {
    let that = this
    let viewer = mapviewer.viewer
    let Cesium = vue.Cesium
    if (that.prListener !== '') {
      viewer.scene.postRender.removeEventListener(that.prListener)
      vue.ismonHomePointPopup = false,
      vue.ishiddenHomePointPopup = false,
      vue.ishighestWarnPointPopup = false,
      vue.ispointsPanel = false
    }
    vue.ishiddenHomePointPopup = true
    let _color = '#ffffff'
    if (record.level === 1) {
      _color = 'rgb(79, 129, 233)'
    } else if (record.level === 2) {
      _color = 'rgb(235, 196, 61)'
    } else if (record.level === 3) {
      _color = 'rgb(247, 146, 65)'
    } else if (record.level === 4) {
      _color = 'rgb(255, 89, 90)'
    } else if (record.level === 0) {
      _color = '#00DAB5'
    }
    let type = record.warnType
    let typeText = ''
    if (type === 1) {
      typeText = '设备预警'
    } else if (type === 2) {
      typeText = '模型预警'
    } else if (type === 3) {
      typeText = '宏观群查'
    } else if (type === 4) {
      typeText = '定量群测'
    }
    document.getElementById('hhpp-proj').innerHTML = record.projBasicName
    document.getElementById('hhpp-hidden').innerHTML = record.label
    document.getElementById('hidden-point-value').innerHTML = record.warnInformation
    document.getElementById('hidden-point-time').innerHTML = record.warnTime
    document.getElementById('hidden-point-value').style.color = _color
    document.getElementById('hidden-point-warn-type').innerHTML = typeText
    if (record.level === 0) {
      document.getElementById('hidden-point-time').innerHTML = '无告警'
    }
    that.prListener = function () {
      let lng = record.longitude
      let lat = record.latitude
      let pp = new Cesium.Cartesian3.fromDegrees(lng, lat, 0)
      let changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, pp)
      let x = changedC.x // - ($('#trackPopUpContent').width()) / 2;
      let y = changedC.y // - ($('#trackPopUpContent').height());
      vue.hiddenPosition.left = x + 20 + 'px'
      vue.hiddenPosition.top = y - 60 + 'px'
    }
    that.handler = viewer.scene.postRender.addEventListener(that.prListener)
  },
  showPointList (record, data, vue) {
    let points = data
    let that = this
    let viewer = mapviewer.viewer
    let Cesium = vue.Cesium
    console.log(data)
    if (that.prListener !== '') {
      viewer.scene.postRender.removeEventListener(that.prListener)
      vue.ismonHomePointPopup = false,
      vue.ishiddenHomePointPopup = false,
      vue.ishighestWarnPointPopup = false,
      vue.ispointsPanel = false
    }
    vue.PointsList = data
    that.prListener = function () {
      let lng = record.longitude
      let lat = record.latitude
      let pp = new Cesium.Cartesian3.fromDegrees(lng, lat, 0)
      let changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, pp)
      if (changedC) {
        vue.ispointsPanel = true
        let x = changedC.x // - ($('#trackPopUpContent').width()) / 2;
        let y = changedC.y // - ($('#trackPopUpContent').height());
        vue.position.left = x + 20 + 'px'
        vue.position.top = y - 60 + 'px'
      }
    }
    that.handler = viewer.scene.postRender.addEventListener(that.prListener)
  },
  showMonitorHomePointPopup (record, vue) {
    let that = this
    let viewer = mapviewer.viewer
    let Cesium = vue.Cesium
    if (that.prListener !== '') {
      viewer.scene.postRender.removeEventListener(that.prListener)
      vue.ismonHomePointPopup = false,
      vue.ishiddenHomePointPopup = false,
      vue.ishighestWarnPointPopup = false,
      vue.ispointsPanel = false
    }
    vue.ismonHomePointPopup = true
    let _color = '#ffffff'
    if (record.level === 1) {
      _color = 'rgb(79, 129, 233)'
    } else if (record.level === 2) {
      _color = 'rgb(235, 196, 61)'
    } else if (record.level === 3) {
      _color = 'rgb(247, 146, 65)'
    } else if (record.level === 4) {
      _color = 'rgb(255, 89, 90)'
    } else if (record.level === 0) {
      _color = '#00DAB5'
    }
    let type = record.warnType
    let typeText = ''
    if (type === 1) {
      typeText = '设备预警'
    } else if (type === 2) {
      typeText = '模型预警'
    } else if (type === 3) {
      typeText = '宏观群查'
    } else if (type === 4) {
      typeText = '定量群测'
    }
    document.getElementById('mon-point-name').innerHTML = record.pnName
    document.getElementById('mon-point-value').innerHTML = record.warnInformation
    document.getElementById('mon-point-time').innerHTML = record.warnTime
    document.getElementById('mon-point-value').style.color = _color
    document.getElementById('mon-point-warn-type').innerHTML = typeText
    if (record.level === 0) {
      document.getElementById('mon-point-time').innerHTML = '无告警'
    }
    that.prListener = function () {
      let lng = record.longitude
      let lat = record.latitude
      let pp = new Cesium.Cartesian3.fromDegrees(lng, lat, 0)
      let changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, pp)
      let x = changedC.x // - ($('#trackPopUpContent').width()) / 2;
      let y = changedC.y // - ($('#trackPopUpContent').height());
      vue.monPosition.left = x + 20 + 'px'
      vue.monPosition.top = y - 60 + 'px'
    }
    that.handler = viewer.scene.postRender.addEventListener(that.prListener)
  },
  showWarnData (data, vue) {
    let viewer = mapviewer.viewer
    let Cesium = vue.Cesium
    this.monCount = -1
    for (let i = 0; i < data.length; i++) {
      this.monCount++
      data[i].queue = this.monCount
      this.addWarnPoint(data[i], vue)
    }
  },
  showIncrementWarnData (data, vue) {
    if (vue.$route.path === '/warn/RealTime') {
      for (let i = 0; i < data.length; i++) {
        console.log(data)
        this.monCount++
        data.queue = this.monCount
        this.addWarnPoint(data[i], vue)
      }
    }
  },
  addWarnPoint (record, vue) {
    let viewer = mapviewer.viewer
    let Cesium = vue.Cesium
    let lng = parseFloat(record.longitude)
    let lat = parseFloat(record.latitude)
    let coord = globalFunction.gcj02towgs84(lng, lat)
    record.longitude = coord[0]
    record.latitude = coord[1]
    let warnLevel = record.warnLevel
    let _color = '#ffffff'
    let name = 'warnPoint'
    if (warnLevel === 1) {
      _color = '#3281e2'
    } else if (warnLevel === 2) {
      _color = '#f5ce58'
    } else if (warnLevel === 3) {
      _color = '#f3a25b'
    } else if (warnLevel === 4) {
      _color = '#c2191f'
    } else {
      _color = '#00A000'
    }
    let type = record.type
    if (type === '1') {
      name = 'equip'
    } else if (type === '2') {
      name = 'model'
    } else if (type === '3') {
      name = 'wide'
    } else if (type === '4') {
      name = 'ration'
    } else {
      name = 'test2'
    }
    let height = 0
    let positions = Cesium.Cartographic.fromDegrees(coord[0], coord[1])
    Cesium.when(new Cesium.sampleTerrain(viewer.terrainProvider, 14, [positions]), (updatedPositions) => {
      self.height = updatedPositions[0].height
      if (updatedPositions[0].height !== undefined) {
        height = updatedPositions[0].height
      }
      viewer.entities.add({
        show: true,
        name: name,
        id: record.alarmId,
        position: Cesium.Cartesian3.fromDegrees(coord[0], coord[1], height),
        attribute: record,
        point: {
          show: true, // default
          color: Cesium.Color.fromCssColorString(_color).withAlpha(1), // default: WHITE
          pixelSize: 25, // default: 1
          outlineColor: Cesium.Color.fromCssColorString('#ffffff').withAlpha(0.3), // default: BLACK
          outlineWidth: 1 // default: 0
        }
      })
    })
  },
  showProjData (records, vue, isShowMon) {
    let viewer = mapviewer.viewer
    this.clearMap(vue)
    for (let i = 0; i < records.length; i++) {
      this.addHiddenPoint(records[i], vue, isShowMon, false)
    }
  },
  saveHiddenData (records) {
    this.tempHiddenInsideData = records
  },
  showHiddenData (records, vue) {
    let that = this
    that.clearMap(vue)
    for (let i = 0; i < records.length; i++) {
      that.addHiddenPoint(records[i], vue, false, false)
    }
  },
  showMonData (records, vue) {
    // 重构数据
    this.restructureData(records, vue)
  },
  restructureData (records, vue) {
    let that = this
    that.newData = []
    for (let i = 0; i < records.length; i++) {
      let hiddenPoint = {
        hiddenId: records[i].hiddenId,
        hiddenLatitude: records[i].hiddenLatitude,
        hiddenLongitude: records[i].hiddenLongitude,
        hiddenName: records[i].hiddenName
      }
      if (that.isUnique(hiddenPoint)) {
        that.newData.push(hiddenPoint)
      }
    }
    for (let i = 0; i < that.newData.length; i++) {
      let basicDtoList = []
      for (let j = 0; j < records.length; j++) {
        if (that.newData[i].hiddenId === records[j].hiddenId) {
          basicDtoList.push(records[j])
        }
      }
      that.newData[i].children = basicDtoList
    }
    that.showEquip(that.newData, vue)
  },
  showEquip (data, vue) {
    let that = this
    // 清空所有实体
    that.clearMap(vue)
    for (let i = 0; i < data.length; i++) {
      that.addHiddenPoint(data[i], vue, true, true)
    }
  },
  isUnique (hiddenPoint) {
    let that = this
    let boo = true
    for (let i = 0; i < that.newData.length; i++) {
      if (that.newData[i].hiddenId === hiddenPoint.hiddenId) {
        boo = false
      }
    }
    return boo
  },
  addHiddenPoint (record, vue, isShowMon, isInMon) {
    let Cesium = vue.Cesium
    let viewer = mapviewer.viewer
    let coord = []
    if (isInMon) {
      let lng = parseFloat(record.hiddenLongitude)
      let lat = parseFloat(record.hiddenLatitude)
      coord = globalFunction.gcj02towgs84(lng, lat)
      record.id = record.hiddenId
    } else {
      let lng = parseFloat(record.longitude)
      let lat = parseFloat(record.latitude)
      coord = globalFunction.gcj02towgs84(lng, lat)
    }
    let prop = {
      longitude: coord[0],
      latitude: coord[1],
      id: record.id,
      type: 1,
      name: record.name,
      projBasicName: '',
      level: '',
      warnTime: '',
      warnInformation: '',
      warnType: ''
    }
    let height = 0
    let positions = Cesium.Cartographic.fromDegrees(coord[0], coord[1])
    Cesium.when(new Cesium.sampleTerrain(viewer.terrainProvider, 14, [positions]), (updatedPositions) => {
      self.height = updatedPositions[0].height
      if (updatedPositions[0].height !== undefined) {
        height = updatedPositions[0].height
      }
      viewer.entities.add({
        show: true,
        name: 'hiddenPoint',
        id: record.id,
        position: Cesium.Cartesian3.fromDegrees(coord[0], coord[1], height),
        attribute: prop,
        billboard: { // 图标
          image: 'static/images/hidden_point_0.png',
          scale: 0.9
        },
        label: { // 文字标签
          text: record.name,
          font: '800 28px Helvetica', // 15pt monospace
          scale: 0.5,
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 4,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -30), // 偏移量
          translucencyByDistance: new Cesium.NearFarScalar(
            1.5e2,
            1.0,
            1.5e8,
            0.0
          ),
          showBackground: false
        }
      })
      if (isShowMon) {
        if (record.children.length === 0) {
          viewer.flyTo(viewer.entities, { duration: 1 })
        }
      }
    })
    if (isShowMon) {
      this.addMonitorPoint(record, vue, isInMon, false)
    }
  },
  addMonitorPoint (record, vue, isInMon, isInHidden) {
    let Cesium = vue.Cesium
    let viewer = mapviewer.viewer
    let hiddenLon = ''
    let hiddenLat = ''
    let monitorPoints = []
    if (isInMon) {
      let coord = globalFunction.gcj02towgs84(parseFloat(record.hiddenLongitude), parseFloat(record.hiddenLatitude))
      hiddenLon = coord[0]
      hiddenLat = coord[1]
      monitorPoints = record.children
    } else {
      let coord = globalFunction.gcj02towgs84(parseFloat(record.longitude), parseFloat(record.latitude))
      hiddenLon = coord[0]
      hiddenLat = coord[1]
      monitorPoints = record.children
    }
    if (isInHidden) { // 隐患点内数据
      let coord = globalFunction.gcj02towgs84(record.lng, record.lat)
      hiddenLon = coord[0]
      hiddenLat = coord[1]
      monitorPoints = record.data.pnList
    }
    for (let i = 0; i < monitorPoints.length; i++) {
      let lng = parseFloat(monitorPoints[i].longitude)
      let lat = parseFloat(monitorPoints[i].latitude)
      let coord = globalFunction.gcj02towgs84(lng, lat)
      monitorPoints[i].longitude = coord[0]
      monitorPoints[i].latitude = coord[1]
      let id = 0
      // 不同接口id参数名不同，接口未统一
      if (isInHidden) { // 隐患点内数据
        id = monitorPoints[i].projPnId
      } else {
        id = monitorPoints[i].id
      }
      let name = monitorPoints[i].name
      let prop = {
        longitude: coord[0],
        latitude: coord[1],
        id: id,
        type: 2,
        pnName: name,
        projBasicName: '',
        level: '',
        warnTime: '',
        warnInformation: '',
        warnType: ''
      }
      let height = 0
      let positions = Cesium.Cartographic.fromDegrees(coord[0], coord[1])
      Cesium.when(new Cesium.sampleTerrain(viewer.terrainProvider, 14, [positions]), (updatedPositions) => {
        self.height = updatedPositions[0].height
        if (updatedPositions[0].height !== undefined) {
          height = updatedPositions[0].height
        }
        viewer.entities.add({
          // show: isShowMon,
          name: 'monitorPoint',
          id: id,
          position: Cesium.Cartesian3.fromDegrees(coord[0], coord[1], height),
          attribute: prop,
          billboard: { // 图标
            image: 'static/images/monitor_point_0.png',
            scale: 0.9
          },
          label: { // 文字标签
            text: monitorPoints[i].name,
            font: '800 28px Helvetica', // 15pt monospace
            scale: 0.5,
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 4,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(0, -30), // 偏移量
            translucencyByDistance: new Cesium.NearFarScalar(
              1.5e2,
              1.0,
              1.5e8,
              0.0
            ),
            showBackground: false
          }
        })
        viewer.flyTo(viewer.entities, { duration: 1 })
      })
      // 添加关联曲线
      this.addPolyDash(monitorPoints[i], hiddenLon, hiddenLat, vue)
    }
  },
  showHiddenInside (records, vue, id) {
    this.clearMonitorPoints(vue, id)
    this.addMonitorPoint(records, vue, false, true)
    console.log('隐患点内数据')
    console.log(records)
  },
  clearMonitorPoints (vue, id) { // 先清空所有数据，再重新加载对于分页的隐患的
    let viewer = mapviewer.viewer
    this.showHiddenData(this.tempHiddenInsideData, vue)
    let len = viewer.entities._entities._array.length
    let that = this
    for (let i = 0; i < len; i++) {
      let item = viewer.entities._entities._array[i]
      if (item._name === 'monitorPoint') {
        item._billboard._image._value = 'static/images/monitor_point_0.png'
      }
      if (item._name === 'hiddenPoint') {
        item._billboard._image._value = 'static/images/hidden_point_0.png'
      }
    }
    for (let i = 0; i < len; i++) {
      let item = viewer.entities._entities._array[i]
      if (item.attribute.id === id) {
        if (item._name === 'hiddenPoint') {
          item._billboard._image._value = 'url("static/images/hidden_point_dynamic.png")'
        } else if (item._name === 'monitorPoint') {
          item._billboard._image._value = 'static/images/monitorPointSelected.png'
        }
      }
    }
  },
  showDistChart (records, vue) {
    let that = this
    let viewer = mapviewer.viewer
    let Cesium = vue.Cesium
    let chartId = ''
    for (let j = 0; j < records.length; j++) {
      chartId = 'distChart' + j
      document.getElementById('popup').innerHTML += "<div id='" + chartId + "' class='chart-popup' style='color:#ffffff;width:100px;height:100px;'></div>"
      that.testPie.push([{ name: '在实施项目', value: records[j].historyCount }, { name: '待实施项目', value: records[j].incompleteCount }])
    }
    for (let i = 0; i < records.length; i++) {
      let myChart = vue.$echarts.init(document.getElementById('distChart' + i))
      let option = {
        series: [
          {
            name: records[i].proviceName,
            type: 'pie',
            radius: '55%',
            center: ['40%', '50%'],
            data: that.testPie[i],
            labelLine: {
              show: false
            },
            label: {
              show: false
            },
            color: ['#18BBB2', '#E5CD7E'],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        }
      }
      myChart.setOption(option, true)
    }
    that.prListener = function () {
      for (let k = 0; k < records.length; k++) {
        let record = records[k]
        let lng = record.longitude
        let lat = record.latitude
        let pp = new Cesium.Cartesian3.fromDegrees(lng, lat, 0)
        let changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, pp)
        document.getElementById(chartId).style.display = 'block'
        that.positionPopUp(changedC, 'distChart' + k) // Initial position
      }
    }
    that.handler = viewer.scene.postRender.addEventListener(that.prListener)
    document.getElementById('popup').style.display = 'block'
  },
  positionPopUp (c, id) {
    let x = c.x // - ($('#trackPopUpContent').width()) / 2;
    let y = c.y // - ($('#trackPopUpContent').height());
    document.getElementById(id).style.position = 'absolute'
    document.getElementById(id).style.left = x - 60 + 'px'
    document.getElementById(id).style.top = y - 60 + 'px'
  },
  showAlertPoint (lng, lat, id, warnLevel, vue) {
    let icon = 'alerm_orange'
    // 1.蓝色2.黄色3.橙色4.红色
    if (warnLevel === 1) {
      icon = 'alerm_blue'
    } else if (warnLevel === 2) {
      icon = 'alerm_yellow'
    } else if (warnLevel === 3) {
      icon = 'alerm_orange'
    } else if (warnLevel === 4) {
      icon = 'alerm_red'
    }
    let viewer = mapviewer.viewer
    let Cesium = vue.Cesium
    viewer.entities.removeById('warnSelectedPoint')
    let properties = {
      pnId: id
    }
    let alertPoint = viewer.entities.add({
      id: 'warnSelectedPoint',
      name: 'warnSelectedPoint',
      position: Cesium.Cartesian3.fromDegrees(lng, lat),
      attribute: properties,
      billboard: { // 图标
        image: 'static/images/' + icon + '.png',
        width: 80,
        height: 80,
        color: this.alertUp(vue),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      }
    })
    viewer.flyTo(alertPoint, {
      duration: 0.5,
      offset: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90),
        range: 5000
      }
    })
    return alertPoint
  },
  alertUp (vue) {
    let Cesium = vue.Cesium
    let x = 1
    let flog = true
    let alertUp = new Cesium.CallbackProperty(function () {
      if (flog) {
        x = x - 0.05
        if (x <= 0) {
          flog = false
        }
      } else {
        x = x + 0.05
        if (x >= 1) {
          flog = true
        }
      }
      return Cesium.Color.fromCssColorString('#f0f0f0').withAlpha(x)
    }, false)
    return alertUp
  },
  createDynamicPicture () {
    let dynamicPictureDom = document.getElementById('earth_dynamic_picture')
    if (!dynamicPictureDom) {
      dynamicPictureDom = document.createElement('div')
      dynamicPictureDom.id = 'earth_dynamic_picture'
      dynamicPictureDom.style = 'position:absolute;height:74px;width:39px;z-index:2000;left:0;top:0'
      document.body.appendChild(dynamicPictureDom)
    }
    dynamicPictureDom.style.display = 'block'
    return dynamicPictureDom
  },
  clearDynamicPicture () {
    let dynamicPictureDom = document.getElementById('earth_dynamic_picture')
    if (dynamicPictureDom) {
      document.body.removeChild(dynamicPictureDom)
    }
  },
  bindDynamicPictureEvent (viewer, Cesium, obj) {
    if (pickedDynamicPictureEvent) {
      viewer.scene.postRender.removeEventListener(pickedDynamicPictureEvent)
    }
    pickedDynamicPictureEvent = function () {
      let position = obj.position
      if (viewer.terrainProvider.availability) {
        let cartographic = Cesium.Cartographic.fromCartesian(position)
        let height = viewer.scene.globe.getHeight(cartographic)
        position = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          height
        )
      }
      let canvasPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        viewer.scene,
        position
      )
      if (Cesium.defined(canvasPosition)) {
        if (obj.type === 'hiddenPoint') {
          obj.pickedDiv.style.top = canvasPosition.y + 25 + 'px'
          obj.pickedDiv.style.left = canvasPosition.x - 15 + 'px'
        } else {
          obj.pickedDiv.style.top = canvasPosition.y + 12 + 'px'
          obj.pickedDiv.style.left = canvasPosition.x - 15 + 'px'
        }
      }
    }
    viewer.scene.postRender.addEventListener(pickedDynamicPictureEvent)
  },
  /**
   * 主页实体定位
   * @param {*} obj
   * @param {*} vue
   */
  locateToHomePagePoint (obj, vue, flag = true) {
    console.log(obj)
    let that = this
    let viewer = mapviewer.viewer
    let Cesium = vue.Cesium
    this.ObjStatus = obj.status
    this.ObjType = obj.type
    let pickedDiv = this.createDynamicPicture()
    if (obj && obj.type) {
      switch (obj.type) {
        case 'monitorPoint':
          let monitorCollection = viewer.dataSources.getByName('jcdLayers')[0]
          if (monitorCollection === undefined) {
            vue.$message.warning('请等待地图资源加载完成...')
            return
          }
          let monitorEntity = monitorCollection.entities.getById(obj.id)
          console.log(monitorEntity)
          if (monitorEntity) {
            if (flag) {
              this.pnId = JSON.parse(JSON.stringify(monitorEntity.id))
              let pobj = {}
              pobj.id = JSON.parse(JSON.stringify(monitorEntity.id))
              pobj.name = JSON.parse(JSON.stringify(monitorEntity.name))
              pobj.label = JSON.parse(JSON.stringify(monitorEntity.label.text._value))
              pobj.warnType = JSON.parse(JSON.stringify(monitorEntity.attribute.warnType))
              pobj.pnName = JSON.parse(JSON.stringify(monitorEntity.attribute.pnName))
              pobj.warnInformation = JSON.parse(JSON.stringify(monitorEntity.attribute.warnInformation))
              pobj.warnTime = JSON.parse(JSON.stringify(monitorEntity.attribute.warnTime))
              pobj.level = JSON.parse(JSON.stringify(monitorEntity.attribute.level))
              pobj.longitude = JSON.parse(JSON.stringify(monitorEntity.attribute.longitude))
              pobj.latitude = JSON.parse(JSON.stringify(monitorEntity.attribute.latitude))
              // 先隐藏定位点的图片
              monitorEntity.billboard.show = false
              // 将之前拾取的实体图片显示
              if (pickedEntity) {
                pickedEntity.billboard.show = true
              }
              // 换成新的拾取实体
              pickedEntity = monitorEntity
              let isPhoto = JSON.parse(JSON.stringify(monitorEntity.attribute.isPhoto))
              if (isPhoto === 0) {
                pickedDiv.style.backgroundImage = 'url("static/images/monitor_point_dynamic.png")'
              } else {
                pickedDiv.style.backgroundImage = 'url("static/images/monitor_point_devBasicId_dynamic.png")'
              }
              pickedDiv.style.height = '74px'
              this.bindDynamicPictureEvent(viewer, Cesium, {
                'pickedDiv': pickedDiv,
                'position': Cesium.Cartesian3.fromDegrees(pobj.longitude, pobj.latitude, 0),
                'type': 'monitorPoint'
              })
              that.showMonitorHomePointPopup(pobj, vue)
            } else {
              if (pickedEntity) {
                pickedEntity.billboard.show = true
                pickedEntity = undefined
              }
              pickedDiv.style.display = 'none'
              if (pickedDynamicPictureEvent) {
                viewer.scene.postRender.addEventListener(pickedDynamicPictureEvent)
                pickedDynamicPictureEvent = undefined
              }
            }
            if (obj.status !== 0) {
              viewer.flyTo(monitorEntity, {
                duration: 1,
                offset: {
                  heading: Cesium.Math.toRadians(0.0),
                  pitch: Cesium.Math.toRadians(-90),
                  range: 500
                }
              })
            }
          }
          break
        case 'hiddenPoint': // 隐患点
          let hiddlenCollection = viewer.dataSources.getByName('yhdLayers')[0]
          if (hiddlenCollection === undefined) {
            vue.$message.warning('请等待地图资源加载完成...')
            return
          }
          let hiddlenEntity = hiddlenCollection.entities.getById(obj.id)
          console.log(hiddlenEntity)
          if (hiddlenCollection && hiddlenEntity) {
            if (flag) {
              this.hiddenId = JSON.parse(JSON.stringify(hiddlenEntity.id))
              let pobj = {}
              pobj.id = JSON.parse(JSON.stringify(hiddlenEntity.id))
              pobj.name = JSON.parse(JSON.stringify(hiddlenEntity.name))
              pobj.label = JSON.parse(JSON.stringify(hiddlenEntity.label.text._value))
              pobj.warnType = JSON.parse(JSON.stringify(hiddlenEntity.attribute.warnType))
              pobj.projBasicName = JSON.parse(JSON.stringify(hiddlenEntity.attribute.projBasicName))
              pobj.warnInformation = JSON.parse(JSON.stringify(hiddlenEntity.attribute.warnInformation))
              pobj.warnTime = JSON.parse(JSON.stringify(hiddlenEntity.attribute.warnTime))
              pobj.level = JSON.parse(JSON.stringify(hiddlenEntity.attribute.level))
              pobj.longitude = JSON.parse(JSON.stringify(hiddlenEntity.attribute.longitude))
              pobj.latitude = JSON.parse(JSON.stringify(hiddlenEntity.attribute.latitude))
              hiddlenEntity.billboard.show = false
              if (pickedEntity) {
                pickedEntity.billboard.show = true
              }
              pickedEntity = hiddlenEntity
              pickedDiv.style.backgroundImage = 'url("static/images/hidden_point_dynamic.png")'
              pickedDiv.style.height = '58px'
              this.bindDynamicPictureEvent(viewer, Cesium, {
                'pickedDiv': pickedDiv,
                'position': Cesium.Cartesian3.fromDegrees(pobj.longitude, pobj.latitude, 0),
                'type': 'hiddenPoint'
              })
              that.showHiddenHomePointPopup(pobj, vue)
            } else {
              if (pickedEntity) {
                pickedEntity.billboard.show = true
                pickedEntity = undefined
              }
              pickedDiv.style.display = 'none'
              if (pickedDynamicPictureEvent) {
                viewer.scene.postRender.addEventListener(pickedDynamicPictureEvent)
                pickedDynamicPictureEvent = undefined
              }
            }
            if (obj.status !== 0) {
              viewer.flyTo(hiddlenEntity, {
                duration: 1,
                offset: {
                  heading: Cesium.Math.toRadians(0.0),
                  pitch: Cesium.Math.toRadians(-90),
                  range: 5000
                }
              })
            }
          }
      }
    }
  },

  /**
   * 其他页面实体定位
   * @param {*} obj
   * @param {*} vue
   */
  locateToPoint (obj, vue, flag = true) {
    console.log(obj)
    let that = this
    let viewer = mapviewer.viewer
    let Cesium = vue.Cesium
    this.ObjStatus = obj.status
    this.ObjType = obj.type
    let pickedDiv = this.createDynamicPicture()
    if (obj && obj.type) {
      switch (obj.type) {
        case 'monitorPoint':
          let monitorEntity = viewer.entities.getById(obj.id)
          console.log(monitorEntity)
          if (monitorEntity) {
            if (flag) {
              this.pnId = JSON.parse(JSON.stringify(monitorEntity.id))
              let pobj = {}
              pobj.id = JSON.parse(JSON.stringify(monitorEntity.id))
              pobj.name = JSON.parse(JSON.stringify(monitorEntity.name))
              pobj.label = JSON.parse(JSON.stringify(monitorEntity.label.text._value))
              pobj.warnType = JSON.parse(JSON.stringify(monitorEntity.attribute.warnType))
              pobj.pnName = JSON.parse(JSON.stringify(monitorEntity.attribute.pnName))
              pobj.warnInformation = JSON.parse(JSON.stringify(monitorEntity.attribute.warnInformation))
              pobj.warnTime = JSON.parse(JSON.stringify(monitorEntity.attribute.warnTime))
              pobj.level = JSON.parse(JSON.stringify(monitorEntity.attribute.level))
              pobj.longitude = JSON.parse(JSON.stringify(monitorEntity.attribute.longitude))
              pobj.latitude = JSON.parse(JSON.stringify(monitorEntity.attribute.latitude))
              // 先隐藏定位点的图片
              monitorEntity.billboard.show = false
              // 将之前拾取的实体图片显示
              if (pickedEntity) {
                pickedEntity.billboard.show = true
              }
              // 换成新的拾取实体
              pickedEntity = monitorEntity
              pickedDiv.style.backgroundImage = 'url("static/images/monitor_point_dynamic.png")'
              pickedDiv.style.height = '74px'
              this.bindDynamicPictureEvent(viewer, Cesium, {
                'pickedDiv': pickedDiv,
                'position': Cesium.Cartesian3.fromDegrees(pobj.longitude, pobj.latitude, 0),
                'type': 'monitorPoint'
              })
            } else {
              if (pickedEntity) {
                pickedEntity.billboard.show = true
                pickedEntity = undefined
              }
              pickedDiv.style.display = 'none'
              if (pickedDynamicPictureEvent) {
                viewer.scene.postRender.addEventListener(pickedDynamicPictureEvent)
                pickedDynamicPictureEvent = undefined
              }
            }
            if (obj.status !== 0) {
              viewer.flyTo(monitorEntity, {
                duration: 1,
                offset: {
                  heading: Cesium.Math.toRadians(0.0),
                  pitch: Cesium.Math.toRadians(-90),
                  range: 500
                }
              })
            }
          }
          break
        case 'hiddenPoint': // 隐患点
          let hiddlenEntity = viewer.entities.getById(obj.id)
          console.log(hiddlenEntity)
          if (hiddlenEntity) {
            if (flag) {
              this.hiddenId = JSON.parse(JSON.stringify(hiddlenEntity.id))
              let pobj = {}
              pobj.id = JSON.parse(JSON.stringify(hiddlenEntity.id))
              pobj.name = JSON.parse(JSON.stringify(hiddlenEntity.name))
              pobj.label = JSON.parse(JSON.stringify(hiddlenEntity.label.text._value))
              pobj.warnType = JSON.parse(JSON.stringify(hiddlenEntity.attribute.warnType))
              pobj.projBasicName = JSON.parse(JSON.stringify(hiddlenEntity.attribute.projBasicName))
              pobj.warnInformation = JSON.parse(JSON.stringify(hiddlenEntity.attribute.warnInformation))
              pobj.warnTime = JSON.parse(JSON.stringify(hiddlenEntity.attribute.warnTime))
              pobj.level = JSON.parse(JSON.stringify(hiddlenEntity.attribute.level))
              pobj.longitude = JSON.parse(JSON.stringify(hiddlenEntity.attribute.longitude))
              pobj.latitude = JSON.parse(JSON.stringify(hiddlenEntity.attribute.latitude))
              hiddlenEntity.billboard.show = false
              if (pickedEntity) {
                pickedEntity.billboard.show = true
              }
              pickedEntity = hiddlenEntity
              pickedDiv.style.backgroundImage = 'url("static/images/hidden_point_dynamic.png")'
              pickedDiv.style.height = '58px'
              this.bindDynamicPictureEvent(viewer, Cesium, {
                'pickedDiv': pickedDiv,
                'position': Cesium.Cartesian3.fromDegrees(pobj.longitude, pobj.latitude, 0),
                'type': 'hiddenPoint'
              })
            } else {
              if (pickedEntity) {
                pickedEntity.billboard.show = true
                pickedEntity = undefined
              }
              pickedDiv.style.display = 'none'
              if (pickedDynamicPictureEvent) {
                viewer.scene.postRender.addEventListener(pickedDynamicPictureEvent)
                pickedDynamicPictureEvent = undefined
              }
            }
            if (obj.status !== 0) {
              viewer.flyTo(hiddlenEntity, {
                duration: 1,
                offset: {
                  heading: Cesium.Math.toRadians(0.0),
                  pitch: Cesium.Math.toRadians(-90),
                  range: 5000
                }
              })
            }
          }
      }
    }
  },
  selectPoint (detailInfo, vue) {
    let Cesium = vue.Cesium
    let viewer = mapviewer.viewer
    let id = detailInfo.id
    let type = detailInfo.type
    let obj = {}
    if (type === 2) {
      obj = { type: 'hiddenPoint', id: detailInfo.id, status: 1 }
    } else if (type === 3) {
      obj = { type: 'monitorPoint', id: detailInfo.id, status: 1 }
    }
    this.locateToPoint(obj, vue, true)
    console.log('type', type)
    switch (type) {
      case 1: // 项目
        vue.getResultInfo(id)
        break
      case 2: // 隐患点
        vue.getHiddenPointDetail(id)
        break
      case 3: // 测点
        vue.getProjPnDetail(id)
        break
    }
  },
  cancelSelect (vue) {
    let viewer = mapviewer.viewer
    let len = viewer.entities._entities._array.length
    for (let i = 0; i < len; i++) {
      let item = viewer.entities._entities._array[i]
      if (item._name === 'monitorPoint') {
        item._billboard._image._value = 'static/images/monitor_point_0.png'
      }
      if (item._name === 'hiddenPoint') {
        item._billboard._image._value = 'static/images/hidden_point_0.png'
      }
    }
  },
  addPolyDash (monitorPoint, hiddenLon, hiddenLat, vue) {
    let Cesium = vue.Cesium
    let viewer = mapviewer.viewer
    // 加入地形数据计算隐患点和监测点高程，再进行大小对比，使用较高的数值进行多段线弧度高度的计算，实现在曲线始终半空中的弧度效果
    let heightMon = 0
    let heightHidden = 0
    let positionsHidden = Cesium.Cartographic.fromDegrees(hiddenLon, hiddenLat)
    Cesium.when(new Cesium.sampleTerrain(viewer.terrainProvider, 14, [positionsHidden]), (updatedPositions) => {
      self.height = updatedPositions[0].height
      if (updatedPositions[0].height !== undefined) {
        heightHidden = updatedPositions[0].height
      }
      let positionsMon = Cesium.Cartographic.fromDegrees(monitorPoint.longitude, monitorPoint.latitude)
      Cesium.when(new Cesium.sampleTerrain(viewer.terrainProvider, 14, [positionsMon]), (updatedPositions) => {
        self.height = updatedPositions[0].height
        if (updatedPositions[0].height !== undefined) {
          heightMon = updatedPositions[0].height
        }
        let height = 0
        if (heightHidden > heightMon) {
          height = heightHidden
        } else {
          height = heightMon
        }
        let dis = this.getGreatCircleDistance(hiddenLat, hiddenLon, monitorPoint.latitude, monitorPoint.longitude)
        let pntArray = this.addBezier(hiddenLat, hiddenLon, monitorPoint.latitude, monitorPoint.longitude, dis / 7 + height, 30, vue, heightMon, heightHidden)
        let entity = new Cesium.Entity()
        entity.bezier = true
        entity.name = 'polyDash'
        entity.polyline = {
          positions: pntArray,
          width: 1,
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.fromCssColorString('#c9f4ff').withAlpha(0.8)
          })
        }
        viewer.entities.add(entity)
      })
    })
  },
  addBezier (pointALat, pointALon, pointBLat, pointBLon, height, num, vue, heightMon, heightHidden) { // 贝塞尔曲线
    let Cesium = vue.Cesium
    let earth = Cesium.Ellipsoid.WGS84
    let startPoint = earth.cartographicToCartesian(Cesium.Cartographic.fromDegrees(parseFloat(pointALon), parseFloat(pointALat), heightHidden))
    let endPoint = earth.cartographicToCartesian(Cesium.Cartographic.fromDegrees(parseFloat(pointBLon), parseFloat(pointBLat), heightMon))
    // determine the midpoint (point will be inside the earth)
    let addCartesian = startPoint.clone()
    Cesium.Cartesian3.add(startPoint, endPoint, addCartesian)
    let midpointCartesian = addCartesian.clone()
    Cesium.Cartesian3.divideByScalar(addCartesian, 2, midpointCartesian)
    // move the midpoint to the surface of the earth
    earth.scaleToGeodeticSurface(midpointCartesian)
    // add some altitude if you want (1000 km in this case)
    let midpointCartographic = earth.cartesianToCartographic(midpointCartesian)
    midpointCartographic.height = height
    midpointCartesian = earth.cartographicToCartesian(midpointCartographic)
    let spline = new Cesium.CatmullRomSpline({
      times: [0.0, 0.5, 1.0],
      points: [
        startPoint,
        midpointCartesian,
        endPoint
      ]
    })
    let polylinePoints = []
    for (let ii = 0; ii < num + 1; ++ii) {
      polylinePoints.push(spline.evaluate(ii / num))
    }
    return polylinePoints
  },
  getGreatCircleDistance (lat1, lng1, lat2, lng2) {
    let that = this
    let radLat1 = that.getRad(lat1)
    let radLat2 = that.getRad(lat2)
    let a = radLat1 - radLat2
    let b = that.getRad(lng1) - that.getRad(lng2)
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
    s = s * that.EARTH_RADIUS
    s = Math.round(s * 10000) / 10000.0
    return s
  },
  getRad (d) {
    return d * Math.PI / 180.0
  },
  clearMap (vue, isSearch) {
    this.clearDynamicPicture()
    vue.ispointsPanel = false
    let viewer = mapviewer.viewer
    if (viewer.entities !== undefined) {
      let len = viewer.entities._entities._array.length
      for (let i = 0; i < len; i++) {
        let item = viewer.entities._entities._array[0]
        if (item._name !== 'areaFeature') {
          viewer.entities.remove(item)
        }
      }
    }
  }
}
export default cesiumJS
