export function getText (str) {
    let obj = {}
    switch (str) {
      case '0':
        obj = { name: '正常', color: '#16D1AE' }
        break
      case '1':
        obj = { name: '异常', color: '#FF9500' }
        break
      case '2':
        obj = { name: '异常', color: '#FF9500' }
        break
      case '3':
        obj = { name: '异常', color: '#FF9500' }
        break
      case '4':
        obj = { name: '险情', color: '#FE5736' }
        break
    }
    return obj
}