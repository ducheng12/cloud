import request from '@/utils/request'

// 订单审核
export function saleVerify(data) {
  return request({
    url: `/order/after_sale/verify`,
    method: 'post',
    data
  })
}
// // 条件导出
// export function saleExport(params) {
//     return request({
//         url: `/order/after_sale/export`,
//         method: 'get',
//         params
//     })
// }
// // 导出全部
// export function saleExportAll(params) {
//     return request({
//         url: `/order/after_sale/export/all`,
//         method: 'get',
//         params
//     })
// }

