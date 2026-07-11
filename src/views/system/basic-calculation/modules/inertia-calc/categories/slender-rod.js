import ballScrewModelImg from '@/assets/images/ball-screw-model.png'
import motionCurveImg from '@/assets/images/motion-curve.png'

export default {
    id: 'slender-rod',
    name: '细长杆',
    desc: '细长杆绕不同轴的转动惯量计算',
    images: [
      { src: ballScrewModelImg, label: '计算模型' },
      { src: motionCurveImg, label: '计算公式' }
    ],
    subTypes: [
      {
        id: 'straight-rod-1',
        name: '直杆1',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, L: { name: '长度 L', unit: 'm', default: 1, min: 0, step: 0.01, precision: 4 } },
        results: [
          { id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => (1/12) * p.m * p.L * p.L }
        ]
      },
      {
        id: 'straight-rod-2',
        name: '直杆2',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, L: { name: '长度 L', unit: 'm', default: 1, min: 0, step: 0.01, precision: 4 } },
        results: [
          { id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => (1/3) * p.m * p.L * p.L }
        ]
      },
      {
        id: 'arc-rod',
        name: '圆弧杆',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.5, min: 0, step: 0.01, precision: 4 }, theta: { name: '圆心角 θ', unit: 'rad', default: 1.57, min: 0, step: 0.01, precision: 4 } },
        results: [
          { id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * p.R * p.R }
        ]
      },
      {
        id: 'u-rod',
        name: 'U型杆',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, a: { name: '边长 a', unit: 'm', default: 0.3, min: 0, step: 0.01, precision: 4 }, b: { name: '边长 b', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 } },
        results: [
          { id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * (p.a * p.a + p.b * p.b) / 3 }
        ]
      },
      {
        id: 'rect-rod',
        name: '矩形杆',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, a: { name: '边长 a', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 }, b: { name: '边长 b', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 } },
        results: [
          { id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * (p.a * p.a + p.b * p.b) / 12 }
        ]
      },
      {
        id: 'ellipse-rod',
        name: '椭圆杆',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, a: { name: '长半轴 a', unit: 'm', default: 0.3, min: 0, step: 0.01, precision: 4 }, b: { name: '短半轴 b', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 } },
        results: [
          { id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * (p.a * p.a + p.b * p.b) / 4 }
        ]
      },
      {
        id: 'ring-rod',
        name: '圆环杆',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.3, min: 0, step: 0.01, precision: 4 } },
        results: [
          { id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * p.R * p.R }
        ]
      }
    ]
  }
