export function getText (str) {
    let obj = {}
    switch (parseInt(str)) {
      case 0:
        obj = { name: '正常', color: '#16D1AE' }
        break
      case 1:
        obj = { name: '异常', color: '#FF9500' }
        break
      case 2:
        obj = { name: '异常', color: '#FF9500' }
        break
      case 3:
        obj = { name: '异常', color: '#FF9500' }
        break
      case 4:
        obj = { name: '险情', color: '#FE5736' }
        break
    }
    return obj
}
export function getTypeText (str) {
  let obj = {}
  switch (parseInt(str)) {
    case 0:
      obj = { name: '离线', color: '#959ba0' }
      break
    case 1:
      obj = { name: '在线', color: '#16D1AE' }
      break
  }
  return obj
}