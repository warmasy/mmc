// 单位转换配置
export const conversionTypes = [
  {
    id: 'force',
    name: '力',
    desc: '牛顿、千牛、达因、磅力等',
    defaultBaseUnit: 'N',
    sourceUnit: 'N',
    targetUnit: 'kN',
    units: {
      N: { name: '牛顿', factor: 1, symbol: 'N', isDatum: true },
      kN: { name: '千牛', factor: 1000, symbol: 'kN' },
      kgf: { name: '千克力', factor: 9.80665, symbol: 'kgf' },
      lbf: { name: '磅力', factor: 4.44822, symbol: 'lbf' },
      tf: { name: '吨力', factor: 9806.65, symbol: 'tf' },
    }
  },
  {
    id: 'pressure',
    name: '压力',
    desc: '帕斯卡、兆帕、巴、psi等',
    defaultBaseUnit: 'Pa',
    sourceUnit: 'Pa',
    targetUnit: 'MPa',
    units: {
      Pa: { name: '帕斯卡', factor: 1, symbol: 'Pa', isDatum: true },
      kPa: { name: '千帕', factor: 1000, symbol: 'kPa' },
      MPa: { name: '兆帕', factor: 1e6, symbol: 'MPa' },
      bar: { name: '巴', factor: 100000, symbol: 'bar' },
      psi: { name: '磅力/平方英寸', factor: 6894.76, symbol: 'psi' },
      atm: { name: '标准大气压', factor: 101325, symbol: 'atm' },
      mmHg: { name: '毫米汞柱', factor: 133.322, symbol: 'mmHg' },
    }
  },
  {
    id: 'stress',
    name: '应力',
    desc: '帕斯卡、兆帕、吉帕、psi等',
    defaultBaseUnit: 'Pa',
    sourceUnit: 'Pa',
    targetUnit: 'MPa',
    units: {
      Pa: { name: '帕斯卡', factor: 1, symbol: 'Pa', isDatum: true },
      MPa: { name: '兆帕', factor: 1e6, symbol: 'MPa' },
      GPa: { name: '吉帕', factor: 1e9, symbol: 'GPa' },
      N_mm2: { name: '牛/平方毫米', factor: 1e6, symbol: 'N/mm²' },
      kgf_mm2: { name: '千克力/平方毫米', factor: 9.80665e6, symbol: 'kgf/mm²' },
      psi: { name: '磅力/平方英寸', factor: 6894.76, symbol: 'psi' },
      ksi: { name: '千磅力/平方英寸', factor: 6.89476e6, symbol: 'ksi' },
      bar: { name: '巴', factor: 1e5, symbol: 'bar' },
    }
  },
  {
    id: 'torque',
    name: '转矩',
    desc: '牛顿·米、千牛·米、磅·英尺等',
    defaultBaseUnit: 'Nm',
    sourceUnit: 'Nm',
    targetUnit: 'kgfm',
    units: {
      Nm: { name: '牛顿·米', factor: 1, symbol: 'N·m', isDatum: true },
      kNm: { name: '千牛·米', factor: 1000, symbol: 'kN·m' },
      kgfm: { name: '千克力·米', factor: 9.80665, symbol: 'kgf·m' },
      lbf_ft: { name: '磅力·英尺', factor: 1.35582, symbol: 'lbf·ft' },
      lbf_in: { name: '磅力·英寸', factor: 0.112985, symbol: 'lbf·in' },
    }
  },
  {
    id: 'length',
    name: '长度',
    desc: '米、毫米、厘米、英寸、英尺等',
    defaultBaseUnit: 'mm',
    sourceUnit: 'mm',
    targetUnit: 'm',
    units: {
      mm: { name: '毫米', factor: 1, symbol: 'mm', isDatum: true },
      m: { name: '米', factor: 1000, symbol: 'm' },
      cm: { name: '厘米', factor: 10, symbol: 'cm' },
      dm: { name: '分米', factor: 100, symbol: 'dm' },
      km: { name: '千米', factor: 1000000, symbol: 'km' },
      um: { name: '微米', factor: 0.001, symbol: 'μm' },
      nm: { name: '纳米', factor: 1e-6, symbol: 'nm' },
      inch: { name: '英寸', factor: 25.4, symbol: 'in' },
      ft: { name: '英尺', factor: 304.8, symbol: 'ft' },
    }
  },
  {
    id: 'speed',
    name: '速度',
    desc: '米/秒、千米/时、节、马赫等',
    defaultBaseUnit: 'm_s',
    sourceUnit: 'm_s',
    targetUnit: 'km_h',
    units: {
      m_s: { name: '米/秒', factor: 1, symbol: 'm/s', isDatum: true },
      mm_s: { name: '毫米/秒', factor: 0.001, symbol: 'mm/s' },
      mm_min: { name: '毫米/分', factor: 1.66667e-5, symbol: 'mm/min' },
      m_min: { name: '米/分', factor: 0.016667, symbol: 'm/min' },
      km_h: { name: '千米/时', factor: 0.277778, symbol: 'km/h' },
      ft_s: { name: '英尺/秒', factor: 0.3048, symbol: 'ft/s' },
    }
  },
  {
    id: 'mass',
    name: '质量',
    desc: '千克、克、吨、磅、盎司等',
    defaultBaseUnit: 'kg',
    sourceUnit: 'kg',
    targetUnit: 'g',
    units: {
      kg: { name: '千克', factor: 1, symbol: 'kg', isDatum: true },
      g: { name: '克', factor: 0.001, symbol: 'g' },
      t: { name: '吨', factor: 1000, symbol: 't' },
    }
  },
  {
    id: 'density',
    name: '密度',
    desc: '千克/立方米、克/立方厘米等',
    defaultBaseUnit: 'kg_m3',
    sourceUnit: 'kg_m3',
    targetUnit: 'g_cm3',
    units: {
      kg_m3: { name: '千克/立方米', factor: 1, symbol: 'kg/m³', isDatum: true },
      g_cm3: { name: '克/立方厘米', factor: 1000, symbol: 'g/cm³' },
      kg_dm3: { name: '千克/立方分米', factor: 1000, symbol: 'kg/dm³' },
      g_dm3: { name: '克/立方分米', factor: 1, symbol: 'g/dm³' },
      kg_l: { name: '千克/升', factor: 1000, symbol: 'kg/L' },
      g_L: { name: '克/升', factor: 1, symbol: 'g/L' },
    }
  },
  {
    id: 'time',
    name: '时间',
    desc: '秒、分、时、天、年等',
    defaultBaseUnit: 's',
    sourceUnit: 's',
    targetUnit: 'min',
    units: {
      s: { name: '秒', factor: 1, symbol: 's', isDatum: true },
      ms: { name: '毫秒', factor: 0.001, symbol: 'ms' },
      min: { name: '分', factor: 60, symbol: 'min' },
      h: { name: '时', factor: 3600, symbol: 'h' },
    }
  },
  {
    id: 'rotation',
    name: '转速',
    desc: '转/分、转/秒、弧度/秒、赫兹等',
    defaultBaseUnit: 'rpm',
    sourceUnit: 'rpm',
    targetUnit: 'rad_s',
    units: {
      rpm: { name: '转/分', factor: 1, symbol: 'rpm', isDatum: true },
      rps: { name: '转/秒', factor: 60, symbol: 'rps' },
      rph: { name: '转/时', factor: 0.016667, symbol: 'rph' },
      rad_s: { name: '弧度/秒', factor: 9.54930, symbol: 'rad/s' },
      deg_s: { name: '度/秒', factor: 0.166667, symbol: '°/s' },
    }
  },
  {
    id: 'acceleration',
    name: '加速度',
    desc: '米/秒²、重力加速度、英尺/秒²等',
    defaultBaseUnit: 'm_s2',
    sourceUnit: 'm_s2',
    targetUnit: 'g',
    units: {
      m_s2: { name: '米/秒²', factor: 1, symbol: 'm/s²', isDatum: true },
      mm_s2: { name: '毫米/秒²', factor: 0.001, symbol: 'mm/s²' },
      m_min2: { name: '米/分²', factor: 0.000277778, symbol: 'm/min²' },
      mm_min2: { name: '毫米/分²', factor: 2.77778e-7, symbol: 'mm/min²' },
      g: { name: '重力加速度', factor: 9.80665, symbol: 'g' },
      ft_s2: { name: '英尺/秒²', factor: 0.3048, symbol: 'ft/s²' },
      gal: { name: '伽', factor: 0.01, symbol: 'Gal' },
    }
  },
  {
    id: 'power',
    name: '功率',
    desc: '瓦特、千瓦、马力等',
    defaultBaseUnit: 'W',
    sourceUnit: 'W',
    targetUnit: 'kW',
    units: {
      W: { name: '瓦特', factor: 1, symbol: 'W', isDatum: true },
      kW: { name: '千瓦', factor: 1000, symbol: 'kW' },
      MW: { name: '兆瓦', factor: 1e6, symbol: 'MW' },
      hp: { name: '英制马力', factor: 745.7, symbol: 'hp' },
      ps: { name: '公制马力', factor: 735.5, symbol: 'PS' },
      mW: { name: '毫瓦', factor: 0.001, symbol: 'mW' },
    }
  },
  {
    id: 'angle',
    name: '角度',
    desc: '度、弧度、分、秒等',
    defaultBaseUnit: 'rad',
    sourceUnit: 'deg',
    targetUnit: 'rad',
    units: {
      rad: { name: '弧度', factor: 1, symbol: 'rad', isDatum: true },
      deg: { name: '度', factor: 0.0174533, symbol: '°' },
      min: { name: '分', factor: 0.000290888, symbol: '′' },
      sec: { name: '秒', factor: 4.84814e-6, symbol: '″' },
      gon: { name: '冈', factor: 0.015708, symbol: 'gon' },
      rev: { name: '转', factor: 6.28319, symbol: 'rev' },
    }
  },
  {
    id: 'energy',
    name: '能量',
    desc: '焦耳、千焦、卡路里、千瓦时等',
    defaultBaseUnit: 'J',
    sourceUnit: 'J',
    targetUnit: 'kJ',
    units: {
      J: { name: '焦耳', factor: 1, symbol: 'J', isDatum: true },
      kJ: { name: '千焦', factor: 1000, symbol: 'kJ' },
      cal: { name: '卡路里', factor: 4.184, symbol: 'cal' },
      kcal: { name: '千卡', factor: 4184, symbol: 'kcal' },
      Wh: { name: '瓦时', factor: 3600, symbol: 'Wh' },
      kWh: { name: '千瓦时', factor: 3.6e6, symbol: 'kWh' },
    }
  },
  {
    id: 'volume',
    name: '体积',
    desc: '立方米、升、毫升等',
    defaultBaseUnit: 'mm3',
    sourceUnit: 'm3',
    targetUnit: 'L',
    units: {
      m3: { name: '立方米', factor: 1, symbol: 'm³' },
      dm3: { name: '立方分米', factor: 1e-3, symbol: 'dm³' },
      cm3: { name: '立方厘米', factor: 1e-6, symbol: 'cm³' },
      mm3: { name: '立方毫米', factor: 1e-9, symbol: 'mm³' },
      L: { name: '升', factor: 1e-3, symbol: 'L' },
      mL: { name: '毫升', factor: 1e-6, symbol: 'mL' },
      ft3: { name: '立方英尺', factor: 0.0283168, symbol: 'ft³' },
      in3: { name: '立方英寸', factor: 1.63871e-5, symbol: 'in³' }
    }
  }
]

export function getConversionTypeById(id) {
  return conversionTypes.find(t => t.id === id) || conversionTypes[0]
}

export function getDefaultConversionType() {
  return conversionTypes[0]
}

// ==================== 惯量计算配置 ====================
export const inertiaModels = [
  {
    id: 'solid-cylinder',
    name: '实心圆柱体',
    desc: '绕中心轴旋转，J = ½mr²',
    params: {
      m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 },
      r: { name: '半径 r', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 },
    },
    formulaType: 'solid-cylinder'
  },
  {
    id: 'hollow-cylinder',
    name: '空心圆柱体',
    desc: '绕中心轴旋转，J = ½m(R²+r²)',
    params: {
      m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 },
      r1: { name: '外半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 },
      r2: { name: '内半径 r', unit: 'm', default: 0.05, min: 0, step: 0.01, precision: 4 },
    },
    formulaType: 'hollow-cylinder'
  },
  {
    id: 'rectangular-prism',
    name: '长方体',
    desc: '绕中心轴旋转，J = ¹⁄₁₂m(a²+b²)',
    params: {
      m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 },
      a: { name: '边长 a', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 },
      b: { name: '边长 b', unit: 'm', default: 0.05, min: 0, step: 0.01, precision: 4 },
    },
    formulaType: 'rectangular-prism'
  },
  {
    id: 'sphere',
    name: '球体',
    desc: '绕直径旋转，J = ⅖mr²',
    params: {
      m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 },
      r: { name: '半径 r', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 },
    },
    formulaType: 'sphere'
  },
  {
    id: 'thin-disk',
    name: '薄圆盘',
    desc: '绕中心轴旋转，J = ½mr²',
    params: {
      m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 },
      r: { name: '半径 r', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 },
    },
    formulaType: 'thin-disk'
  },
  {
    id: 'cone',
    name: '圆锥体',
    desc: '绕中心轴旋转，J = ³⁄₁₀mr²',
    params: {
      m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 },
      r: { name: '底面半径 r', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 },
    },
    formulaType: 'cone'
  },
]

export function getInertiaModelById(id) {
  return inertiaModels.find(m => m.id === id) || inertiaModels[0]
}

export function getDefaultInertiaModel() {
  return inertiaModels[0]
}