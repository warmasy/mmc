import slenderRod from './slender-rod.js'
import flatPlate from './flat-plate.js'
import solidShape from './solid-shape.js'
import thinShell from './thin-shell.js'

export const inertiaCategories = [
  slenderRod,
  flatPlate,
  solidShape,
  thinShell
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
