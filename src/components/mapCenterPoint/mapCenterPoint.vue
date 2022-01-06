<template>
  <!-- 选择中心点 -->
  <a-modal :visible="visible" title="绘制中心点" width="900px" @cancel="handleCancel">
    <div id="projMap" style="width:100%;height:430px;position: relative;">
      <div class="tipBox">
        <span>请输入关键字</span>
        <input id="tipinput" type="text" autocomplete="off">
      </div>
      <div id="mapContainer" style="width: 100%;height:100%;"></div>
    </div>
    <template slot="footer">
      <a-button type="primary" @click="handleOK">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      longitude: {
        type: String,
        default: ''
      },
      latitude: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        $amap: '',
        marker: '',
        mapLng: '116.397428',
        mapLat: '39.90923'
      };
    },
    watch: {
      visible(newVal) {
        if (newVal) {
          this.mapLng = this.longitude
          this.mapLat = this.latitude
          if (this.mapLng === '' || this.mapLat === '') {
            this.mapLng = '116.397428'
            this.mapLat = '39.90923'
          }
          this.$nextTick(() => {
            this.initMap()
          })

        }
      }
    },
    methods: {
      // 初始化地图
      initMap() {
        var _this = this
        _this.$amap && _this.$amap.destroy();
        _this.$amap = new AMap.Map('mapContainer', {
          //   resizeEnable: false,
          zoom: 10, // 设置地图显示的缩放级别
          center: [_this.mapLng, _this.mapLat], // 设置地图中心点坐标
          defaultCursor: 'pointer'
        })
        this.marker = new AMap.Marker({
          position: [_this.mapLng, _this.mapLat],
          map: _this.$amap
        })
        //输入提示
        var autoComplete = new AMap.Autocomplete({
          input: "tipinput"
        });
        // //注册监听，当选中某条记录时会触发
        AMap.event.addListener(autoComplete, "select", this.selectAddress);
        this.$amap.add(this.marker)
        this.$amap.setFitView()
        this.$amap.on('click', this.showInfoClick)
      },
      //   输入框选择地点
      selectAddress(e) {
        let lng_lat = e.poi.location
        if (!lng_lat) return false
        this.mapLng = lng_lat.lng
        this.mapLat = lng_lat.lat
        // console.log(this.mapLng, this.mapLat)
        let lnglats = [this.mapLng, this.mapLat]
        this.$amap.setZoomAndCenter(16, lnglats);
        this.addMarker(lnglats)
      },
      showInfoClick(e) {
        const lnglats = [e.lnglat.getLng(), e.lnglat.getLat()]
        this.mapLng = e.lnglat.getLng()
        this.mapLat = e.lnglat.getLat()
        this.addMarker(lnglats)
      },
      addMarker(lnglats) {
        if (this.marker) {
          this.$amap.remove(this.marker)
        }
        this.marker = new AMap.Marker({
          position: lnglats,
          map: this.$amap
        })
      },
      //关闭
      handleCancel() {
        this.$emit('close')
        document.getElementById('tipinput').value = ''
      },
      // 确定
      handleOK() {
        this.$emit('saveLngLat', this.mapLng.toString(), this.mapLat.toString())
        this.$emit('close')
        document.getElementById('tipinput').value=''
      }
    }
  }

</script>
<style lang="less" scoped>
  .input-card {
    bottom: 5px;
    position: absolute;
    z-index: 10;
    right: 1px;
    background-color: #ffffff;
    padding: 10px;

    .input-item {
      margin-bottom: 5px;
    }
  }

  .tipBox {
    position: absolute;
    right: 1rem;
    top: .5rem;
    z-index: 10;
    background-color: white;
    padding: 0.75rem 1rem;
    line-height: 30px;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 6px 0 #727cf580;
    font-size: 12px;

    #tipinput {
      height: 32px;
      border: 1px solid #ced4da;
      border-left: none;
      border-radius: 2px;

      &:focus {
        outline: none;
      }
    }

    >span {
      color: #495057;
      text-align: center;
      white-space: nowrap;
      letter-spacing: 2px;
      padding: 0 3px;
      background-color: #e9ecef;
      border: 1px solid #ced4da;
      border-radius: 2px;
    }
  }

</style>
