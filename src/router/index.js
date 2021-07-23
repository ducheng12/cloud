import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
Vue.use(Router)

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  }
  // {
  //   path: '/customer-service',
  //   name: 'CustomerService',
  //   component: Layout,
  //   redirect: '/customer-service/staff',
  //   meta: { title: '客服管理', icon: 'icon-after_sale' },
  //   children: [
  //     {
  //       path: 'staff',
  //       name: 'staff',
  //       component: () => import('@/views/CustomerService/indexStaff'),
  //       meta: { title: '员工管理', icon: '' } // icon-after_sale
  //     },
  //     {
  //       path: 'staff/staff-detail',
  //       name: 'staffDetail',
  //       component: () => import('@/views/CustomerService/staff/ApproveView'),
  //       meta: { title: '员工管理详情' },
  //       hidden: true
  //     },
  //     {
  //       path: 'workorder-order',
  //       name: 'workOrder',
  //       component: () => import('@/views/CustomerService/indexWork'),
  //       meta: { title: '工单管理', icon: '' } // icon-after_sale
  //     },
  //     {
  //       path: 'workorder-order/workorder-order-detail',
  //       name: 'workOrderDetail',
  //       component: () => import('@/views/CustomerService/workorder/ApproveView'),
  //       meta: { title: '工单详情' },
  //       hidden: true
  //     }
  //   ]
  // }
]

export const defaultRoute = [
  {
    path: '/',
    component: Layout,
    redirect: ''
    // children: [{
    //   path: 'dashboard',
    //   name: 'Dashboard',
    //   component: () => import('@/views/dashboard/index'),
    //   meta: { title: '首页', icon: 'dashboard' }
    // }]
  }
]

// 后面所有开发的功能模块路由，都添加在 [ asyncRoutes ] 里面
export const asyncRoutes = [
  // goodsRouter,   放置位置
  {
    path: '/supplier',
    name: 'Supplier',
    component: Layout,
    redirect: '/supplier/supplier-list',
    meta: { title: '供应商管理', icon: 'icon-supplier' },
    children: [
      {
        path: 'supplier-list',
        name: 'SupplierList',
        component: () => import('@/views/Supplier'),
        meta: { title: '供应商管理', icon: 'icon-supplier' }
      },
      {
        path: 'supplier-list/add',
        name: 'AddSupplierList',
        component: () => import('@/views/Supplier/components/AddViewNew'),
        meta: { title: '', icon: '' },
        hidden: true,
        beforeEnter: (to, from, next) => {
          if (to.query.id) {
            to.meta.title = '编辑供应商'
          } else {
            to.meta.title = '新增供应商'
          }
          next()
        }
      },
      {
        path: 'supplier-list/datails',
        name: 'DetailsSupplierList',
        component: () => import('@/views/Supplier/components/ApproveViewNew'),
        meta: { title: '供应商详情', icon: '' },
        hidden: true
      }
    ]
  },
  {
    path: '/cloudstall',
    component: Layout,
    redirect: '/cloudstall/list',
    meta: {
      title: '懂衣云档口',
      icon: 'icon-commodity'
    },
    children: [
      {
        path: 'list',
        name: 'GoodsList',
        component: () => import('@/views/goods/goodsList'),
        meta: { title: '商品列表' }
      },
      {
        hidden: true,
        path: 'list/goodsAdd',
        name: 'goodsAdd',
        component: () => import('@/views/goods/goodsList/goodsAdd'),
        meta: { title: '新增商品' }
      },
      {
        hidden: true,
        path: 'list/goodsedit/:id',
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
      },
      {
        path: 'purchasing-list',
        name: 'PurchasingList',
        component: () => import('@/views/Purchasing'),
        meta: { title: '采购订单', icon: '' } // icon-order_center
      },
      {
        path: 'purchasing-list/purchasing-details',
        name: 'purchasingDetails',
        component: () => import('@/views/Purchasing/components/Details'),
        meta: { title: '采购详情' },
        hidden: true
      },
      {
        path: 'purchas',
        name: 'purchasing',
        component: () => import('@/views/Comment/index'),
        meta: { title: '评论列表' },
        hidden: true
      }
    ]
  },
  {
    path: '/cloudshop',
    name: 'CloudShop',
    component: Layout,
    redirect: '/cloudshop/storemanagement-list',
    meta: { title: '懂衣云店', icon: 'icon-management' },
    children: [
      {
        path: 'storemanagement-list',
        name: 'StoreManagementList',
        component: () => import('@/views/StoreManagement/store/index'),
        meta: { title: '云店列表' }
      },
      {
        hidden: true,
        path: 'storemanagement-list/storemanagement-add',
        name: 'StoreManagementAdd',
        component: () => import('@/views/StoreManagement/store/salesroomAdd'),
        meta: { title: '' },
        beforeEnter: (to, from, next) => {
          if (to.query.id) {
            to.meta.title = '修改云店'
          } else {
            to.meta.title = '新增云店'
          }
          next()
        }
      },
      {
        hidden: true,
        path: 'storemanagement-list/cloudproducts',
        name: 'cloudproductsList',
        component: () => import('@/views/StoreManagement/store/components/CloudProducts'),
        meta: { title: '云店商品' }
      },
      {
        hidden: true,
        path: 'storemanagement-list/storemanagement-detail',
        name: 'StoreManagementDetail',
        component: () => import('@/views/StoreManagement/store/components/detail'),
        meta: { title: '云店详情' }
      },
      {
        path: 'member-stores',
        name: 'MemberStores',
        component: () => import('@/views/StoreManagement/memberStores'),
        meta: { title: '云店会员' }
      },
      {
        hidden: true,
        path: 'member-stores/member-detail/:id',
        name: 'MemberDetail',
        component: () => import('@/views/StoreManagement/memberStores/detail'),
        meta: { title: '云店会员详情' }
      },
      {
        path: 'storemanagementinfo-list',
        name: 'storemanagementinforList',
        component: () => import('@/views/StoreManagement/details'),
        meta: { title: '云店销售单' }
      },
      {
        hidden: true,
        path: 'storemanagementinfo-list/storemanagement-infor',
        name: 'StoreManagementInfor',
        component: () => import('@/views/StoreManagement/details/detail'),
        meta: { title: '云店销售单详情' }
      },
      {
        path: 'comment-list',
        name: 'comment-list',
        component: () => import('@/views/Comment/index'),
        meta: { title: '评论列表', icon: '' },
        hidden: true // icon-comment
      }
    ]
  },
  {
    path: '/afterSale',
    name: 'AfterSale',
    component: Layout,
    redirect: '/afterSale/sales',
    meta: { title: '售后管理', icon: 'icon-after_sale' },
    children: [
      {
        path: 'sales',
        name: 'sales',
        component: () => import('@/views/AfterSale/index'),
        meta: { title: '云档口售后', icon: '' } // icon-after_sale
      },
      {
        path: 'sales/sales-detail',
        name: 'salesDetail',
        component: () => import('@/views/AfterSale/saleDetail/saleDetail'),
        meta: { title: '云档口售后详情' },
        hidden: true
      },
      {
        path: 'sales-cloud',
        name: 'salesyun',
        component: () => import('@/views/AfterSale/indexCloud'),
        meta: { title: '云店售后', icon: '' } // icon-after_sale
      },
      {
        path: 'sales-cloud/sales-detail',
        name: 'salesDetailyun',
        component: () => import('@/views/AfterSale/saleDetail/saleCloudDetail'),
        meta: { title: '云店售后详情' },
        hidden: true
      }
    ]
  },
  {
    path: '/authority',
    name: 'Authority',
    component: Layout,
    redirect: '/authority/role-list',
    meta: { title: '权限管理', icon: 'icon-management' },
    children: [
      {
        path: 'role-list',
        name: 'RoleList',
        component: () => import('@/views/Authority/role'),
        meta: { title: '角色管理' }
      },
      {
        hidden: true,
        path: 'role-list/role-add',
        name: 'roleAdd',
        component: () => import('@/views/Authority/role/roleDetail'),
        meta: { title: '新增角色' }
      },
      {
        hidden: true,
        path: 'role-list/role-edact/:id',
        name: 'rolerEdact',
        component: () => import('@/views/Authority/role/roleDetail'),
        meta: { title: '编辑角色' }
      },
      {
        path: 'user-list',
        name: 'UserList',
        component: () => import('@/views/Authority/user'),
        meta: { title: '用户管理' }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router
