// ==================== 直线电机选型 - 计算逻辑（预留框架） ====================

export function calculateLinearMotor(form) {
  // 预留计算逻辑
  const mass = form.loadMass || 0
  const accel = form.acceleration || 0
  const extForce = form.externalForce || 0

  const peakForce = mass * accel + extForce
  const ratedForce = peakForce * (form.dutyCycle || 50) / 100

  return {
    result: {
      peakForce: peakForce.toFixed(1),
      ratedForce: ratedForce.toFixed(1),
      maxTemp: '45'
    },
    status: '计算完成（直线电机）',
    inertiaRatio: 0
  }
}

export function validateParams(form) {
  if (form.loadMass <= 0) return '负载质量必须大于 0'
  if (form.acceleration <= 0) return '加速度必须大于 0'
  return null
}
