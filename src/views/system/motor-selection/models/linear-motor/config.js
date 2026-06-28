// ==================== 直线电机选型 - 参数配置（预留框架） ====================

export const motionModeOptions = {
  single: '单轴',
  dual: '双轴并联'
}

export const inputLayout = {
  驱动方式: {
    type: 'radio',
    items: [
      { key: 'axisMode', label: '轴配置', options: motionModeOptions, desc: '选择轴配置方式' }
    ]
  },
  运动参数: {
    type: 'params',
    items: [
      { key: 'stroke', label: '行程', sub: 'L', unit: 'mm', step: 0.1, min: 0, desc: '行程长度' },
      { key: 'positionTime', label: '定位时间', sub: 't', unit: 's', step: 0.001, min: 0, desc: '定位时间' },
      { key: 'maxSpeed', label: '最高速度', sub: 'Vmax', unit: 'm/s', step: 0.01, min: 0, desc: '最高速度' },
      { key: 'acceleration', label: '加速度', sub: 'a', unit: 'm/s²', step: 0.1, min: 0, desc: '加速度' }
    ]
  },
  负载参数: {
    type: 'params',
    items: [
      { key: 'loadMass', label: '负载质量', sub: 'm', unit: 'kg', step: 0.1, min: 0, desc: '负载质量' },
      { key: 'externalForce', label: '外力', sub: 'Fext', unit: 'N', step: 0.1, desc: '外力' },
      { key: 'dutyCycle', label: '占空比', sub: 'DC', unit: '%', step: 1, min: 0, max: 100, desc: '占空比' }
    ]
  }
}

export const outputLayout = {
  选型结果: {
    type: 'results',
    items: [
      { key: 'peakForce', label: '峰值推力', sub: 'Fp', unit: 'N' },
      { key: 'ratedForce', label: '额定推力', sub: 'Fr', unit: 'N' },
      { key: 'maxTemp', label: '最高温升', sub: 'ΔT', unit: '°C' }
    ]
  }
}

export const resultNotes = [
  '计算结果仅供学习参考，请勿用于其它用途'
]

export const notes = [
  '直线电机无传动间隙，定位精度高，但需考虑热负荷',
  '占空比影响电机持续推力，需根据实际工况选取',
  '编码器分辨率直接影响定位精度，建议选用 0.1μm 级以上'
]

export function getDefaultForm() {
  return {
    projectName: '',
    projectNo: '',
    axisMode: 'single',
    stroke: 500,
    positionTime: 0.1,
    maxSpeed: 2,
    acceleration: 20,
    loadMass: 10,
    externalForce: 0,
    dutyCycle: 50
  }
}

export function getDefaultResult() {
  return {
    peakForce: '0.0',
    ratedForce: '0.0',
    maxTemp: '0'
  }
}

export const inputParams = inputLayout
export const outputParams = outputLayout
