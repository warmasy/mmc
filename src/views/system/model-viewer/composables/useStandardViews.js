import { ref } from 'vue'
import * as THREE from 'three'

// 标准视图方向常量（避免每次调用都创建 Vector3）
const VIEW_DIRECTIONS = {
  front:  { dir: [0, 0, 1], up: [0, 1, 0] },
  back:   { dir: [0, 0, -1], up: [0, 1, 0] },
  top:    { dir: [0, 1, 0], up: [0, 0, -1] },
  bottom: { dir: [0, -1, 0], up: [0, 0, 1] },
  left:   { dir: [-1, 0, 0], up: [0, 1, 0] },
  right:  { dir: [1, 0, 0], up: [0, 1, 0] },
  iso:    { dir: [0.8, 0.8, 0.8], up: [0, 1, 0] }
}

/**
 * 标准视图 Composable
 * 负责：标准视角切换、重置视角、坐标系应用
 */
export function useStandardViews(camera, controls, modelGroup) {
  const currentView = ref('iso') // 默认轴测图

  /**
   * 计算合适的相机距离
   */
  function computeCameraDistance() {
    if (!modelGroup.value || modelGroup.value.children.length === 0 || !camera.value) return null
    const box = new THREE.Box3().setFromObject(modelGroup.value)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = camera.value.fov * (Math.PI / 180)
    // 让模型最大边长在视口中占据约 85%，比原来更大更饱满
    const dist = maxDim / (1.7 * Math.tan(fov / 2))
    return { center, maxDim, dist, size }
  }

  /**
   * 重置视角（轴测图）
   */
  function resetView() {
    const info = computeCameraDistance()
    if (!info) return
    const { center, dist, maxDim } = info
    camera.value.position.set(center.x + dist * 0.8, center.y + dist * 0.8, center.z + dist * 0.8)
    camera.value.lookAt(center)
    controls.value.target.copy(center)
    controls.value.update()
    // 设置缩放范围，防止模型缩得太小或太大
    controls.value.minDistance = maxDim * 0.15
    controls.value.maxDistance = maxDim * 15
    currentView.value = 'iso'
  }

  /**
   * 切换到标准视图
   */
  function setStandardView(viewName) {
    if (!camera.value || !controls.value || !modelGroup.value) return
    const box = new THREE.Box3().setFromObject(modelGroup.value)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    // 标准视图距离也优化，让模型更饱满
    const dist = maxDim / (1.7 * Math.tan(camera.value.fov * Math.PI / 360)) * 1.2

    const v = VIEW_DIRECTIONS[viewName]
    if (!v) return

    camera.value.position.set(
      center.x + v.dir[0] * dist,
      center.y + v.dir[1] * dist,
      center.z + v.dir[2] * dist
    )
    camera.value.up.set(v.up[0], v.up[1], v.up[2])
    controls.value.target.copy(center)
    camera.value.lookAt(center)
    controls.value.update()
    // 设置缩放范围
    controls.value.minDistance = maxDim * 0.15
    controls.value.maxDistance = maxDim * 15
    currentView.value = viewName
  }

  /**
   * 应用坐标系旋转
   */
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
