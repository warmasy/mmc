export default {
  id: 'kinematics',
  name: '运动学',
  images: [],
  subTypes: [
    {
      id: 'uniform-motion',
      name: '匀速直线运动',
      params: {
        v: { name: '速度 v', unit: 'm/s', default: 10, step: 0.1, precision: 4 },
        t: { name: '时间 t', unit: 's', default: 5, step: 0.1, precision: 4 }
      },
      results: [
        { id: 's', name: '位移 s', unit: 'm', formula: (p) => p.v * p.t }
      ]
    },
    {
      id: 'uniform-acceleration',
      name: '匀加速直线运动',
      params: {
        v0: { name: '初速度 v₀', unit: 'm/s', default: 0, step: 0.1, precision: 4 },
        a: { name: '加速度 a', unit: 'm/s²', default: 2, step: 0.1, precision: 4 },
        t: { name: '时间 t', unit: 's', default: 5, step: 0.1, precision: 4 }
      },
      results: [
        { id: 'v', name: '末速度 v', unit: 'm/s', formula: (p) => p.v0 + p.a * p.t },
        { id: 's', name: '位移 s', unit: 'm', formula: (p) => p.v0 * p.t + 0.5 * p.a * p.t * p.t }
      ]
    },
    {
      id: 'circular-linear-velocity',
      name: '圆周运动线速度',
      params: {
        r: { name: '半径 r', unit: 'm', default: 0.1, step: 0.01, precision: 4 },
        T: { name: '周期 T', unit: 's', default: 1, step: 0.1, precision: 4 }
      },
      results: [
        { id: 'v', name: '线速度 v', unit: 'm/s', formula: (p) => 2 * Math.PI * p.r / p.T }
      ]
    },
    {
      id: 'circular-angular-velocity',
      name: '圆周运动角速度',
      params: {
        T: { name: '周期 T', unit: 's', default: 1, step: 0.1, precision: 4 }
      },
      results: [
        { id: 'omega', name: '角速度 ω', unit: 'rad/s', formula: (p) => 2 * Math.PI / p.T }
      ]
    },
    {
      id: 'centripetal-acceleration',
      name: '向心加速度',
      params: {
        v: { name: '线速度 v', unit: 'm/s', default: 10, step: 0.1, precision: 4 },
        r: { name: '半径 r', unit: 'm', default: 0.1, step: 0.01, precision: 4 }
      },
      results: [
        { id: 'a', name: '向心加速度 a', unit: 'm/s²', formula: (p) => p.v * p.v / p.r }
      ]
    }
  ]
}
