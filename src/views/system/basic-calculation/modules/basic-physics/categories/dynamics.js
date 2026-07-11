export default {
  id: 'dynamics',
  name: '动力学',
  images: [],
  subTypes: [
    {
      id: 'work',
      name: '功',
      params: {
        F: { name: '力 F', unit: 'N', default: 100, step: 1, precision: 4 },
        s: { name: '位移 s', unit: 'm', default: 10, step: 0.1, precision: 4 }
      },
      results: [
        { id: 'W', name: '功 W', unit: 'J', formula: (p) => p.F * p.s }
      ]
    },
    {
      id: 'power',
      name: '功率',
      params: {
        F: { name: '力 F', unit: 'N', default: 100, step: 1, precision: 4 },
        v: { name: '速度 v', unit: 'm/s', default: 5, step: 0.1, precision: 4 }
      },
      results: [
        { id: 'P', name: '功率 P', unit: 'W', formula: (p) => p.F * p.v }
      ]
    },
    {
      id: 'rotational-power',
      name: '功率（旋转）',
      params: {
        T: { name: '转矩 T', unit: 'N·m', default: 10, step: 0.1, precision: 4 },
        omega: { name: '角速度 ω', unit: 'rad/s', default: 10, step: 0.1, precision: 4 }
      },
      results: [
        { id: 'P', name: '功率 P', unit: 'W', formula: (p) => p.T * p.omega }
      ]
    },
    {
      id: 'kinetic-energy',
      name: '动能',
      params: {
        m: { name: '质量 m', unit: 'kg', default: 1, step: 0.1, precision: 4 },
        v: { name: '速度 v', unit: 'm/s', default: 10, step: 0.1, precision: 4 }
      },
      results: [
        { id: 'Ek', name: '动能 Ek', unit: 'J', formula: (p) => 0.5 * p.m * p.v * p.v }
      ]
    },
    {
      id: 'gravitational-potential-energy',
      name: '重力势能',
      params: {
        m: { name: '质量 m', unit: 'kg', default: 1, step: 0.1, precision: 4 },
        h: { name: '高度 h', unit: 'm', default: 10, step: 0.1, precision: 4 }
      },
      results: [
        { id: 'Ep', name: '重力势能 Ep', unit: 'J', formula: (p) => p.m * 9.8 * p.h }
      ]
    },
    {
      id: 'elastic-potential-energy',
      name: '弹性势能',
      params: {
        k: { name: '劲度系数 k', unit: 'N/m', default: 100, step: 1, precision: 4 },
        x: { name: '形变量 x', unit: 'm', default: 0.01, step: 0.001, precision: 6 }
      },
      results: [
        { id: 'Ee', name: '弹性势能 Ee', unit: 'J', formula: (p) => 0.5 * p.k * p.x * p.x }
      ]
    },
    {
      id: 'momentum',
      name: '动量',
      params: {
        m: { name: '质量 m', unit: 'kg', default: 1, step: 0.1, precision: 4 },
        v: { name: '速度 v', unit: 'm/s', default: 10, step: 0.1, precision: 4 }
      },
      results: [
        { id: 'p', name: '动量 p', unit: 'kg·m/s', formula: (p) => p.m * p.v }
      ]
    },
    {
      id: 'impulse',
      name: '冲量',
      params: {
        F: { name: '力 F', unit: 'N', default: 100, step: 1, precision: 4 },
        t: { name: '时间 t', unit: 's', default: 0.1, step: 0.01, precision: 4 }
      },
      results: [
        { id: 'I', name: '冲量 I', unit: 'N·s', formula: (p) => p.F * p.t }
      ]
    },
    {
      id: 'rotational-kinetic-energy',
      name: '转动动能',
      params: {
        J: { name: '转动惯量 J', unit: 'kg·m²', default: 0.01, step: 0.001, precision: 6 },
        omega: { name: '角速度 ω', unit: 'rad/s', default: 10, step: 0.1, precision: 4 }
      },
      results: [
        { id: 'Ek', name: '转动动能 Ek', unit: 'J', formula: (p) => 0.5 * p.J * p.omega * p.omega }
      ]
    },
    {
      id: 'torque',
      name: '转矩',
      params: {
        F: { name: '力 F', unit: 'N', default: 100, step: 1, precision: 4 },
        r: { name: '力臂 r', unit: 'm', default: 0.1, step: 0.01, precision: 4 }
      },
      results: [
        { id: 'T', name: '转矩 T', unit: 'N·m', formula: (p) => p.F * p.r }
      ]
    }
  ]
}
