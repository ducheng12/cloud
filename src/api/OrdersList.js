import request from '@/utils/request'

// 订单中心
export function orderList(params) {
  return request({
    url: `/order/info/list`,
    method: 'get',
    params
  })
}
// 导出数据
export function infoExport(params) {
  return request({
    url: `/order/info/export`,
    method: 'get',
    params
  })
}
// 导入运单号
export function infoImport(data) {
  return request({
    url: `/order/info/import/waybill`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}
// 关闭订单
export function infoCancel(data) {
  return request({
    url: `/order/info/cancel`,
    method: 'post',
    data
  })
}
// 发货
export function infoShip(data) {
  return request({
    url: `/order/info/ship`,
    method: 'post',
    data
  })
}
// 订单详情
export function orderDetail(params) {
  return request({
    url: `/order/detail`,
    method: 'get',
    params
  })
}
// 修改收货人信息
export function updateInfo(data) {
  return request({
    url: `/order/info/update/recipient_info `,
    method: 'post',
    data
  })
}
// 商品信息列表
export function goodsList(params) {
  return request({
    url: `/order/goods/list`,
    method: 'get',
    params
  })
}
// 删除商品
export function goodsDelete(data) {
  return request({
    url: `/order/goods/delete`,
    method: 'post',
    data
  })
}
// 查看商品
export function goodsListT(params) {
  return request({
    url: `/goods/selectListPage`,
    method: 'get',
    params
  })
}
// 订单操作记录列表
export function operationList(params) {
  return request({
    url: `/order/info/operation/list`,
    method: 'get',
    params
  })
}
// 新增
export function goodsAdd(data) {
  return request({
    url: `/order/goods/add`,
    method: 'post',
    data
  })
}
// 替换
export function goodsReplace(data) {
  return request({
    url: `/order/goods/replace`,
    method: 'post',
    data
  })
}
// 供应商列表
export function supplierList(params) {
  return request({
    url: `/supplier/listNoPage`,
    method: 'get',
    params
  })
}
// 一级分类
export function selectBase(data) {
  return request({
    url: `/GoodsCategory/selectBase`,
    method: 'post',
    data
  })
}
// 二级分类
export function pageByCateId(data) {
  return request({
    url: `/GoodsCategory/selectByCateId`,
    method: 'post',
    data
  })
}
// 下载模板
export function infoDownload(params) {
  return request({
    url: `/order/info/download`,
    method: 'get',
    params
  })
}
