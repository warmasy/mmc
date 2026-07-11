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
      r: { name: '半径 r', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 },
    },
    formulaType: 'cone'
  }
]

export function getInertiaModelById(id) {
  return inertiaModels.find(m => m.id === id) || inertiaModels[0]
}

export function getDefaultInertiaModel() {
  return inertiaModels[0]
}
