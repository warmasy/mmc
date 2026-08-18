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
    // 按视口宽高比取"最受限方向"的 fov：窄窗口（aspect<1）下水平方向可容纳更小，
    // 若用垂直 fov 计算距离，模型左右角会被切掉
    const aspect = camera.value.aspect || 1
    const fovH = 2 * Math.atan(Math.tan(fov / 2) * aspect)
    const effFov = Math.min(fov, fovH)
    const dist = maxDim / (2 * Math.tan(effFov / 2))
    return { center, maxDim, dist, size }
  }

  /**
   * 重置视图 = 标准轴测图
   * 直接复用 setStandardView('iso')，保证与工具栏"轴测图"按钮
   * 走完全相同的代码路径、完全相同的取景（模型完整显示）。
   */
  function resetView() {
    setStandardView('iso')
  }

  function setStandardView(viewName) {
    if (!camera.value || !controls.value || !modelGroup.value) return
    const info = computeCameraDistance()
    if (!info) return
    const { center, maxDim, dist } = info

    const v = VIEW_DIRECTIONS[viewName]
    if (!v) return

    const dir = new THREE.Vector3(...v.dir).normalize()
    // 2.2 倍距离：可容纳投影 ≈ 2.2×maxDim，充分大于模型 iso 投影（≈1.63×maxDim），
    // 保证模型任何角都不会超出视口被切
    const viewDist = dist * 2.2

    camera.value.position.set(
      center.x + dir.x * viewDist,
      center.y + dir.y * viewDist,
      center.z + dir.z * viewDist
    )
    camera.value.up.set(v.up[0], v.up[1], v.up[2])
    controls.value.target.copy(center)
    // 视线目标点略微下移：模型在视口中偏上一点，底部轮廓线不被画布边缘切掉
    const lookTarget = center.clone()
    lookTarget.y -= maxDim * 0.06
    camera.value.lookAt(lookTarget)
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
