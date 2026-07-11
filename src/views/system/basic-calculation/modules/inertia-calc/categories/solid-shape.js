import ballScrewModelImg from '@/assets/images/ball-screw-model.png'
import motionCurveImg from '@/assets/images/motion-curve.png'

export default {
    id: 'solid-shape',
    name: '立体形状',
    desc: '常见立体形状绕中心轴的转动惯量计算',
    images: [
      { src: ballScrewModelImg, label: '计算模型' },
      { src: motionCurveImg, label: '计算公式' }
    ],
    subTypes: [
      {
        id: 'solid-cylinder',
        name: '圆柱体',
      images: [
        { src: '/images/inertia-calc/solid-cylinder-model.svg', label: '模型图' },
        { src: '/images/inertia-calc/solid-cylinder-formula.svg', label: '公式图' }
      ],
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => 0.5 * p.m * p.R * p.R }]
      },
      {
        id: 'hollow-cylinder',
        name: '圆筒体',
      images: [
        { src: '/images/inertia-calc/hollow-cylinder-model.svg', label: '模型图' },
        { src: '/images/inertia-calc/hollow-cylinder-formula.svg', label: '公式图' }
      ],
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '外半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 }, r: { name: '内半径 r', unit: 'm', default: 0.05, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => 0.5 * p.m * (p.R * p.R + p.r * p.r) }]
      },
      {
        id: 'straight-cone',
        name: '直圆锥体',
      images: [
        { src: '/images/inertia-calc/straight-cone-model.svg', label: '模型图' },
        { src: '/images/inertia-calc/straight-cone-formula.svg', label: '公式图' }
      ],
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => 0.3 * p.m * p.R * p.R }]
      },
      {
        id: 'truncated-cone',
        name: '截顶圆锥体',
      images: [
        { src: '/images/inertia-calc/truncated-cone-model.svg', label: '模型图' },
        { src: '/images/inertia-calc/truncated-cone-formula.svg', label: '公式图' }
      ],
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '大半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 }, r: { name: '小半径 r', unit: 'm', default: 0.05, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => 0.3 * p.m * (p.R * p.R + p.r * p.r + p.R * p.r) }]
      },
      {
        id: 'sphere',
        name: '圆球',
      images: [
        { src: '/images/inertia-calc/sphere-model.svg', label: '模型图' },
        { src: '/images/inertia-calc/sphere-formula.svg', label: '公式图' }
      ],
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => 0.4 * p.m * p.R * p.R }]
      },
      {
        id: 'hollow-sphere',
        name: '空心圆球',
      images: [
        { src: '/images/inertia-calc/hollow-sphere-model.svg', label: '模型图' },
        { src: '/images/inertia-calc/hollow-sphere-formula.svg', label: '公式图' }
      ],
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '外半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 }, r: { name: '内半径 r', unit: 'm', default: 0.08, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => 0.4 * p.m * (p.R * p.R * p.R * p.R - p.r * p.r * p.r * p.r) / (p.R * p.R * p.R - p.r * p.r * p.r) / p.R }]
      },
      {
        id: 'hemisphere',
        name: '半球',
      images: [
        { src: '/images/inertia-calc/hemisphere-model.svg', label: '模型图' },
        { src: '/images/inertia-calc/hemisphere-formula.svg', label: '公式图' }
      ],
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => 0.4 * p.m * p.R * p.R * 2 / 5 }]
      },
      {
        id: 'torus',
        name: '圆环',
      images: [
        { src: '/images/inertia-calc/torus-model.svg', label: '模型图' },
        { src: '/images/inertia-calc/torus-formula.svg', label: '公式图' }
      ],
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '大半径 R', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 }, r: { name: '小半径 r', unit: 'm', default: 0.05, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * (p.R * p.R + 0.75 * p.r * p.r) }]
      },
      {
        id: 'partial-sphere',
        name: '部分球体',
      images: [
        { src: '/images/inertia-calc/partial-sphere-model.svg', label: '模型图' },
        { src: '/images/inertia-calc/partial-sphere-formula.svg', label: '公式图' }
      ],
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.05, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => 0.4 * p.m * p.R * p.R * (1 - 0.5 * p.h / p.R) }]
      },
      {
        id: 'spherical-cap',
        name: '球冠',
      images: [
        { src: '/images/inertia-calc/spherical-cap-model.svg', label: '模型图' },
        { src: '/images/inertia-calc/spherical-cap-formula.svg', label: '公式图' }
      ],
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.05, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * p.R * p.R * (1 - 0.5 * p.h / p.R) * 0.4 }]
      },
      {
        id: 'ellipse-torus',
        name: '椭圆截面圆环',
      images: [
        { src: '/images/inertia-calc/ellipse-torus-model.svg', label: '模型图' },
        { src: '/images/inertia-calc/ellipse-torus-formula.svg', label: '公式图' }
      ],
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '大半径 R', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 }, a: { name: '长半轴 a', unit: 'm', default: 0.05, min: 0, step: 0.01, precision: 4 }, b: { name: '短半轴 b', unit: 'm', default: 0.03, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * (p.R * p.R + 0.75 * (p.a * p.a + p.b * p.b) / 2) }]
      },
      {
        id: 'rect-torus',
        name: '矩形截面圆环',
      images: [
        { src: '/images/inertia-calc/rect-torus-model.svg', label: '模型图' },
        { src: '/images/inertia-calc/rect-torus-formula.svg', label: '公式图' }
      ],
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '大半径 R', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 }, a: { name: '宽 a', unit: 'm', default: 0.05, min: 0, step: 0.01, precision: 4 }, b: { name: '高 b', unit: 'm', default: 0.03, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * (p.R * p.R + (p.a * p.a + p.b * p.b) / 12) }]
      }
    ]
  }
