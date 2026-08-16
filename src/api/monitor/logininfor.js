import request from '@/utils/request'
import { mockLogininforList } from '@/mock/data'

export function list(query) {
  return Promise.resolve({ code: 200, msg: "操作成功", rows: mockLogininforList, total: mockLogininforList.length })
}
