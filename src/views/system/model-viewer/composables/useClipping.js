import { ref } from 'vue'
import * as THREE from 'three'

/**
 * 剖切功能 Composable
 * 负责：剖切平面初始化、更新、切换、资源释放
 */
export function useClipping(scene, modelGroup) {
  const isClipping = ref(false)
  const clipAxis = ref('x')
  const clipPos = ref(0)
  const clipMin = ref(-100)
  const clipMax = ref(100)
  const clipFlip = ref(1)

  let clipPlane = null
  let clipHelper = null
  let clipLine = null

  /**
   * 释放剖切相关资源
   */
  function disposeClipResources() {
    if (clipHelper) {
      clipHelper.geometry?.dispose()
      clipHelper.material?.dispose()
      if (clipHelper.parent) clipHelper.parent.remove(clipHelper)
      clipHelper = null
    }
    if (clipLine) {
      clipLine.geometry?.dispose()
      clipLine.material?.dispose()
      clipLine = null
    }
    clipPlane = null
  }

  /**
   * 根据当前模型计算剖切范围并初始化
   */
  function initClipPlane() {
    if (!modelGroup.value || modelGroup.value.children.length === 0) return

    // 清理旧的资源，避免内存泄漏
    disposeClipResources()

    const box = new THREE.Box3().setFromObject(modelGroup.value)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxSize = Math.max(size.x, size.y, size.z)

    // 默认 X 轴剖切，位置在中心
    clipAxis.value = 'x'
    clipPos.value = center.x
    // 范围留 1.5 倍余量，确保能剖到模型边缘外
    clipMin.value = center.x - maxSize * 1.5
    clipMax.value = center.x + maxSize * 1.5

    clipPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), -center.x)

    const helperSize = maxSize * 2.5
    const helperGeo = new THREE.PlaneGeometry(helperSize, helperSize)
    const helperMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
      depthTest: false
    })
    clipHelper = new THREE.Mesh(helperGeo, helperMat)
    clipHelper.position.copy(center)
    clipHelper.renderOrder = 999
    scene.value.add(clipHelper)

    const edges = new THREE.EdgesGeometry(helperGeo)
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffaa00, linewidth: 2 })
    clipLine = new THREE.LineSegments(edges, lineMat)
    clipLine.renderOrder = 1000
    clipHelper.add(clipLine)
  }

  /**
   * 模型更换后重新初始化剖切
   * 如果剖切当前开启，重新计算范围并立即应用
   * 如果剖切当前关闭，清理旧资源确保下次重新初始化
   */
  function reinitForModel() {
    if (!modelGroup.value || modelGroup.value.children.length === 0) {
      cleanup()
      return
    }
    // 总是重新初始化，确保范围跟随新模型
    initClipPlane()
    if (isClipping.value) {
      if (clipHelper) clipHelper.visible = true
      updateClip()
    } else {
      // 剖切关闭时隐藏 helper
      if (clipHelper) clipHelper.visible = false
      applyClippingToMeshes([])
    }
  }

  /**
   * 统一应用/清除 clippingPlanes 到所有 Mesh
   */
  function applyClippingToMeshes(planes) {
    if (!modelGroup.value) return
    modelGroup.value.children.forEach(child => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        mats.forEach(m => {
          m.clippingPlanes = planes
          m.needsUpdate = true
        })
      }
    })
  }

  /**
   * 更新剖切平面位置和方向
   */
  function updateClip() {
    if (!clipPlane || !modelGroup.value) return

    const normal = new THREE.Vector3()
    if (clipAxis.value === 'x') normal.set(clipFlip.value, 0, 0)
    else if (clipAxis.value === 'y') normal.set(0, clipFlip.value, 0)
    else if (clipAxis.value === 'z') normal.set(0, 0, clipFlip.value)

    const point = new THREE.Vector3()
    if (clipAxis.value === 'x') point.set(clipPos.value, 0, 0)
    else if (clipAxis.value === 'y') point.set(0, clipPos.value, 0)
    else if (clipAxis.value === 'z') point.set(0, 0, clipPos.value)

    clipPlane.setFromNormalAndCoplanarPoint(normal, point)

    if (clipHelper) {
      const box = new THREE.Box3().setFromObject(modelGroup.value)
      const center = box.getCenter(new THREE.Vector3())
      clipHelper.position.set(
        clipAxis.value === 'x' ? clipPos.value : center.x,
        clipAxis.value === 'y' ? clipPos.value : center.y,
        clipAxis.value === 'z' ? clipPos.value : center.z
      )
      if (clipAxis.value === 'x') clipHelper.rotation.set(0, clipFlip.value > 0 ? Math.PI / 2 : -Math.PI / 2, 0)
      else if (clipAxis.value === 'y') clipHelper.rotation.set(clipFlip.value > 0 ? Math.PI / 2 : -Math.PI / 2, 0, 0)
      else if (clipAxis.value === 'z') clipHelper.rotation.set(0, 0, clipFlip.value > 0 ? 0 : Math.PI)
    }

    applyClippingToMeshes(isClipping.value ? [clipPlane] : [])
  }

  /**
   * 切换剖切开关
   */
  function toggleClipping() {
    isClipping.value = !isClipping.value
    if (isClipping.value) {
      // 模型可能已更换，总是重新初始化确保范围正确
      initClipPlane()
      if (clipHelper) clipHelper.visible = true
      updateClip()
    } else {
      if (clipHelper) clipHelper.visible = false
      applyClippingToMeshes([])
    }
  }

  /**
   * 翻转剖切保留侧
   */
  function flipClip() {
    clipFlip.value = -clipFlip.value
    updateClip()
  }

  /**
   * 完全清理剖切状态（组件卸载时调用）
   */
  function cleanup() {
    disposeClipResources()
    isClipping.value = false
  }

  return {
    isClipping, clipAxis, clipPos, clipMin, clipMax, clipFlip,
    initClipPlane, updateClip, toggleClipping, flipClip, cleanup, reinitForModel
  }
}
