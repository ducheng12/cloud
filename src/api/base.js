import request from '@/utils/request'
const API = process.env.VUE_APP_BASE_API
// 石磊ip
// const API = 'http://192.168.1.66:7005'
const fileApi = process.env.VUE_APP_FILE_URL
// const fileApi = 'http://192.168.1.66:7005'
// 常规「增删改查」，数据请求
export const Basic = {
  list: function(module, data) {
    return request({
      url: `${API}/${module}/list`,
      method: 'get',
      params: data
    })
  },
  save: function(module, data) {
    return request({
      url: `${API}/${module}/save`,
      method: 'post',
      data
    })
  },
  update: function(module, data) {
    return request({
      url: `${API}/${module}/update`,
      method: 'post',
      data
    })
  },
  delete: function(module, id) {
    return request({
      url: `${API}/${module}/delete/${id}`,
      method: 'post',
      data: {}
    })
  },
  info: function(module, data) {
    return request({
      url: `${API}/${module}/info`,
      method: 'post',
      data
    })
  },
  normal: function(module, data) {
    return request({
      url: `${API}/${module}`,
      method: 'post',
      data
    })
  },
  general: function(module, params) {
    return request({
      url: `${API}/${module}`,
      method: 'get',
      params
    })
  },
  upLoad: function(module, data) {
    return request({
      url: `${fileApi}${module}`,
      method: 'post',
      data
    })
  }
}
