export default {
  id: 'mechanics-basics',
  name: '力学基础',
  images: [],
  subTypes: [
    {
      id: 'newton-second-law',
      name: '牛顿第二定律',
      params: {
        m: { name: '质量 m', unit: 'kg', default: 1, step: 0.1, precision: 4 },
        a: { name: '加速度 a', unit: 'm/s²', default: 9.8, step: 0.1, precision: 4 }
      },
      results: [
        { id: 'F', name: '力 F', unit: 'N', formula: (p) => p.m * p.a }
      ]
    },
    {
      id: 'gravity',
      name: '重力',
      params: {
        m: { name: '质量 m', unit: 'kg', default: 1, step: 0.1, precision: 4 },
        g: { name: '重力加速度 g', unit: 'm/s²', default: 9.8, step: 0.1, precision: 4 }
      },
      results: [
        { id: 'G', name: '重力 G', unit: 'N', formula: (p) => p.m * p.g }
      ]
    },
    {
      id: 'friction',
      name: '滑动摩擦力',
      params: {
        mu: { name: '摩擦系数 μ', unit: '', default: 0.3, step: 0.01, precision: 4 },
        N: { name: '正压力 N', unit: 'N', default: 100, step: 1, precision: 4 }
      },
      results: [
        { id: 'f', name: '摩擦力 f', unit: 'N', formula: (p) => p.mu * p.N }
      ]
    },
    {
      id: 'hooke-law',
      name: '胡克定律',
      params: {
        k: { name: '劲度系数 k', unit: 'N/m', default: 100, step: 1, precision: 4 },
        x: { name: '形变量 x', unit: 'm', default: 0.01, step: 0.001, precision: 6 }
      },
      results: [
        { id: 'F', name: '弹力 F', unit: 'N', formula: (p) => p.k * p.x }
      ]
    }
  ]
}
