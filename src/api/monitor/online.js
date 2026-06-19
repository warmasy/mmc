import request from '@/utils/request'
import { mockOnlineList } from '@/mock/data'

export function list(query) {
  return Promise.resolve({ code: 200, msg: "操作成功", rows: mockOnlineList, total: mockOnlineList.length })
}

export function forceLogout(tokenId) {
  return Promise.resolve({ code: 200, msg: "操作成功" })
}
