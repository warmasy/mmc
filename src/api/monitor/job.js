import request from '@/utils/request'
import { mockJobList } from '@/mock/data'

export function listJob(query) {
  return Promise.resolve({ code: 200, msg: "操作成功", rows: mockJobList, total: mockJobList.length })
}

export function getJob(jobId) {
  const job = mockJobList.find(j => j.jobId == jobId) || mockJobList[0]
  return Promise.resolve({ code: 200, msg: "操作成功", data: job })
}

export function addJob(data) {
  return Promise.resolve({ code: 200, msg: "操作成功" })
}

export function updateJob(data) {
  return Promise.resolve({ code: 200, msg: "操作成功" })
}

export function delJob(jobId) {
  return Promise.resolve({ code: 200, msg: "删除成功" })
}

export function changeJobStatus(jobId, status) {
  return Promise.resolve({ code: 200, msg: "操作成功" })
}

export function runJob(jobId, jobGroup) {
  return Promise.resolve({ code: 200, msg: "执行成功" })
}
