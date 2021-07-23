import request from '@/utils/request'
// 商品列表
export function getGoodsList(params) {
  return request({
    url: '/goods/selectListPage',
    method: 'get',
    params
  })
}

// 商品新增
export function addGoods(data) {
  return request({
    url: '/goods/save',
    method: 'post',
    data
  })
}

// 商品上下架
export function updateStatus(data) {
  return request({
    url: '/goods/updateStatus',
    method: 'post',
    data
  })
}
// 删除商品
export function GoodsDelet(data) {
  return request({
    url: '/goods/deleteById',
    method: 'post',
    data
  })
}
// 商品详情
export function getQueryGoods(data) {
  return request({
    url: '/goods/selectByGoodsId',
    method: 'post',
    data
  })
}
// 商品梯价新增
// 商品详情
export function setGoodsSkuPrice(data) {
  return request({
    url: '/GoodsSkuPrice/save',
    method: 'post',
    data
  })
}
// 分类-一级分类列表
export function getGoodsInitClass(data) {
  return request({
    url: '/GoodsCategory/selectBase',
    method: 'post',
    data
  })
}

// 分类-二级分类列表
export function getGoodsSecondClass(data) {
  return request({
    url: '/GoodsCategory/pageByCateId',
    method: 'post',
    data
  })
}

// 分类-二级分类列表-不分页
export function getGoodsClassIspaging(data) {
  return request({
    url: '/GoodsCategory/selectByCateId',
    method: 'post',
    data
  })
}
// 分类-新增或修改分类
export function setGoodsClass(data) {
  return request({
    url: '/GoodsCategory/save',
    method: 'post',
    data
  })
}

// 分类-删除二级分类
export function deleteGoodsClass(data) {
  return request({
    url: '/GoodsCategory/deleteById',
    method: 'post',
    data
  })
}

// 图片上传
export function imgUploading(data) {
  return request({
    url: '/GoodsSku/selectByGoodsId',
    method: 'post',
    data
  })
}
// 供应商列表
export function getSupplierList(params) {
  return request({
    url: '/supplier/listNoPage',
    method: 'get',
    params
  })
}

// sku- 新增与修改sku
export function addGoodsSku(data) {
  return request({
    url: '/GoodsSku/save',
    method: 'post',
    data
  })
}

// sku-商品sku根据商品id查询
export function getGoodsSku(data) {
  return request({
    url: '/GoodsSku/selectByGoodsId',
    method: 'post',
    data
  })
}

// sku-批量上下架
export function updataBatch(data) {
  return request({
    url: '/GoodsSku/updateBatch',
    method: 'post',
    data
  })
}

// SKU-根据id删除sku
export function deletGoodsSku(data) {
  return request({
    url: '/GoodsSku/deleteById',
    method: 'post',
    data
  })
}

// SKU-根据id删除sku
export function getSkuDetails(data) {
  return request({
    url: '/GoodsSku/selectBySkuId',
    method: 'post',
    data
  })
}

// SKU-根据id批量删除sku
export function BatchGoodsSku(data) {
  return request({
    url: '/GoodsSku/delBatch',
    method: 'post',
    data
  })
}

// 属性-根据商品分类id查询属性
export function getGoodsCateId(data) {
  return request({
    url: '/GoodsAttribute/selectByCateId',
    method: 'post',
    data
  })
}

// 删除图片接口
export function delGoodsImg(data) {
  return request({
    url: '/goods/delFileById',
    method: 'post',
    data
  })
}

