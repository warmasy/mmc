import request from '@/utils/request'
import { mockPostList } from '@/mock/data'

export function listPost(query) {
  return Promise.resolve({ code: 200, msg: "操作成功", rows: mockPostList, total: mockPostList.length })
}

export function getPost(postId) {
  const post = mockPostList.find(p => p.postId == postId) || mockPostList[0]
  return Promise.resolve({ code: 200, msg: "操作成功", data: post })
}

export function addPost(data) {
  return Promise.resolve({ code: 200, msg: "操作成功" })
}

export function updatePost(data) {
  return Promise.resolve({ code: 200, msg: "操作成功" })
}

export function delPost(postId) {
  return Promise.resolve({ code: 200, msg: "删除成功" })
}
