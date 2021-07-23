import request from '@/utils/request'

// 角色-新增
export function addRole(data) {
  return request({
    url: '/admin/role/add',
    method: 'post',
    data
  })
}

// 角色-停用-启用
export function enabledStatus(id) {
  return request({
    url: `/admin/role/enabled`,
    method: 'post',
    data: { roleId: id }
  })
}
