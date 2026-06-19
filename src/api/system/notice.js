import request from '@/utils/request'
import { mockNoticeList } from '@/mock/data'

export function listNotice(query) {
  return Promise.resolve({ code: 200, msg: "操作成功", rows: mockNoticeList, total: mockNoticeList.length })
}

export function getNotice(noticeId) {
  const notice = mockNoticeList.find(n => n.noticeId == noticeId) || mockNoticeList[0]
  return Promise.resolve({ code: 200, msg: "操作成功", data: notice })
}

export function addNotice(data) {
  return Promise.resolve({ code: 200, msg: "操作成功" })
}

export function updateNotice(data) {
  return Promise.resolve({ code: 200, msg: "操作成功" })
}

export function delNotice(noticeId) {
  return Promise.resolve({ code: 200, msg: "删除成功" })
}
