import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'

const modules = import.meta.glob('./../../views/**/*.vue')

const MOCK_ROUTERS = [
  {
    "name": "System",
    "path": "/system",
    "hidden": false,
    "redirect": "noRedirect",
    "component": "Layout",
    "alwaysShow": true,
    "meta": { "title": "Online手记", "icon": "documentation", "noCache": false },
    "children": [
      { "name": "UnitConversion", "path": "basic-calculation", "hidden": false, "component": "system/basic-calculation/index", "meta": { "title": "基本计算", "icon": "number", "noCache": false } },
      { "name": "MotorSelection", "path": "motor-selection", "hidden": false, "component": "system/motor-selection/index", "meta": { "title": "电机选型", "icon": "tool", "noCache": false } },
      { "name": "Blog", "path": "blog", "hidden": false, "component": "system/blog/index", "meta": { "title": "我的博客", "icon": "link", "noCache": false } }
    ]
  },
  {
    "name": "Monitor",
    "path": "/monitor",
    "hidden": false,
    "redirect": "noRedirect",
    "component": "Layout",
    "alwaysShow": true,
    "meta": { "title": "我的服务", "icon": "monitor", "noCache": false },
    "children": [
      { "name": "Mechanical", "path": "mechanical", "hidden": false, "component": "system/mechanical/index", "meta": { "title": "机械计算", "icon": "tool", "noCache": false } }
    ]
  },
  {
    "name": "ModelViewer",
    "path": "/model-viewer",
    "hidden": false,
    "component": "Layout",
    "meta": { "title": "模型查看", "icon": "component", "noCache": false },
    "children": [
      { "name": "ModelViewerPage", "path": "index", "hidden": false, "component": "system/model-viewer/index", "meta": { "title": "模型查看", "icon": "component", "noCache": true } }
    ]
  },
  {
    "name": "Notice",
    "path": "/notice",
    "hidden": false,
    "component": "Layout",
    "meta": { "title": "通知公告", "icon": "message", "noCache": false },
    "children": [
      { "name": "NoticePage", "path": "index", "hidden": false, "component": "system/notice/index", "meta": { "title": "通知公告", "icon": "message", "noCache": false } }
    ]
  }
]

const usePermissionStore = defineStore(
  'permission',
  {
    state: () => ({
      routes: [],
      addRoutes: [],
      defaultRoutes: [],
      topbarRouters: [],
      sidebarRouters: []
    }),
    actions: {
      setRoutes(routes) {
        this.addRoutes = routes
        this.routes = constantRoutes.concat(routes)
      },
      setDefaultRoutes(routes) {
        this.defaultRoutes = constantRoutes.concat(routes)
      },
      setTopbarRoutes(routes) {
        this.topbarRouters = routes
      },
      setSidebarRouters(routes) {
        this.sidebarRouters = routes
      },
      generateRoutes(roles) {
        return new Promise(resolve => {
          const resData = JSON.parse(JSON.stringify(MOCK_ROUTERS))
          const sdata = JSON.parse(JSON.stringify(MOCK_ROUTERS))
          const rdata = JSON.parse(JSON.stringify(MOCK_ROUTERS))
          const defaultData = JSON.parse(JSON.stringify(MOCK_ROUTERS))
          const sidebarRoutes = filterAsyncRouter(sdata)
          const rewriteRoutes = filterAsyncRouter(rdata, false, true)
          const defaultRoutes = filterAsyncRouter(defaultData)
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
          asyncRoutes.forEach(route => { router.addRoute(route) })
          this.setRoutes(rewriteRoutes)
          this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))
          this.setDefaultRoutes(sidebarRoutes)
          this.setTopbarRoutes(defaultRoutes)
          resolve(rewriteRoutes)
        })
      }
    }
  })

function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach(el => {
    el.path = lastRouter ? lastRouter.path + '/' + el.path : el.path
    if (el.children && el.children.length) {
      children = children.concat(filterChildren(el.children, el))
    } else {
      children.push(el)
    }
  })
  return children
}

function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach(route => {
    if (route.permissions) {
      res.push(route)
    } else if (route.roles) {
      res.push(route)
    }
  })
  return res
}

export const loadView = (view) => {
  let res
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0]
    if (dir === view) {
      res = () => modules[path]()
    }
  }
  return res
}

export default usePermissionStore