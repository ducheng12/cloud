import request from '@/utils/request'
const BASE_API = process.env.VUE_APP_BASE_API

// 用户-停用，启用
export function upStatus(id) {
  return request({
    url: `/admin/user/enabled`,
    method: 'post',
    data: { userId: id }
  })
}

export function getInfo(params) {
  return request({
    url: BASE_API + '/admin/no_auth/get/user_info',
    method: 'get',
    params
  })
}

// export function logout() {
//   return request({
//     url: '/dev-api/user/logout',
//     method: 'post'
//   })
// }
