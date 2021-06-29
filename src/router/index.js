import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {                                                                                                                                                                                                                              
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/openBilling'
    // children: [
    //   {
    //     path: 'dashboard',
    //     component: () => import('@/views/dashboard/index'),
    //     name: 'Dashboard',
    //     meta: { title: 'dashboard', icon: 'dashboard', affix: true }
    //   }
    // ]
  }
]

export const asyncRoutes = [
  {
    name: 'system',
    path: '/system',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '系统配置',
      icon: 'el-icon-s-platform'
    },
    children: [
      { 
        path: 'usermanage',
        component: () => import('@/views/pages/system/userManage.vue'),
        name: 'userManage',
        meta: {
          title: '用户管理',
          noCache: false
        }
      },
      {
        path: 'roleduty',
        component: () => import('@/views/pages/system/roleDuty.vue'),
        name: 'roleDuty', 
        meta: {
          title: '角色职责',
          noCache: false
        }
      },
      {
        path: 'parameterConfigure',
        component: () => import('@/views/pages/system/parameterConfigure.vue'),
        name: 'parameterConfigure', 
        meta: {
          title: '参数配置',
          noCache: false
        }
      }
    ]
  },
  {
    name: 'billList',
    path: '/openBilling',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '受理开单',
      icon: 'form'
    },
    children: [
      { 
        path: '',
        component: () => import('@/views/pages/openBilling.vue'),
        name: 'openBilling',
        meta: {
          title: '受理开单',
          noCache: false
        }
      },
      {
        path: 'runBilling',
        component: () => import('@/views/pages/runBilling.vue'),
        name: 'runBilling', 
        meta: {
          title: '运单同步',
          noCache: false
        }
      },
      {
        path: 'driver',
        component: () => import('@/views/pages/order/driver.vue'),
        name: 'driver', 
        meta: {
          title: '司机管理',
          noCache: false
        }
      },
      {
        path: 'customer',
        component: () => import('@/views/pages/order/customer.vue'),
        name: 'customer', 
        meta: {
          title: '客户管理',
          noCache: false
        }
      },
      {
        path: 'addressDuration',
        component: () => import('@/views/pages/order/addressDuration.vue'),
        name: 'addressDuration', 
        meta: {
          title: '地址间距时长',
          noCache: false
        }
      },
      {
        path: 'sigleModel',
        component: () => import('@/views/pages/order/sigleModel.vue'),
        name: 'sigleModel', 
        meta: {
          title: '单品管理',
          noCache: false
        }
      },
    ]
  },
  
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }), 
  routes: [...constantRoutes,...asyncRoutes]
})

const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
