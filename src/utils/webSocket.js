import {notification} from 'ant-design-vue'
import apis from './apiConfig.js'
import store from '../store/modules/account'
import cesiumJs from './cesiumJS'
// noinspection JSAnnotator
let webSocketJS = {
  websocket: null,
  vm: null, // 用来获取 调用此 js的vue 组件 实例 （this）
  sendThis (_this) {
    webSocketJS.vm = _this
  },
  initWebSocket () {
    let timestamp = (new Date()).valueOf() // 获取当前毫秒的时间戳！
    let num = ''
    for (let i = 0; i < 3; i++) {
      num += Math.floor(Math.random() * 10)
    }
    let userId = store.state.user.userId
    let newUserId = userId + '_' + timestamp + num
    console.log('获取当前用户id:' + newUserId)
    let socketURL = apis.socketUrlDev
    console.log(socketURL)
    if (typeof WebSocket === 'undefined') {
      alert('您的浏览器不支持WebSocket')
      return false
    }
    if ('WebSocket' in window) {
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      this.websocket = new WebSocket(socketURL + newUserId)
      this.websocket.onopen = this.websocketonopen
      this.websocket.onerror = this.websocketonerror
      this.websocket.onmessage = this.websocketonmessage
      this.websocket.onclose = this.websocketclose
    }
  },
  websocketonopen () {
    console.log('WebSocket连接成功')
  },
  websocketonmessage (e) {
    var da = e.data
    var data = JSON.parse(da)
    console.log('*******websocket接收消息*******')
    console.log(data)
    if (data.status === 1) {
      store.state.websocketData = data
      let typeLabel = ''
      switch (data.level) {
        case 4:
          typeLabel = '红色警报'
          break
        case 3:
          typeLabel = '橙色警报'
          break
        case 2:
          typeLabel = '黄色警报'
          break
        case 1:
          typeLabel = '蓝色警报'
          break
      }
      let typeName = ''
      switch (data.warnType) {
        case 1:
          typeName = '设备预警'
          break
        case 2:
          typeName = '安全预警'
          break
        case 3:
          typeName = '宏观群查预警'
          break
        case 4:
          typeName = '定量群测预警'
          break
      }
      const key = 'updatable'
      notification.warn({
      // message: '技术预警  ',
        description: (h) => {
          return (<div style="color:#c5f3ff"><div style="display:none;"><audio autoPlay="autoPlay" loop><source src={`static/media/audio_${data.level}.mp3`} type="audio/mpeg"/></audio></div><div style="position: absolute;top: 5px;left: 8px;"><img src= {`static/img/矩形2609拷贝${data.level}@3x.png`} /></div><div><span>预警类型:</span>{typeName}</div><div><span>隐患点:</span>{data.hiddenName}</div><div><span>监测点:</span>{data.pnName}</div><div><span>预警信息:</span>{data.warningInformation} {data.value}</div><div><span>预警等级:</span>{typeLabel}</div><div><span>时间:</span>{data.warningTime}</div></div>)
        },
        key,
        placement: 'bottomRight',
        duration: 10, // 默认10秒自动关闭
        icon: (h) => {
          return <a-icon type="warning" style="color: rgb(239, 91, 91)" />
        },
        style: {
          cursor: 'pointer',
          right: '10px'
        },
        onClick: (h) => {
          let path = webSocketJS.vm.$route.path
          if (path !== '/devops/DevOps') {
            if (data.warnType === 1) {
              let obj = {type: 'monitorPoint', id: data.pnId, status: 1}
              cesiumJs.locateToHomePagePoint(obj, webSocketJS.vm)
            } else if (data.warnType === 2) {
              let obj = {type: 'hiddenPoint', id: data.hiddenId, status: 1}
              cesiumJs.locateToHomePagePoint(obj, webSocketJS.vm)
            }
            // cesiumJs.locateToXY(parseFloat(data.pnLongitude), parseFloat(data.pnLatitude), webSocketJS.vm)
          } else {
            console.log('运维看板页面点击预警不提供定位功能！')
          }
        }
      })
    } else {
      store.state.websocketHandleData = data // 7*24h 运维处置
    }
  },
  websocketonerror () {
    console.log('WebSocket连接发生错误')
    setTimeout(function () {
      webSocketJS.initWebSocket()
    }, 500)
  },
  websocketclose (e) {
    if (this.websocket) {
      this.websocket.close() // 关闭websocket
      console.log('WebSocket断开连接')
    }
  },
  created () {
    if (this.websocket) {
      this.websocket.close() // 关闭websocket连接
    }
    this.initWebSocket()
  }
}
// webSocketJS.created()
export default webSocketJS
