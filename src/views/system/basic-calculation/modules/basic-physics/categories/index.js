import mechanicsBasics from './mechanics-basics.js'
import kinematics from './kinematics.js'
import dynamics from './dynamics.js'
import materialMechanics from './material-mechanics.js'

export const basicPhysicsCategories = [
  mechanicsBasics,
  kinematics,
  dynamics,
  materialMechanics
]

export function getCategoryById(id) {
  return basicPhysicsCategories.find(c => c.id === id) || basicPhysicsCategories[0]
}

export function getDefaultCategory() {
  return basicPhysicsCategories[0]
}

export function getSubTypeById(categoryId, subTypeId) {
  const cat = getCategoryById(categoryId)
  if (!cat.subTypes) return null
  return cat.subTypes.find(s => s.id === subTypeId) || cat.subTypes[0]
}
