import request from '@/utils/request'
import { mockOperlogList } from '@/mock/data'

export function list(query) {
  return Promise.resolve({ code: 200, msg: "操作成功", rows: mockOperlogList, total: mockOperlogList.length })
}

export function delOperlog(operId) {
  return Promise.resolve({ code: 200, msg: "删除成功" })
}

export function cleanOperlog() {
  return Promise.resolve({ code: 200, msg: "删除成功" })
}
