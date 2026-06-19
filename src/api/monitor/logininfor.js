import request from '@/utils/request'
import { mockLogininforList } from '@/mock/data'

export function list(query) {
  return Promise.resolve({ code: 200, msg: "操作成功", rows: mockLogininforList, total: mockLogininforList.length })
}

export function delLogininfor(infoId) {
  return Promise.resolve({ code: 200, msg: "删除成功" })
}

export function unlockLogininfor(userName) {
  return Promise.resolve({ code: 200, msg: "操作成功" })
}

export function cleanLogininfor() {
  return Promise.resolve({ code: 200, msg: "删除成功" })
}
