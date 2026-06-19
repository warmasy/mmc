import request from "@/utils/request";

export function listChat(query) {
  return Promise.resolve({ code: 200, msg: "操作成功", rows: [], total: 0 })
}

export function getChat(chatId) {
  return Promise.resolve({ code: 200, msg: "操作成功", data: {} })
}

export function addChat(data) {
  return Promise.resolve({ code: 200, msg: "操作成功" })
}

export function updateChat(data) {
  return Promise.resolve({ code: 200, msg: "操作成功" })
}

export function delChat(chatId) {
  return Promise.resolve({ code: 200, msg: "删除成功" })
}

export function chat(data) {
  return Promise.resolve({ code: 200, msg: "操作成功", data: { content: "这是AI的模拟回复内容。" } })
}

// 被 ai/chat/index.vue 使用，页面期望 res.rows
export function listChatSession(query) {
  const rows = [
    { sessionId: 1, title: '第一次对话', modelName: 'GPT-4o', createTime: '2024-12-01 10:00:00' },
    { sessionId: 2, title: '代码优化咨询', modelName: 'Claude 3.5', createTime: '2024-12-01 14:00:00' },
    { sessionId: 3, title: '架构设计讨论', modelName: 'DeepSeek-V3', createTime: '2024-12-02 09:00:00' },
  ]
  return Promise.resolve({ code: 200, msg: "操作成功", rows: rows, total: rows.length })
}

export function delChatSession(sessionId) {
  return Promise.resolve({ code: 200, msg: "删除成功" })
}

// 被 ai/chat/index.vue 使用，页面期望 res.data.messages 和 res.data.agentData
export function getChatSession(sessionId) {
  return Promise.resolve({ code: 200, msg: "操作成功", data: {
    sessionId: sessionId,
    title: '示例对话',
    messages: [
      { role: 'user', content: '你好，请介绍一下自己。', createTime: '2024-12-01 10:00:00' },
      { role: 'assistant', content: '你好！我是AI助手，可以帮你解答问题、编写代码、分析数据等。有什么我可以帮你的吗？', createTime: '2024-12-01 10:00:05' },
    ],
    agentData: null
  }})
}

// 被 ai/chat/index.vue 使用，页面期望 res.data
export function getUserChatConfig() {
  return Promise.resolve({ code: 200, msg: "操作成功", data: {
    defaultModel: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 4096,
    contextLength: 128000,
    visionEnabled: '1'
  }})
}

export function saveUserChatConfig(data) {
  return Promise.resolve({ code: 200, msg: "操作成功" })
}

export function cancelChatRun() {
  return Promise.resolve({ code: 200, msg: "操作成功" })
}
