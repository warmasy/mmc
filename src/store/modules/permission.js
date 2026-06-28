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
      { "name": "Blog", "path": "blog", "hidden": false, "component": "system/blog/index", "meta": { "title": "博客", "icon": "link", "noCache": false } },
      { "name": "Memos", "path": "memos", "hidden": false, "component": "system/memos/index", "meta": { "title": "Memos", "icon": "documentation", "noCache": false } },
      { "name": "MotorSelection", "path": "motor-selection", "hidden": false, "component": "system/motor-selection/index", "meta": { "title": "电机选型", "icon": "tool", "noCache": false } },
      { "name": "UnitConversion", "path": "basic-calculation", "hidden": false, "component": "system/basic-calculation/index", "meta": { "title": "基本计算", "icon": "number", "noCache": false } }
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
    "name": "Ai",
    "path": "/ai",
    "hidden": false,
    "redirect": "noRedirect",
    "component": "Layout",
    "alwaysShow": true,
    "meta": { "title": "AI 管理", "icon": "bug", "noCache": false },
    "children": [
      { "name": "Model", "path": "model", "hidden": false, "component": "ai/model/index", "meta": { "title": "模型管理", "icon": "form", "noCache": false } },
      { "name": "Chat", "path": "chat", "hidden": false, "component": "ai/chat/index", "meta": { "title": "AI 对话", "icon": "wechat", "noCache": false } }
    ]
  },
  {
    "name": "Log",
    "path": "/log",
    "hidden": false,
    "redirect": "noRedirect",
    "component": "Layout",
    "alwaysShow": true,
    "meta": { "title": "日志管理", "icon": "log", "noCache": false },
    "children": [
      { "name": "Druid", "path": "druid", "hidden": false, "component": "monitor/druid/index", "meta": { "title": "数据监控", "icon": "druid", "noCache": false } },
      { "name": "TransportCrypto", "path": "transportCrypto", "hidden": false, "component": "monitor/transportCrypto/index", "meta": { "title": "传输加密", "icon": "chart", "noCache": false } },
      { "name": "Operlog", "path": "operlog", "hidden": false, "component": "monitor/operlog/index", "meta": { "title": "操作日志", "icon": "form", "noCache": false } },
      { "name": "Logininfor", "path": "logininfor", "hidden": false, "component": "monitor/logininfor/index", "meta": { "title": "登录日志", "icon": "logininfor", "noCache": false } }
    ]
  },
  {
    "name": "Other",
    "path": "/other",
    "hidden": false,
    "redirect": "noRedirect",
    "component": "Layout",
    "alwaysShow": true,
    "meta": { "title": "其它", "icon": "tool", "noCache": false },
    "children": [
      { "name": "Post", "path": "post", "hidden": false, "component": "system/post/index", "meta": { "title": "岗位管理", "icon": "post", "noCache": false } },
      { "name": "Notice", "path": "notice", "hidden": false, "component": "system/notice/index", "meta": { "title": "通知公告", "icon": "message", "noCache": false } },
      { "name": "Online", "path": "online", "hidden": false, "component": "monitor/online/index", "meta": { "title": "在线用户", "icon": "online", "noCache": false } },
      { "name": "Server", "path": "server", "hidden": false, "component": "monitor/server/index", "meta": { "title": "服务监控", "icon": "server", "noCache": false } },
      { "name": "Cache", "path": "cache", "hidden": false, "component": "monitor/cache/index", "meta": { "title": "缓存监控", "icon": "redis", "noCache": false } },
      { "name": "CacheList", "path": "cacheList", "hidden": false, "component": "monitor/cache/list", "meta": { "title": "缓存列表", "icon": "redis-list", "noCache": false } }
    ]
  },
  {
    "name": "About",
    "path": "/about",
    "hidden": false,
    "component": "Layout",
    "meta": { "title": "关于项目", "icon": "dict", "noCache": false },
    "children": [
      { "name": "AboutPage", "path": "index", "hidden": false, "component": "about/index", "meta": { "title": "关于项目", "icon": "dict", "noCache": false } }
    ]
  }
]

// 根据环境变量过滤菜单
function filterMenuByEnv(routes) {
  const showAi = import.meta.env.VITE_SHOW_AI_MENU !== 'false'
  const showLog = import.meta.env.VITE_SHOW_LOG_MENU !== 'false'
  const showOther = import.meta.env.VITE_SHOW_OTHER_MENU !== 'false'

  return routes.filter(route => {
    if (route.name === 'Ai' && !showAi) return false
    if (route.name === 'Log' && !showLog) return false
    if (route.name === 'Other' && !showOther) return false
    return true
  })
}

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
          const filteredRouters = filterMenuByEnv(MOCK_ROUTERS)
          const resData = JSON.parse(JSON.stringify(filteredRouters))
          const sdata = JSON.parse(JSON.stringify(filteredRouters))
          const rdata = JSON.parse(JSON.stringify(filteredRouters))
          const defaultData = JSON.parse(JSON.stringify(filteredRouters))
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
