import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";
import { mockUserList } from '@/mock/data'

export function listUser(query) {
  return Promise.resolve({ code: 200, msg: "操作成功", rows: mockUserList, total: mockUserList.length })
}

export function getUser(userId) {
  const user = mockUserList.find(u => u.userId == userId) || mockUserList[0]
  return Promise.resolve({ code: 200, msg: "操作成功", data: user })
}

export function addUser(data) {
  return Promise.resolve({ code: 200, msg: "操作成功" })
}

export function updateUser(data) {
  return Promise.resolve({ code: 200, msg: "操作成功" })
}

export function delUser(userId) {
  return Promise.resolve({ code: 200, msg: "删除成功" })
}

export function resetUserPwd(userId, password) {
  return Promise.resolve({ code: 200, msg: "操作成功" })
}

export function changeUserStatus(userId, status) {
  return Promise.resolve({ code: 200, msg: "操作成功" })
}

export function getUserProfile() {
  return Promise.resolve({ code: 200, msg: "操作成功", data: mockUserList[0] })
}

export function updateUserProfile(data) {
  return Promise.resolve({ code: 200, msg: "操作成功" })
}

export function updateUserPwd(oldPassword, newPassword) {
  return Promise.resolve({ code: 200, msg: "操作成功" })
}

export function uploadAvatar(data) {
  return Promise.resolve({ code: 200, msg: "上传成功", url: "" })
}

export function getAuthRole(userId) {
  return Promise.resolve({ code: 200, msg: "操作成功", data: {} })
}

export function updateAuthRole(data) {
  return Promise.resolve({ code: 200, msg: "操作成功" })
}

export function deptTreeSelect() {
  return Promise.resolve({ code: 200, msg: "操作成功", data: [
    { id: 100, label: '研发部门', children: [{ id: 107, label: '前端组' }, { id: 108, label: '后端组' }] },
    { id: 101, label: '测试部门', children: [{ id: 109, label: '自动化测试组' }] },
    { id: 102, label: '运维部门' },
    { id: 103, label: '产品部门' },
    { id: 104, label: '市场部门' },
    { id: 105, label: '财务部门' },
    { id: 106, label: '人事部门' },
  ]})
}
