import { defineAsyncComponent } from 'vue'

/**
 * 模块注册中心
 * 自动扫描 modules/ 下的所有 meta.js，构建模块注册表
 * 
 * 新增计算模块步骤：
 * 1. 在 modules/ 下新建文件夹，如 gear-calc/
 * 2. 创建 meta.js（模块元信息）
 * 3. 创建 config.js（业务配置，可选）
 * 4. 创建 index.vue（模块组件）
 * 5. 无需修改本文件，自动注册
 */

const metaFiles = import.meta.glob('./*/meta.js', { eager: true })

const modules = []

for (const path in metaFiles) {
  const match = path.match(/^\.\/(.+)\/meta\.js$/)
  if (!match) continue

  const id = match[1]
  const meta = metaFiles[path].default || metaFiles[path]

  modules.push({
    id,
    ...meta,
    // 使用 defineAsyncComponent 包装，直接可用在 <component :is> 中
    component: defineAsyncComponent(() => import(`./${id}/index.vue`))
  })
}

// 按 order 排序，order 越小越靠前
modules.sort((a, b) => (a.order || 0) - (b.order || 0))

export { modules }

export function getModuleById(id) {
  return modules.find(m => m.id === id) || modules[0]
}

export function getDefaultModule() {
  return modules[0]
}

export function getModuleTypes(moduleId) {
  const mod = getModuleById(moduleId)
  return mod?.types || []
}
