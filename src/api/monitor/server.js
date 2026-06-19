import request from '@/utils/request'
import { mockServerData } from '@/mock/data'

export function getServer() {
  return Promise.resolve({ code: 200, msg: "操作成功", data: mockServerData })
}
