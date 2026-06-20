// ==================== 伺服电机选型 - 参数配置（JSON 对象格式） ====================
import motorModelImg from '@/assets/images/motor-model.png'
import motionCurveImg from '@/assets/images/motion-curve.png'

// 选项字典
// ==================== 输入参数配置 ====================
export const inputParams = {
  "计算模型": {
    type: 'image',
    items: {
      "计算模型": { src: motorModelImg, desc: '计算模型示意图' },
      "运动曲线": { src: motionCurveImg, desc: '运动曲线示意图' }
    }
  },
  "运动参数": {
    type: 'number',
    items: {
      "行程L": { key: 'stroke', value: 500, unit: 'mm', step: 0.1, min: 0, desc: '行程长度' },
      "定位时间t": { key: 'positionTime', value: 0.5, unit: 's', step: 0.01, min: 0, desc: '定位时间' },
      "最高速度Vmax": { key: 'maxSpeed', value: 0, unit: 'mm/s', step: 0.1, min: 0, desc: '最高速度' },
      "加速度a": { key: 'acceleration', value: 5000, unit: 'mm/s²', step: 0.1, min: 0, desc: '加速度' },
      "减速度d": { key: 'deceleration', value: 5000, unit: 'mm/s²', step: 0.1, min: 0, desc: '减速度' },
      "运行周期tc": { key: 'cycleTime', value: 2, unit: 's', step: 0.1, min: 0, desc: '运行周期' }
    }
  },
  "负载参数": {
    type: 'number',
    items: {
      "负载质量m": { key: 'loadMass', value: 10, unit: 'kg', step: 0.1, min: 0, desc: '负载质量' },
      "负载惯量JL": { key: 'loadInertia', value: 0, unit: 'kg·m²', step: 0.001, min: 0, desc: '负载惯量' },
      "摩擦系数μ": { key: 'frictionCoeff', value: 0.01, unit: '', step: 0.01, min: 0, max: 1, desc: '摩擦系数' },
      "外力Fext": { key: 'externalForce', value: 0, unit: 'N', step: 0.1, desc: '外力' },
      "丝杠导程Pb": { key: 'screwLead', value: 10, unit: 'mm', step: 0.1, min: 0, showIf: 'screw', desc: '丝杠导程' },
      "丝杠直径d": { key: 'screwDiameter', value: 20, unit: 'mm', step: 0.1, min: 0, showIf: 'screw', desc: '丝杠直径' },
      "机械效率η": { key: 'efficiency', value: 0.9, unit: '', step: 0.01, min: 0, max: 1, desc: '机械效率' },
      "安全系数Sf": { key: 'safetyFactor', value: 1.5, unit: '', step: 0.1, min: 1, desc: '安全系数' },
      "减速比i": { key: 'gearRatio', value: 1, unit: '', step: 0.1, min: 1, showIf: 'reducer', desc: '减速比' }
    }
  },
  "电机预选参数": {
    type: 'number',
    items: {
      "额定转速nN": { key: 'ratedSpeed', value: 3000, unit: 'r/min', step: 1, min: 0, desc: '额定转速' },
      "额定扭矩TN": { key: 'ratedTorque', value: 0, unit: 'N·m', step: 0.01, min: 0, desc: '额定扭矩' },
      "峰值扭矩Tmax": { key: 'peakTorque', value: 0, unit: 'N·m', step: 0.01, min: 0, desc: '峰值扭矩' },
      "电机惯量JM": { key: 'motorInertia', value: 0, unit: 'kg·m²', step: 0.0001, min: 0, precision: 4, desc: '电机惯量' },
      "惯量比JR": { key: 'inertiaRatio', value: null, unit: '', readonly: true, computed: true, desc: '惯量比 = JL / JM' }
    }
  }
}

// ==================== 计算结果配置 ====================
export const outputParams = {
  "运动参数": {
    type: 'readonly',
    items: {
      "行程L": { key: 'stroke', unit: 'mm', desc: '行程长度' },
      "定位时间t": { key: 'positionTime', unit: 's', desc: '定位时间' },
      "最高速度Vmax": { key: 'maxSpeed', unit: 'mm/s', desc: '最高速度' },
      "加速度a": { key: 'acceleration', unit: 'mm/s²', desc: '加速度' },
      "减速度d": { key: 'deceleration', unit: 'mm/s²', desc: '减速度' },
      "运行周期tc": { key: 'cycleTime', unit: 's', desc: '运行周期' }
    }
  },
  "负载参数": {
    type: 'readonly',
    items: {
      "负载质量m": { key: 'loadMass', unit: 'kg', desc: '负载质量' },
      "负载惯量JL": { key: 'loadInertia', unit: 'kg·m²', desc: '负载惯量' },
      "摩擦系数μ": { key: 'frictionCoeff', unit: '', desc: '摩擦系数' },
      "外力Fext": { key: 'externalForce', unit: 'N', desc: '外力' },
      "丝杠导程Pb": { key: 'screwLead', unit: 'mm', showIf: 'screw', desc: '丝杠导程' },
      "丝杠直径d": { key: 'screwDiameter', unit: 'mm', showIf: 'screw', desc: '丝杠直径' },
      "机械效率η": { key: 'efficiency', unit: '', desc: '机械效率' },
      "安全系数Sf": { key: 'safetyFactor', unit: '', desc: '安全系数' },
      "减速比i": { key: 'gearRatio', unit: '', showIf: 'reducer', desc: '减速比' }
    }
  },
  "电机预选参数": {
    type: 'readonly',
    items: {
      "额定转速nN": { key: 'ratedSpeed', unit: 'r/min', desc: '额定转速' },
      "额定扭矩TN": { key: 'ratedTorque', unit: 'N·m', desc: '额定扭矩' },
      "峰值扭矩Tmax": { key: 'peakTorque', unit: 'N·m', desc: '峰值扭矩' },
      "电机惯量JM": { key: 'motorInertia', unit: 'kg·m²', desc: '电机惯量' },
      "惯量比JR": { key: 'inertiaRatio', unit: '', desc: '惯量比' }
    }
  },
  "选型结果": {
    type: 'result',
    items: {
      "负载扭矩TL": { key: 'loadTorque', value: '0.000', unit: 'N·m', desc: '负载扭矩' },
      "加速扭矩Ta": { key: 'accelTorque', value: '0.000', unit: 'N·m', desc: '加速扭矩' },
      "所需峰值扭矩Treq": { key: 'peakTorqueReq', value: '0.000', unit: 'N·m', desc: '所需峰值扭矩' },
      "所需额定扭矩TreqN": { key: 'ratedTorqueReq', value: '0.000', unit: 'N·m', desc: '所需额定扭矩' },
      "最大转速nmax": { key: 'maxSpeed', value: '0', unit: 'r/min', desc: '最大转速' }
    }
  }
}

// ==================== 注释 ====================
export const notes = [
  '惯量比 JR = 负载惯量 / 电机惯量，一般建议控制在 10 倍以内（高惯量电机可放宽至 30 倍）',
  '安全系数 Sf 建议取值 1.2~2.0，根据负载冲击情况选取',
  '机械效率 η：滚珠丝杠 0.9~0.95，齿轮齿条 0.8~0.9，同步带 0.95~0.98',
  '计算结果仅供参考，最终选型需考虑温升、再生电阻、控制精度等因素'
]

export const resultNotes = [
  '注：计算结果仅供学习参考，请勿用于其它用途'
]

// ==================== 从 inputParams 提取默认值初始化 form ====================
export function getDefaultForm() {
  const form = { projectName: '', projectNo: '', motionMode: 'direct' }
  for (const group of Object.values(inputParams)) {
    if (group.type === 'number') {
      for (const item of Object.values(group.items)) {
        if (item.key) {
          form[item.key] = item.value !== undefined ? item.value : ''
        }
      }
    }
  }
  return form
}

// ==================== 从 outputParams 提取默认值初始化 result ====================
export function getDefaultResult() {
  const result = {}
  for (const group of Object.values(outputParams)) {
    if (group.type === 'result') {
      for (const item of Object.values(group.items)) {
        if (item.key) {
          result[item.key] = item.value !== undefined ? item.value : ''
        }
      }
    }
  }
  return result
}
