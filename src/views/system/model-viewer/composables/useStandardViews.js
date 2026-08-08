import { ref } from 'vue'
import * as THREE from 'three'

const VIEW_DIRECTIONS = {
  front:  { dir: [0, 0, 1], up: [0, 1, 0] },
  back:   { dir: [0, 0, -1], up: [0, 1, 0] },
  top:    { dir: [0, 1, 0], up: [0, 0, -1] },
  bottom: { dir: [0, -1, 0], up: [0, 0, 1] },
  left:   { dir: [-1, 0, 0], up: [0, 1, 0] },
  right:  { dir: [1, 0, 0], up: [0, 1, 0] },
  iso:    { dir: [1, 1, 1], up: [0, 1, 0] }
}

export function useStandardViews(camera, controls, modelGroup) {
  const currentView = ref('iso')

  function computeCameraDistance() {
    if (!modelGroup.value || modelGroup.value.children.length === 0 || !camera.value) return null
    const box = new THREE.Box3().setFromObject(modelGroup.value)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = camera.value.fov * (Math.PI / 180)
    const dist = maxDim / (2 * Math.tan(fov / 2))
    return { center, maxDim, dist, size }
  }

  function resetView() {
    const info = computeCameraDistance()
    if (!info) return
    const { center, maxDim, dist } = info

    const dir = new THREE.Vector3(1, 1, 1).normalize()
    const viewDist = dist * 1.8

    camera.value.position.set(
      center.x + dir.x * viewDist,
      center.y + dir.y * viewDist,
      center.z + dir.z * viewDist
    )
    camera.value.up.set(0, 1, 0)
    controls.value.target.copy(center)
    camera.value.lookAt(center)
    controls.value.update()
    controls.value.minDistance = maxDim * 0.15
    controls.value.maxDistance = maxDim * 15
    currentView.value = 'iso'
  }

  function setStandardView(viewName) {
    if (!camera.value || !controls.value || !modelGroup.value) return
    const info = computeCameraDistance()
    if (!info) return
    const { center, maxDim, dist } = info

    const v = VIEW_DIRECTIONS[viewName]
    if (!v) return

    const dir = new THREE.Vector3(...v.dir).normalize()
    const viewDist = dist * 1.8  // 增大距离，减小透视效果

    camera.value.position.set(
      center.x + dir.x * viewDist,
      center.y + dir.y * viewDist,
      center.z + dir.z * viewDist
    )
    camera.value.up.set(v.up[0], v.up[1], v.up[2])
    controls.value.target.copy(center)
    camera.value.lookAt(center)
    controls.value.update()
    controls.value.minDistance = maxDim * 0.15
    controls.value.maxDistance = maxDim * 15  // 增大最大距离
    currentView.value = viewName
  }

  function applyCoordSystem(key, coordSystems) {
    if (!modelGroup.value || !camera.value || !controls.value) return
    const sys = coordSystems[key]
    if (!sys) return
    modelGroup.value.rotation.copy(sys.rotation)
    camera.value.up.copy(sys.up)
    controls.value.update()
    resetView()
  }

  return { currentView, resetView, setStandardView, applyCoordSystem, computeCameraDistance }
}
