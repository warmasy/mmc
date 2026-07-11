/**
 * 基本计算 - 公共工具函数
 */

/**
 * 格式化数值结果
 * 大数或极小值用科学计数法，普通数用固定精度
 */
export function formatResult(val) {
  if (val === null || val === undefined || isNaN(val)) return '-'
  if (val === 0) return '0'
  const absVal = Math.abs(val)
  if (absVal >= 1e6 || absVal < 1e-4) {
    let exp = val.toExponential(4)
    exp = exp.replace(/\.0+e/, 'e')
    exp = exp.replace(/(\.\d*?)0+e/, '$1e')
    return exp
  }
  if (absVal >= 1) {
    return val.toFixed(4).replace(/\.?0+$/, '')
  }
  return val.toFixed(6).replace(/\.?0+$/, '')
}
