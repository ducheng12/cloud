import request from '@/utils/request'

// 评论列表
export function selectListPage(params) {
  return request({
    url: `/comment/selectListPage`,
    method: 'get',
    params
  })
}
// 更新显示状态和删除还原状态
export function updateStatus(data) {
  return request({
    url: `/comment/updateStatus`,
    method: 'post',
    data
  })
}
// 更新显示状态和删除还原状态
export function deleteByOrderId(data) {
  return request({
    url: `/comment/deleteByOrderId`,
    method: 'post',
    data
  })
}
// 根据OrderId编写评论回复内容
export function updateReplyContent(data) {
  return request({
    url: `/comment/updateReplyContent`,
    method: 'post',
    data
  })
}
