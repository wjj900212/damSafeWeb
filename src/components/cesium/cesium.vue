<template>
  <div class="container">
    <div id="cesiumContainer" style="height: 100%;">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import mapviewer from 'utils/viewer'
import {addModels} from 'utils/addYanQingModels'
export default {
  name: 'cesiumPage',
  props: ['isSpin'],
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      multipage: state => state.setting.multipage,
      cityCode: state => state.account.cityCode,
      cityType: state => state.account.cityType
    })
  },
  mounted () {
    console.log(mapviewer.viewer)
    if (Object.keys(mapviewer.viewer).length !== 0){
      console.log('buweik')
      mapviewer.viewer.dataSources.removeAll(true)
      mapviewer.viewer.destroy()
    }
    mapviewer.viewer = {}
    console.log(mapviewer.viewer)
    let that = this
    let key = '0186b13012737ef2707cee467002778d' // 天地图申请的密钥     网上的KEY: a89df02c93e5474e9ebeb81a32fcb487
    // 在线天地图影像中文标记服务(墨卡托投影)
    let tdtCiaW = 'http://{s}.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0' +
            '&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
            '&style=default&format=tiles&tk=' + key
    let tdtImgW = 'http://{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0' +
            '&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
            '&style=default&format=tiles&tk=' + key
    let Cesium = this.Cesium
    let img = new Cesium.WebMapTileServiceImageryProvider({ // 调用影响中文注记服务
      url: tdtImgW,
      layer: 'img_w',
      style: 'default',
      format: 'tiles',
      tileMatrixSetID: 'GoogleMapsCompatible',
      subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'], // 天地图8个服务器
      minimumLevel: 0,
      maximumLevel: 18
    })
    // 地形数据
    // let worldTerrain = Cesium.createWorldTerrain({
    //   requestWaterMask: true,
    //   requestVertexNormals: true
    // })
    // let terrainProvider = new Cesium.CesiumTerrainProvider({
    //   url: "http://test.peacemap.com.cn:8181/WNPapplication/OneMapDataService/Terrain/TerrainTile5503/",
    //   requestWaterMask: false
    // })
    // 192.168.120.231
    // let terrainProvider = new Cesium.CesiumTerrainProvider({
    //   url: "http://211.157.166.115/geoserver/nurc/wms/ASTGTM2_N40E115_dem",
    //   requestWaterMask: false
    // })
    // let terrainProvider = new Cesium.EllipsoidTerrainProvider({})
    // token
    // Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiNDI0NTlmMC0zZWNlLTQ5OGItOTc0OC0xZjFlNGM5ODI5YmEiLCJpZCI6Mzc1MjAsImlhdCI6MTYwNTE1MzE0NX0.NwR43VPfj3lHkMKTonQh0oYxESxFQctYUjC3XxZeKHA'

    let viewer = new Cesium.Viewer('cesiumContainer', {
      // 加载在线谷歌地图
      // imageryProvider: new Cesium.UrlTemplateImageryProvider({
      //   url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'
      // }),
      // imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
      //   url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
      // }),
      // terrainProvider: Cesium.createWorldTerrain(),
      // terrainProvider: worldTerrain,
      // terrainProvider: terrainProvider,
      imageryProvider: img,
      animation: false,
      timeline: false,
      geocoder: false,
      sceneModePicker: false, // 控制右上角第三个位置的选择视角模式，2d，3d
      baseLayerPicker: false, // 控制右上角第四个位置的图层选择器
      homeButton: false,
      navigationHelpButton: false,
      fullscreenButton: false
    })
    let dzdt = new Cesium.ArcGisMapServerImageryProvider({
        url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
      })
    viewer.imageryLayers.addImageryProvider(dzdt)
    viewer.imageryLayers._layers[1].show = false
    // window.Cesium = Cesium;
    // window.viewer = viewer;
    // viewer.camera.setView( {
    // destination : Cesium.Cartesian3.fromDegrees( 92.0, 48.0, 30000 )
    // } );
    // 禁用地图双击事件
    // viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    // let dztd = new Cesium.ArcGisMapServerImageryProvider({
    //     url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
    //   })
    // viewer.imageryLayers.addImageryProvider(dztd)
    let cia = new Cesium.WebMapTileServiceImageryProvider({ // 调用影响中文注记服务
      url: tdtCiaW,
      layer: 'cia_w',
      style: 'default',
      format: 'tiles',
      tileMatrixSetID: 'GoogleMapsCompatible',
      subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'], // 天地图8个服务器
      minimumLevel: 0,
      maximumLevel: 18
    })
    viewer.imageryLayers.addImageryProvider(cia) // 添加到cesium图层上
    let ttr = new Cesium.WebMapServiceImageryProvider({
      url: 'http://isafety.hazardscience.com.cn/geoserver/pmc/wms',
      layers: 'chinaline',
      parameters: {
        service: 'WMS',
        format: 'image/png',
        transparent: true,
        SRS: 'EPSG:4326'
        // tilingScheme: new Cesium.GeographicTilingScheme()
      }
      // minimumLevel: 2,
    })
    // ?layer=vec&style=default&tilematrixset=EPSG%3A3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=6&TileCol=48&TileRow=23
    viewer.imageryLayers.addImageryProvider(ttr)

    // 自定义影响（临时）
    let zdy = new Cesium.ArcGisMapServerImageryProvider({
        url: 'http://isafety.hazardscience.com.cn/layers/arcgis/rest/services/BEIJING/BEIJING/MapServer'
      })
    viewer.imageryLayers.addImageryProvider(zdy)
    // let yanqing = new Cesium.WebMapServiceImageryProvider({
    //   url: 'http://211.157.166.115/geoserver/nurc/wms',
    //   layers: 'nurc:ASTGTM2_N40E115_dem',
    //   parameters: {
    //     service: 'WMS',
    //     format: 'application/openlayers',
    //     transparent: true,
    //     SRS: 'EPSG:4326'
    //   }
    // })
    // viewer.imageryLayers.addImageryProvider(yanqing)
    //延庆地形
    // let terrainProvider = new Cesium.CesiumTerrainProvider({
    //   url: 'http://39.100.228.243/web/map/dadem',
    //   requestWaterMask: false
    // })
    let terrainProvider = new Cesium.CesiumTerrainProvider({
      url: 'http://isafety.hazardscience.com.cn/web/map/dadem',
     // url: 'http://8.142.13.191/web/map/dadem',
      requestWaterMask: false
    })
    viewer.scene.terrainProvider = terrainProvider
    // 禁用默认实体选中时间0
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    // 去掉版权信息
    viewer._cesiumWidget._creditContainer.style.display = 'none'
    // viewer.scene.fxaa = false
    //  全局变量
    mapviewer.viewer = viewer
    if (that.isSpin) {
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(107.12656, 30.72759, 10000000.0),
          duration: 4
        })
      } else {
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(111.30101, 36.03767, 10000000.0),
          duration: 0
        })
      }
    console.log('全国')
    // 球体挪动结束监听事件
    let handlerMove = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handlerMove.setInputAction(function (wheelment) {
      // that.$globalFunction.viewerControl(that)
    }, Cesium.ScreenSpaceEventType.WHEEL)
    // let params = {} // http://211.157.166.110:81
    // this.$get('http://211.157.166.106:8080/storageforest-admin/shp/townShpList', {
    //   ...params
    // }).then((data) => {

    // })
    // 116.34945,39.98665 天工
    // 115.96832,40.47091 延庆
    // let homePageData = require('./guangdong.json')
    // // 加载行政区划数据
    // let china = Cesium.GeoJsonDataSource.load(homePageData)
    // china.then(function (dataSource) {
    //   viewer.dataSources.add(dataSource)
    //   let entities = dataSource.entities.values
    //   for (let i = 0; i < entities.length; i++) {
    //     let entity = entities[i]
    //     entity.polygon.material = Cesium.Color.fromCssColorString('#143268').withAlpha(0.8)
    //     entity.polygon.outlineColor = Cesium.Color.fromCssColorString('#7fdef3').withAlpha(0.8)
    //   }
    //   dataSource.name = '广东省'
    //   document.getElementById('dist-back').innerHTML = dataSource.name.substr(0,2)
    //   document.getElementById('curr-dist').innerHTML = dataSource.name
    // })
    // viewer.zoomTo(china)

    // let p1 = viewer.entities.add({
    //   id: 'tu',
    //   position: Cesium.Cartesian3.fromDegrees(113.08, 23.19),
    //   point: {
    //     show: true, // default
    //     color: Cesium.Color.SKYBLUE.withAlpha(1), // default: WHITE
    //     pixelSize: 20, // default: 1
    //     outlineColor: Cesium.Color.BLACK, // default: BLACK
    //     outlineWidth: 0, // default: 0
    //     clampToGround: true
    //   },
    //   label: { // 文字标签
    //     text: '56',
    //     font: '500 30px Helvetica', // 15pt monospace
    //     scale: 0.5,
    //     style: Cesium.LabelStyle.FILL,
    //     fillColor: Cesium.Color.fromCssColorString('#FFFFFF'),
    //     pixelOffset: new Cesium.Cartesian2(0, 0), // 偏移量
    //     // eyeOffset: new Cesium.Cartesian3(0, 0, 100), // 偏移量
    //     showBackground: false,
    //     backgroundColor: new Cesium.Color(0.5, 0.6, 1, 1.0)
    //   }
    //   // billboard: { // 图标
    //   //   image: 'static/images/blue.png',
    //   //   width: 50,
    //   //   height: 50
    //   // }
    // })
    // p1.show = false
    // viewer.zoomTo(chinaTest)

    // viewer.scene.camera.moveEnd.addEventListener(function () {

    // })

    addModels(viewer,Cesium);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body{
  margin: 0;
  padding: 0;
}
.container{
  width:100%;
  height:100%
}
#cesiumContainer{
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
