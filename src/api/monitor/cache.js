import request from '@/utils/request'
import { mockCacheData } from '@/mock/data'

export function getCache() {
  return Promise.resolve({ code: 200, msg: "操作成功", data: mockCacheData })
}

export function listCacheName() {
  const names = [
    { cacheName: 'login_tokens', remark: '登录令牌缓存' },
    { cacheName: 'sys_config', remark: '系统配置缓存' },
    { cacheName: 'sys_dict', remark: '字典数据缓存' },
    { cacheName: 'sys_user', remark: '用户信息缓存' },
    { cacheName: 'sys_dept', remark: '部门信息缓存' },
    { cacheName: 'sys_role', remark: '角色信息缓存' },
    { cacheName: 'sys_post', remark: '岗位信息缓存' },
    { cacheName: 'sys_menu', remark: '菜单信息缓存' },
    { cacheName: 'captcha', remark: '验证码缓存' },
    { cacheName: 'repeat_submit', remark: '防重复提交缓存' },
  ]
  return Promise.resolve({ code: 200, msg: "操作成功", rows: names, total: names.length })
}

export function listCacheKey(cacheName) {
  const keys = [
    { cacheName: cacheName, cacheKey: 'key_001' },
    { cacheName: cacheName, cacheKey: 'key_002' },
    { cacheName: cacheName, cacheKey: 'key_003' },
    { cacheName: cacheName, cacheKey: 'key_004' },
    { cacheName: cacheName, cacheKey: 'key_005' },
    { cacheName: cacheName, cacheKey: 'key_006' },
    { cacheName: cacheName, cacheKey: 'key_007' },
    { cacheName: cacheName, cacheKey: 'key_008' },
    { cacheName: cacheName, cacheKey: 'key_009' },
    { cacheName: cacheName, cacheKey: 'key_010' },
  ]
  return Promise.resolve({ code: 200, msg: "操作成功", rows: keys, total: keys.length })
}

export function getCacheValue(cacheName, cacheKey) {
  return Promise.resolve({ code: 200, msg: "操作成功", data: { cacheName, cacheKey, cacheValue: '{"data":"mock cache value"}' } })
}

export function clearCacheName(cacheName) {
  return Promise.resolve({ code: 200, msg: "删除成功" })
}

export function clearCacheKey(cacheKey) {
  return Promise.resolve({ code: 200, msg: "删除成功" })
}

export function clearCacheAll() {
  return Promise.resolve({ code: 200, msg: "删除成功" })
}
