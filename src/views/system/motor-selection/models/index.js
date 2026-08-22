// ==================== 电机选型模型注册中心 ====================
// 新增选型模型步骤：
// 1. 在 models/ 下新建目录（如 xxx-motor/）
// 2. 目录内创建 config.js、calculator.js、index.vue
// 3. 在本文件下方添加模型注册对象
// 4. 无需修改任何其他文件，自动出现在模型选择列表中

export const motorModels = [
  {
    id: 'servo-motor',
    name: '伺服电机选型',
    subtitle: '滚珠丝杠 / 齿轮齿条 / 直接驱动',
    description: '支持丝杠传动、减速机传动、直接驱动三种方式的伺服电机选型计算，包含惯量比校核、扭矩计算、转速校核等。',
    icon: 'SetUp',
    color: '#409EFF',
    component: () => import('./servo-motor/index.vue')
  },
  {
    id: 'stepper-motor',
    name: '步进电机选型',
    subtitle: '开环 / 闭环控制',
    description: '步进电机选型计算，包含步距角、脉冲频率、加速曲线、失步校核等。',
    icon: 'Switch',
    color: '#67C23A',
    component: () => import('./stepper-motor/index.vue')
  },
  {
    id: 'linear-motor',
    name: '直线电机选型',
    subtitle: '直接驱动 / 磁悬浮',
    description: '直线电机直接驱动选型计算，包含推力计算、热负荷校核、编码器分辨率等。',
    icon: 'Right',
    color: '#E6A23C',
    component: () => import('./linear-motor/index.vue')
  }
]

// 根据 ID 获取模型配置
export function getModelById(id) {
  return motorModels.find(m => m.id === id) || motorModels[0]
}

// 获取默认模型
export function getDefaultModel() {
  return motorModels[0]
}
