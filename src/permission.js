import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { getUserInfo } from "@/utils/auth.js";
import { apiRequest, sendMessage } from "@/api/pagesApi/openBilling";

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        // hack method to ensure that addRoutes is complete
        // set the replace: true, so the navigation will not leave a history record
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          let userInfo = getUserInfo() ? JSON.parse(getUserInfo()) : {}; 
          apiRequest("login/ajaxLogin", {
            username: userInfo.username.trim(),
            password: userInfo.password
          }).then(res => {
            if (res.result) {
              store.dispatch("user/login", res);
              store.dispatch('permission/generateRoutes',res.data).then(accessRouter=>{
                router.addRoutes(accessRouter);
              })
              sendMessage("登录成功");
              next({ ...to, replace: true })
            } else {
              store.dispatch('user/resetToken')
              sendMessage(res.msg, "error");
              next('/login')
            }
        
          });
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || '登录失败，请重新登录')
          next('/login')
          NProgress.done()
        }
      }
    }
  }else{
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
