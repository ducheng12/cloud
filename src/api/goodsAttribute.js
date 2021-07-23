import request from '@/utils/request'

export function GoodSelectListPage(data) { // 商品分类分页（树形）
  return request({
    url: '/GoodsCategory/selectListPage',
    method: 'get',
    params: data
  })
}
export function GoodsAttribute(data) { // 属性列表分页（树形）
  return request({
    url: '/GoodsAttribute/selectListPage',
    method: 'get',
    params: data
  })
}
export function AttributeSave(data) { // 新增或修改属性
  return request({
    url: '/GoodsAttribute/save',
    method: 'post',
    data
  })
}
export function AttributeDeleteById(data) { // 根据属性id删除
  return request({
    url: '/GoodsAttribute/deleteById',
    method: 'post',
    data
  })
}
export function AttributeSelectBase(data) { // 获取父类属性
  return request({
    url: '/GoodsAttribute/selectBase',
    method: 'post',
    data
  })
}
export function AttributeByAttrId(data) { // 根据父类id查询
  return request({
    url: '/GoodsAttribute/pageByAttrId',
    method: 'post',
    data
  })
}
export function AttSaveOrRelation(data) { // 属性新增同时绑定分类
  return request({
    url: '/GoodsAttribute/saveOrRelation',
    method: 'post',
    data
  })
}
