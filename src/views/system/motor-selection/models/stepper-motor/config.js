// ==================== 步进电机选型 - 参数配置（预留框架） ====================

export const motionModeOptions = {
  open: '开环控制',
  closed: '闭环控制'
}

export const inputLayout = {
  驱动方式: {
    type: 'radio',
    items: [
      { key: 'controlMode', label: '控制方式', options: motionModeOptions, desc: '选择控制方式' }
    ]
  },
  运动参数: {
    type: 'params',
    items: [
      { key: 'stroke', label: '行程', sub: 'L', unit: 'mm', step: 0.1, min: 0, desc: '行程长度' },
      { key: 'positionTime', label: '定位时间', sub: 't', unit: 's', step: 0.01, min: 0, desc: '定位时间' },
      { key: 'maxSpeed', label: '最高速度', sub: 'Vmax', unit: 'mm/s', step: 0.1, min: 0, desc: '最高速度' },
      { key: 'resolution', label: '分辨率', sub: 'p', unit: 'mm/pulse', step: 0.001, min: 0, desc: '每脉冲位移' }
    ]
  },
  负载参数: {
    type: 'params',
    items: [
      { key: 'loadMass', label: '负载质量', sub: 'm', unit: 'kg', step: 0.1, min: 0, desc: '负载质量' },
      { key: 'frictionCoeff', label: '摩擦系数', sub: 'μ', unit: '—', step: 0.01, min: 0, max: 1, desc: '摩擦系数' },
      { key: 'externalForce', label: '外力', sub: 'Fext', unit: 'N', step: 0.1, desc: '外力' }
    ]
  }
}

export const outputLayout = {
  选型结果: {
    type: 'results',
    items: [
      { key: 'requiredTorque', label: '所需扭矩', sub: 'T', unit: 'N·m' },
      { key: 'pulseFreq', label: '脉冲频率', sub: 'f', unit: 'Hz' },
      { key: 'stepAngle', label: '步距角', sub: 'θ', unit: '°' }
    ]
  }
}

export const resultNotes = [
  '计算结果仅供学习参考，请勿用于其它用途'
]

export const notes = [
  '步进电机选型需考虑失步扭矩，建议保留 50% 以上余量',
  '开环控制时，加速曲线需平缓以避免失步',
  '闭环控制可提升运行平稳性，但成本较高'
]

export function getDefaultForm() {
  return {
    projectName: '',
    projectNo: '',
    controlMode: 'open',
    stroke: 200,
    positionTime: 1,
    maxSpeed: 50,
    resolution: 0.01,
    loadMass: 5,
    frictionCoeff: 0.05,
    externalForce: 0
  }
}

export function getDefaultResult() {
  return {
    requiredTorque: '0.000',
    pulseFreq: '0',
    stepAngle: '1.8'
  }
}


export const inputParams = inputLayout
export const outputParams = outputLayout
