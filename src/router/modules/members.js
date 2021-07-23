import Layout from '@/layout'

const membersRouter =
  {
    path: '/members',
    component: Layout,
    redirect: '/members/management',
    meta: {
      title: '会员管理',
      icon: 'icon-vip'
    },
    children: [
      {
        path: 'management',
        component: () => import('@/views/members/membersList'),
        meta: { title: '会员信息' }
      },
      {
        path: 'detail',
        name: 'detail',
        component: () => import('@/views/members/membersDetail/detail'),
        meta: { title: '会员详情' },
        hidden: true
      },
      {
        path: 'label',
        component: () => import('@/views/members/membersLabel'),
        meta: { title: '标签管理' }
      },
      {
        path: 'grouping',
        component: () => import('@/views/members/membersGrouping'),
        meta: { title: '会员分组' }
      }
    ]
  }
export default membersRouter
