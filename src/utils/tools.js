export default {
  install: (Vue, options) => {
    Vue.prototype.inputControl = function(obj, key, n) {
      if (typeof obj[key] !== 'string') return
      if (n === 0) { // 只能输入整数
        obj[key] = obj[key].replace(/[^\.\d]/g, '')
        obj[key] = obj[key].replace('.', '')
      } else {
        obj[key] = obj[key].replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
        obj[key] = obj[key].replace(/^\./g, '') // 验证第一个字符是数字
        obj[key] = obj[key].replace(/\.{2,}/g, '.') // 只保留第一个, 清除多余的
        obj[key] = obj[key].replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        const reg = new RegExp('^(\\-)*(\\d+)\\.(\\d{' + n + '}).*$') // 保留n位小数
        obj[key] = obj[key].replace(reg, '$1$2.$3')
      }
      if (obj[key].indexOf('.') < 0 && obj[key] !== '') { // 如果没有小数点，首位不能为类似于 01、02
        obj[key] = parseFloat(obj[key])
      }
    }
  }
}
