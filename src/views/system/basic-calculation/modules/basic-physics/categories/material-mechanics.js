export default {
  id: 'material-mechanics',
  name: '材料力学',
  images: [],
  subTypes: [
    {
      id: 'normal-stress',
      name: '正应力',
      params: {
        F: { name: '轴力 F', unit: 'N', default: 1000, step: 10, precision: 4 },
        A: { name: '截面积 A', unit: 'm²', default: 0.001, step: 0.0001, precision: 6 }
      },
      results: [
        { id: 'sigma', name: '正应力 σ', unit: 'Pa', formula: (p) => p.F / p.A }
      ]
    },
    {
      id: 'tensile-deformation',
      name: '拉压变形',
      params: {
        F: { name: '轴力 F', unit: 'N', default: 1000, step: 10, precision: 4 },
        L: { name: '原长 L', unit: 'm', default: 1, step: 0.01, precision: 4 },
        E: { name: '弹性模量 E', unit: 'Pa', default: 200000000000, step: 1000000000, precision: 4 },
        A: { name: '截面积 A', unit: 'm²', default: 0.001, step: 0.0001, precision: 6 }
      },
      results: [
        { id: 'deltaL', name: '变形量 ΔL', unit: 'm', formula: (p) => p.F * p.L / (p.E * p.A) }
      ]
    },
    {
      id: 'shear-stress',
      name: '剪切应力',
      params: {
        F: { name: '剪力 F', unit: 'N', default: 1000, step: 10, precision: 4 },
        A: { name: '剪切面积 A', unit: 'm²', default: 0.001, step: 0.0001, precision: 6 }
      },
      results: [
        { id: 'tau', name: '剪切应力 τ', unit: 'Pa', formula: (p) => p.F / p.A }
      ]
    },
    {
      id: 'torsional-shear-stress',
      name: '扭转剪应力',
      params: {
        T: { name: '扭矩 T', unit: 'N·m', default: 10, step: 0.1, precision: 4 },
        r: { name: '半径 r', unit: 'm', default: 0.05, step: 0.001, precision: 4 },
        J: { name: '极惯性矩 J', unit: 'm⁴', default: 0.000001, step: 0.0000001, precision: 8 }
      },
      results: [
        { id: 'tau', name: '扭转剪应力 τ', unit: 'Pa', formula: (p) => p.T * p.r / p.J }
      ]
    },
    {
      id: 'bending-normal-stress',
      name: '弯曲正应力',
      params: {
        M: { name: '弯矩 M', unit: 'N·m', default: 100, step: 1, precision: 4 },
        y: { name: '距离 y', unit: 'm', default: 0.05, step: 0.001, precision: 4 },
        I: { name: '惯性矩 I', unit: 'm⁴', default: 0.000001, step: 0.0000001, precision: 8 }
      },
      results: [
        { id: 'sigma', name: '弯曲正应力 σ', unit: 'Pa', formula: (p) => p.M * p.y / p.I }
      ]
    }
  ]
}
