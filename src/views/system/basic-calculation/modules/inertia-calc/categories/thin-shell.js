import ballScrewModelImg from '@/assets/images/ball-screw-model.png'
import motionCurveImg from '@/assets/images/motion-curve.png'

export default {
    id: 'thin-shell',
    name: '薄壳体',
    desc: '薄壳体绕中心轴的转动惯量计算',
    images: [
      { src: ballScrewModelImg, label: '计算模型' },
      { src: motionCurveImg, label: '计算公式' }
    ],
    subTypes: [
      {
        id: 'cylinder-lateral',
        name: '圆柱侧表面',
      images: [
        { src: '/images/inertia-calc/cylinder-lateral-model.svg', label: '模型图' },
        { src: '/images/inertia-calc/cylinder-lateral-formula.svg', label: '公式图' }
      ],
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * p.R * p.R }]
      },
      {
        id: 'cylinder-full',
        name: '圆柱全表面',
      images: [
        { src: '/images/inertia-calc/cylinder-full-model.svg', label: '模型图' },
        { src: '/images/inertia-calc/cylinder-full-formula.svg', label: '公式图' }
      ],
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * p.R * p.R * (1 + p.h * p.h / (6 * p.R * p.R)) }]
      },
      {
        id: 'cone-lateral',
        name: '圆锥侧表面',
      images: [
        { src: '/images/inertia-calc/cone-lateral-model.svg', label: '模型图' },
        { src: '/images/inertia-calc/cone-lateral-formula.svg', label: '公式图' }
      ],
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * p.R * p.R * (1 + p.h * p.h / (2 * p.R * p.R)) / 2 }]
      },
      {
        id: 'truncated-cone-lateral',
        name: '截顶圆锥侧表面',
      images: [
        { src: '/images/inertia-calc/truncated-cone-lateral-model.svg', label: '模型图' },
        { src: '/images/inertia-calc/truncated-cone-lateral-formula.svg', label: '公式图' }
      ],
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '大半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 }, r: { name: '小半径 r', unit: 'm', default: 0.05, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * (p.R * p.R + p.r * p.r) / 2 }]
      },
      {
        id: 'hemisphere-surface',
        name: '半球面',
      images: [
        { src: '/images/inertia-calc/hemisphere-surface-model.svg', label: '模型图' },
        { src: '/images/inertia-calc/hemisphere-surface-formula.svg', label: '公式图' }
      ],
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => 2 * p.m * p.R * p.R / 3 }]
      }
    ]
  }
