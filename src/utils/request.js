import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers['source'] = 4
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = getToken()
    }
    // if (config.method === 'get') {
    //   config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    // }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    const code = res.code
    if (code === 200) {
      return res
    } else {
      // 错误处理
      if (code === 5001 || code === 5002) {
        // token过期/失效，无提示
        store.dispatch('user/resetToken')
          .then(() => {
            location.reload()
          })
      }
      if (code === 401 || code === 402 || code === 403 || code === 50004) {
        MessageBox.confirm(res.msg ? res.msg : '身份信息已过期!', '提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken')
            .then(() => {
              location.reload()
            })
        })
      } else {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    }
  },
  error => {
    const res = error.response
    const { status } = res
    let msg = ''
    switch (status) {
      case 401:
        msg = '暂无访问权限，请联系管理员！'
        break
      case 403:
        msg = '服务器繁忙，请刷新重试！'
        break
      default:
        msg = '服务器繁忙，请刷新重试！'
        break
    }
    Message({
      message: msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
