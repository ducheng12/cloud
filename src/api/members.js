import request from '@/utils/request'

// 会员信息列表
export function membersList(params) {
  return request({
    url: `/member/list`,
    method: 'get',
    params
  })
}
// 会员信息详情
export function infoList(data) {
  return request({
    url: `/member/info`,
    method: 'post',
    data
  })
}
// 标签下拉框
export function listNoPage(params) {
  return request({
    url: `mem_tag/listNoPage`,
    method: 'get',
    params
  })
}
// 分组下拉框
export function groupNoPage(params) {
  return request({
    url: `/mem_group/listNoPage`,
    method: 'get',
    params
  })
}
// 创建分组
export function createGroup(data) {
  return request({
    url: `/mem_group/createGroup`,
    method: 'post',
    data
  })
}
// 添加标签
export function createTag(data) {
  return request({
    url: `/mem_tag/createTag`,
    method: 'post',
    data
  })
}
// 获取会员标签列表
export function membersbq(params) {
  return request({
    url: `/mem_tag/list`,
    method: 'get',
    params
  })
}
// 会员标签新增
export function membersAdd(data) {
  return request({
    url: `/mem_tag/save`,
    method: 'post',
    data
  })
}
// 会员标签修改
export function membersUpdate(data) {
  return request({
    url: `/mem_tag/update`,
    method: 'post',
    data
  })
}
// 会员标签删除
export function membersDelete(data) {
  return request({
    url: `/mem_tag/delete`,
    method: 'post',
    data
  })
}
// 查询查询会员分组列表
export function groupList(params) {
  return request({
    url: `/mem_group/list`,
    method: 'get',
    params
  })
}
// 新增会员分组
export function addSave(data) {
  return request({
    url: `/mem_group/save`,
    method: 'post',
    data
  })
}
// 修改会员分组及启用按钮
export function update(data) {
  return request({
    url: `/mem_group/update`,
    method: 'post',
    data
  })
}
// 导出全部会员
export function exportMemberAll(params) {
  return request({
    url: `/member/exportMemberAll`,
    method: 'get',
    params
  })
}
// 导出选择会员
export function exportMember(params) {
  return request({
    url: `/member/exportMember`,
    method: 'get',
    params
  })
}
// 批量导入会员分组
export function importGroup(data) {
  return request({
    url: `/mem_group/importGroup`,
    method: 'post',
    data
  })
}
// 批量导入会员标签
export function importLabel(data) {
  return request({
    url: `/mem_tag/importTag`,
    method: 'post',
    data
  })
}

