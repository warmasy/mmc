import request from "@/utils/request";
import { mockModelList } from '@/mock/data'

export function listModel(query) {
  return Promise.resolve({ code: 200, msg: "操作成功", rows: mockModelList, total: mockModelList.length })
}

// 被 ai/chat/index.vue 使用，页面期望 res.rows
export function listModelAll() {
  return Promise.resolve({ code: 200, msg: "操作成功", rows: mockModelList, total: mockModelList.length })
}

export function getModel(modelId) {
  const model = mockModelList.find(m => m.modelId == modelId) || mockModelList[0]
  return Promise.resolve({ code: 200, msg: "操作成功", data: model })
}

export function addModel(data) {
  return Promise.resolve({ code: 200, msg: "操作成功" })
}

export function updateModel(data) {
  return Promise.resolve({ code: 200, msg: "操作成功" })
}

export function delModel(modelId) {
  return Promise.resolve({ code: 200, msg: "删除成功" })
}
