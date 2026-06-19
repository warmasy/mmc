import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import useUserStore from '@/store/modules/user'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'

NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {
  NProgress.start()
  to.meta.title && useSettingsStore().setTitle(to.meta.title)
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  if (permissionStore.sidebarRouters.length === 0) {
    userStore.getInfo().then(() => {
      permissionStore.generateRoutes().then(accessRoutes => {
        accessRoutes.forEach(route => {
          if (!route.path.startsWith('http')) {
            router.addRoute(route)
          }
        })
        next({ ...to, replace: true })
      })
    })
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})
