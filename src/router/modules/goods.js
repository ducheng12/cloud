import Layout from '@/layout'
const goodsRouter =
{
  path: '/goods',
  component: Layout,
  redirect: '/goods/list',
  meta: {
    title: '商品中心',
    icon: 'icon-commodity'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/goods/goodsList'),
      meta: { title: '商品列表' }
    },
    {
      hidden: true,
      path: 'goodsAdd',
      name: 'goodsAdd',
      component: () => import('@/views/goods/goodsList/goodsAdd'),
      meta: { title: '新增商品' }
    },
    {
      hidden: true,
      path: 'goodsedit/:id',
      name: 'goodsedit',
      component: () => import('@/views/goods/goodsList/goodsAdd'),
      meta: { title: '编辑商品' }
    },
    {
      path: 'class',
      component: () => import('@/views/goods/goodsClass'),
      meta: { title: '商品分类' }
    },
    {
      path: 'property',
      component: () => import('@/views/goods/goodsProperty'),
      meta: { title: '商品属性' }
    }
  ]
}
export default goodsRouter
