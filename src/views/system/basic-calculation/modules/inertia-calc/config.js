import ballScrewModelImg from '@/assets/images/ball-screw-model.png'
import motionCurveImg from '@/assets/images/motion-curve.png'

// ==================== 惯量计算 - 完整配置 ====================

export const inertiaCategories = [
  {
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
  },
  {
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
  },
  {
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
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => 0.5 * p.m * p.R * p.R }]
      },
      {
        id: 'hollow-cylinder',
        name: '圆筒体',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '外半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 }, r: { name: '内半径 r', unit: 'm', default: 0.05, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => 0.5 * p.m * (p.R * p.R + p.r * p.r) }]
      },
      {
        id: 'straight-cone',
        name: '直圆锥体',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => 0.3 * p.m * p.R * p.R }]
      },
      {
        id: 'truncated-cone',
        name: '截顶圆锥体',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '大半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 }, r: { name: '小半径 r', unit: 'm', default: 0.05, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => 0.3 * p.m * (p.R * p.R + p.r * p.r + p.R * p.r) }]
      },
      {
        id: 'sphere',
        name: '圆球',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => 0.4 * p.m * p.R * p.R }]
      },
      {
        id: 'hollow-sphere',
        name: '空心圆球',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '外半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 }, r: { name: '内半径 r', unit: 'm', default: 0.08, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => 0.4 * p.m * (p.R * p.R * p.R * p.R - p.r * p.r * p.r * p.r) / (p.R * p.R * p.R - p.r * p.r * p.r) / p.R }]
      },
      {
        id: 'hemisphere',
        name: '半球',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => 0.4 * p.m * p.R * p.R * 2 / 5 }]
      },
      {
        id: 'torus',
        name: '圆环',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '大半径 R', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 }, r: { name: '小半径 r', unit: 'm', default: 0.05, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * (p.R * p.R + 0.75 * p.r * p.r) }]
      },
      {
        id: 'partial-sphere',
        name: '部分球体',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.05, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => 0.4 * p.m * p.R * p.R * (1 - 0.5 * p.h / p.R) }]
      },
      {
        id: 'spherical-cap',
        name: '球冠',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.05, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * p.R * p.R * (1 - 0.5 * p.h / p.R) * 0.4 }]
      },
      {
        id: 'ellipse-torus',
        name: '椭圆截面圆环',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '大半径 R', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 }, a: { name: '长半轴 a', unit: 'm', default: 0.05, min: 0, step: 0.01, precision: 4 }, b: { name: '短半轴 b', unit: 'm', default: 0.03, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * (p.R * p.R + 0.75 * (p.a * p.a + p.b * p.b) / 2) }]
      },
      {
        id: 'rect-torus',
        name: '矩形截面圆环',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '大半径 R', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 }, a: { name: '宽 a', unit: 'm', default: 0.05, min: 0, step: 0.01, precision: 4 }, b: { name: '高 b', unit: 'm', default: 0.03, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * (p.R * p.R + (p.a * p.a + p.b * p.b) / 12) }]
      }
    ]
  },
  {
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
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * p.R * p.R }]
      },
      {
        id: 'cylinder-full',
        name: '圆柱全表面',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * p.R * p.R * (1 + p.h * p.h / (6 * p.R * p.R)) }]
      },
      {
        id: 'cone-lateral',
        name: '圆锥侧表面',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * p.R * p.R * (1 + p.h * p.h / (2 * p.R * p.R)) / 2 }]
      },
      {
        id: 'truncated-cone-lateral',
        name: '截顶圆锥侧表面',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '大半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 }, r: { name: '小半径 r', unit: 'm', default: 0.05, min: 0, step: 0.01, precision: 4 }, h: { name: '高 h', unit: 'm', default: 0.2, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => p.m * (p.R * p.R + p.r * p.r) / 2 }]
      },
      {
        id: 'hemisphere-surface',
        name: '半球面',
        params: { m: { name: '质量 m', unit: 'kg', default: 1, min: 0, step: 0.1, precision: 4 }, R: { name: '半径 R', unit: 'm', default: 0.1, min: 0, step: 0.01, precision: 4 } },
        results: [{ id: 'J', name: '转动惯量 J', unit: 'kg·m²', formula: (p) => 2 * p.m * p.R * p.R / 3 }]
      }
    ]
  }
]

export function getCategoryById(id) {
  return inertiaCategories.find(c => c.id === id) || inertiaCategories[0]
}

export function getDefaultCategory() {
  return inertiaCategories[0]
}

export function getSubTypeById(categoryId, subTypeId) {
  const cat = getCategoryById(categoryId)
  if (!cat.subTypes) return null
  return cat.subTypes.find(s => s.id === subTypeId) || cat.subTypes[0]
}
