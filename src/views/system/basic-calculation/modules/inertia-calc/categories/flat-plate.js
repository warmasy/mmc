import ballScrewModelImg from '@/assets/images/ball-screw-model.png'
import motionCurveImg from '@/assets/images/motion-curve.png'

export default {
    id: 'flat-plate',
    name: '平面板',
    desc: '平面板绕不同轴的转动惯量计算',
    images: [
      { src: ballScrewModelImg, label: '计算模型' },
      { src: motionCurveImg, label: '计算公式' }
    ],
    subTypes: [
      {
        id: 'triangle-plate',
        name: '三角形平板',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, a: { name: '底边 a', unit: 'm', default: 0.3, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * p.h * p.h / 6 }]
      },
      {
        id: 'rect-plate',
        name: '矩形',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, a: { name: '长 a', unit: 'm', default: 0.4, min: 0, step: 0.01, precision: 4 }, b: { name: '宽 b', unit: 'm', default: 0.3, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * (p.a * p.a + p.b * p.b) / 12 }]
      },
      {
        id: 'trapezoid-plate',
        name: '梯形',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, a: { name: '上底 a', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 }, b: { name: '下底 b', unit: 'm', default: 0.4, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * (p.a * p.a + p.b * p.b + 4 * p.h * p.h) / 36 }]
      },
      {
        id: 'regular-n-polygon',
        name: '正n边形',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, n: { name: '边数 n', unit: '', default: 6, min: 3, step: 1, precision: 0 }, a: { name: '边长 a', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * p.a * p.a * (1 + 3 / Math.tan(Math.PI / p.n) / Math.tan(Math.PI / p.n)) / 24 }]
      },
      {
        id: 'circle-plate',
        name: '圆板',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => 0.5 * p.m * p.R * p.R }]
      },
      {
        id: 'semicircle-plate',
        name: '半圆板',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * p.R * p.R * (0.5 - 16 / (9 * Math.PI * Math.PI)) }]
      },
      {
        id: 'ring-plate',
        name: '圆环',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '外半径 R', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 }, r: { name: '内半径 r', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => 0.5 * p.m * (p.R * p.R + p.r * p.r) }]
      },
      {
        id: 'sector-plate',
        name: '扇形',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 }, theta: { name: '圆心角 θ', unit: 'rad', default: 1.57, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => 0.5 * p.m * p.R * p.R }]
      },
      {
        id: 'segment-plate',
        name: '弓形',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 }, h: { name: '弓高 h', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * p.R * p.R * (1 - p.h / p.R * p.h / p.R / 2) }]
      },
      {
        id: 'ellipse-plate',
        name: '椭圆形',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, a: { name: '长半轴 a', unit: 'm', default: 0.3, min: 0, step: 0.01, precision: 4 }, b: { name: '短半轴 b', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => 0.25 * p.m * (p.a * p.a + p.b * p.b) }]
      },
      {
        id: 'parabola-plate',
        name: '抛物线型',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, a: { name: '参数 a', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 }, b: { name: '参数 b', unit: 'm', default: 0.3, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * (p.a * p.a + p.b * p.b) / 7 }]
      },
      {
        id: 'rect-prism-plate',
        name: '矩形棱柱',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, a: { name: '边长 a', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 }, b: { name: '边长 b', unit: 'm', default: 0.15, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.3, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * (p.a * p.a + p.b * p.b) / 12 }]
      },
      {
        id: 'right-pyramid-plate',
        name: '正直角锥柱',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, a: { name: '底边 a', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.3, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * (p.a * p.a / 6 + p.h * p.h / 2) }]
      },
      {
        id: 'triangular-prism-plate',
        name: '正三角柱',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, a: { name: '边长 a', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.3, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * (p.a * p.a / 12 + p.h * p.h / 12) }]
      }
    ]
  }
