// ==================== 伺服电机选型 - 计算逻辑 ====================

/**
 * 伺服电机选型计算
 * @param {Object} form - 表单参数对象
 * @returns {Object} { result: 计算结果对象, status: 状态文本, inertiaRatio: 惯量比 }
 */
export function calculateServoMotor(form) {
  const mode = form.motionMode
  const mass = form.loadMass || 0
  const stroke = form.stroke || 0
  const accel = form.acceleration || 0
  const friction = form.frictionCoeff || 0
  const extForce = form.externalForce || 0
  const efficiency = form.efficiency || 0.9
  const safety = form.safetyFactor || 1.5
  const lead = form.screwLead || 10
  const ratio = form.gearRatio || 1
  const motorInertia = form.motorInertia || 0

  let loadTorque, accelTorque, peakTorque, ratedTorque, maxSpeed, loadInertia
  const g = 9.8

  if (mode === 'screw') {
    // 丝杠传动
    const frictionTorque = mass * g * friction * lead / (2 * Math.PI * efficiency) / 1000
    const extTorque = extForce * lead / (2 * Math.PI * efficiency) / 1000
    loadTorque = (frictionTorque + extTorque) * safety

    const screwInertia = 0.5 * 7.8e3 * Math.PI * Math.pow(lead / 1000, 2) * stroke / 1000 * Math.pow(form.screwDiameter / 2000, 2)
    loadInertia = mass * Math.pow(lead / (2000 * Math.PI), 2) + (screwInertia || 0)
    accelTorque = loadInertia * accel / (lead / 1000) * (2 * Math.PI) / 60 / efficiency * safety

    maxSpeed = (form.maxSpeed || 0) * 60 / lead * ratio
  } else if (mode === 'reducer') {
    // 减速机驱动
    const radius = 0.05
    loadTorque = (mass * g * friction * radius + extForce * radius) * safety / efficiency
    loadInertia = mass * radius * radius
    loadInertia = loadInertia / (ratio * ratio)
    loadTorque = loadTorque / ratio
    accelTorque = loadInertia * accel / radius * (2 * Math.PI) / 60 / efficiency * safety
    maxSpeed = (form.maxSpeed || 0) / (2 * Math.PI * radius) * 60 / ratio
  } else {
    // 直接驱动
    const radius = 0.05
    loadTorque = (mass * g * friction * radius + extForce * radius) * safety / efficiency
    loadInertia = mass * radius * radius
    accelTorque = loadInertia * accel / radius * (2 * Math.PI) / 60 / efficiency * safety
    maxSpeed = (form.maxSpeed || 0) / (2 * Math.PI * radius) * 60
  }

  peakTorque = loadTorque + accelTorque
  ratedTorque = loadTorque * 1.2

  let inertiaRatio = 0
  if (motorInertia > 0) {
    inertiaRatio = loadInertia / motorInertia
  }

  const result = {
    loadTorque: loadTorque.toFixed(3),
    accelTorque: accelTorque.toFixed(3),
    peakTorqueReq: peakTorque.toFixed(3),
    ratedTorqueReq: ratedTorque.toFixed(3),
    maxSpeed: maxSpeed.toFixed(0)
  }

  // 生成状态文本
  let status = '计算完成'
  if (inertiaRatio > 10 && inertiaRatio <= 30) {
    status += ' | 惯量比偏大，建议选用高惯量电机'
  } else if (inertiaRatio > 30) {
    status += ' | 惯量比过大，建议增加减速比或更换电机系列'
  } else if (inertiaRatio > 0) {
    status += ' | 惯量比良好'
  }

  return { result, status, inertiaRatio }
}

/**
 * 获取惯量比显示值
 * @param {Object} form - 表单参数
 * @returns {string} 惯量比字符串
 */
export function getInertiaRatioDisplay(form) {
  if (form.motorInertia > 0 && form.loadInertia > 0) {
    return (form.loadInertia / form.motorInertia).toFixed(2)
  }
  return '0.00'
}

/**
 * 验证参数是否有效
 * @param {Object} form - 表单参数
 * @returns {string|null} 错误信息，null 表示验证通过
 */
export function validateParams(form) {
  if (form.loadMass <= 0) return '负载质量必须大于 0'
  if (form.stroke <= 0) return '行程必须大于 0'
  if (form.acceleration <= 0) return '加速度必须大于 0'
  if (form.efficiency <= 0 || form.efficiency > 1) return '机械效率必须在 0~1 之间'
  if (form.safetyFactor < 1) return '安全系数必须大于等于 1'
  if (form.motionMode === 'screw' && form.screwLead <= 0) return '丝杠导程必须大于 0'
  if (form.motionMode === 'reducer' && form.gearRatio < 1) return '减速比必须大于等于 1'
  return null
}
