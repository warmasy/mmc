import request from '@/utils/request'
import { mockNoticeList } from '@/mock/data'

export function listNotice(query) {
  return Promise.resolve({ code: 200, msg: "操作成功", rows: mockNoticeList, total: mockNoticeList.length })
}
