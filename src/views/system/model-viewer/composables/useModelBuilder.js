import * as THREE from 'three'
import { ElMessage } from 'element-plus'

/**
 * 模型构建 Composable
 * 负责：从 OCCT 解析结果构建 Three.js Mesh、计算体积/尺寸、清理模型
 */
export function useModelBuilder(scene, modelGroup, camera, controls, props, getThemeColor, emit) {

  function getArray(data) {
    if (!data) return null
    if (Array.isArray(data)) return data
    if (data.array) return data.array
    return null
  }

  /**
   * 计算三角网格体积（有向体积法）
   */
  function calcMeshVolume(posArray, indexArray) {
    if (!posArray || !indexArray || indexArray.length < 3) return 0
    let volume = 0
    for (let i = 0; i < indexArray.length; i += 3) {
      const i0 = indexArray[i] * 3, i1 = indexArray[i + 1] * 3, i2 = indexArray[i + 2] * 3
      const x0 = posArray[i0], y0 = posArray[i0 + 1], z0 = posArray[i0 + 2]
      const x1 = posArray[i1], y1 = posArray[i1 + 1], z1 = posArray[i1 + 2]
      const x2 = posArray[i2], y2 = posArray[i2 + 1], z2 = posArray[i2 + 2]
      volume += x0 * (y1 * z2 - z1 * y2) + y0 * (z1 * x2 - x1 * z2) + z0 * (x1 * y2 - y1 * x2)
    }
    return Math.abs(volume) / 6
  }

  /**
   * 根据包围盒计算合适的相机距离
   * 让模型最大边长在视口中占据约 85%，展示更饱满
   */
  function computeCameraDistance(box) {
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = camera.value.fov * (Math.PI / 180)
    const dist = maxDim / (1.7 * Math.tan(fov / 2))
    return { size, maxDim, dist, center: box.getCenter(new THREE.Vector3()) }
  }

  /**
   * 从 OCCT 结果构建 Three.js 模型
   */
  function buildModel(result, fileName) {
    clearModel()
    const meshes = result.meshes || []
    if (meshes.length === 0) {
      ElMessage.warning('文件解析成功但没有网格数据')
      return
    }

    let totalVertices = 0, totalFaces = 0, totalVolume = 0

    meshes.forEach((meshData) => {
      const posArray = getArray(meshData.attributes?.position)
      const normalArray = getArray(meshData.attributes?.normal)
      const indexArray = getArray(meshData.index)
      if (!posArray || !indexArray) return

      totalVolume += calcMeshVolume(posArray, indexArray)

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(posArray, 3))

      if (normalArray && normalArray.length >= posArray.length) {
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normalArray, 3))
      } else {
        geometry.computeVertexNormals()
      }

      geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indexArray), 1))

      // 颜色处理：优先使用模型自带颜色，否则使用默认金属灰
      let color = 0xc0c8d0
      if (meshData.color && Array.isArray(meshData.color) && meshData.color.length >= 3) {
        color = new THREE.Color(meshData.color[0], meshData.color[1], meshData.color[2])
      }

      // ========== 材质优化：使用 MeshPhysicalMaterial 增加质感 ==========
      const material = new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0.4,
        roughness: 0.2,
        clearcoat: 0.6,
        clearcoatRoughness: 0.15,
        reflectivity: 0.8,
        side: THREE.DoubleSide,
        flatShading: false
      })

      const mesh = new THREE.Mesh(geometry, material)
      mesh.name = meshData.name || 'Mesh'
      mesh.castShadow = true
      mesh.receiveShadow = true
      modelGroup.value.add(mesh)

      // ========== 工程图线框：可见边（实线）+ 隐藏边（虚线）==========
      const edgesGeo = new THREE.EdgesGeometry(geometry, 15)

      // 可见轮廓线：实线，深色，正常深度测试
      const visibleEdgesMat = new THREE.LineBasicMaterial({
        color: 0x333333,
        depthTest: true,
        depthWrite: false,
        transparent: true,
        opacity: 0.9
      })
      const visibleEdges = new THREE.LineSegments(edgesGeo, visibleEdgesMat)
      visibleEdges.name = (meshData.name || 'Mesh') + '_visibleEdges'
      visibleEdges.visible = false  // 默认隐藏，线框模式时显示
      modelGroup.value.add(visibleEdges)

      // 隐藏轮廓线：虚线，灰色，只显示被遮挡的边
      const hiddenEdgesMat = new THREE.LineDashedMaterial({
        color: 0xaaaaaa,
        dashSize: 0.8,
        gapSize: 0.5,
        depthTest: true,
        depthFunc: THREE.GreaterEqualDepth,
        depthWrite: false,
        transparent: true,
        opacity: 0.5
      })
      const hiddenEdges = new THREE.LineSegments(edgesGeo.clone(), hiddenEdgesMat)
      hiddenEdges.name = (meshData.name || 'Mesh') + '_hiddenEdges'
      hiddenEdges.visible = false  // 默认隐藏，线框模式时显示
      // 计算虚线距离
      hiddenEdges.computeLineDistances()
      modelGroup.value.add(hiddenEdges)

      totalVertices += posArray.length / 3
      totalFaces += indexArray.length / 3
    })

    if (modelGroup.value.children.length === 0) {
      ElMessage.warning('没有有效的网格数据')
      return
    }

    const box = new THREE.Box3().setFromObject(modelGroup.value)
    const { size, maxDim, dist, center } = computeCameraDistance(box)

    camera.value.position.set(center.x + dist * 0.8, center.y + dist * 0.8, center.z + dist * 0.8)
    camera.value.lookAt(center)
    controls.value.target.copy(center)
    controls.value.update()

    // 包围盒辅助线 - 使用更醒目的颜色
    const boxHelper = new THREE.Box3Helper(box, getThemeColor())
    boxHelper.name = 'BoxHelper'
    modelGroup.value.add(boxHelper)

    // 直接 emit 事件
    emit('volume-calculated', {
      volumeMm3: totalVolume, volumeM3: totalVolume / 1e9,
      massKg: (totalVolume / 1e9) * props.density, density: props.density,
      totalVertices, totalFaces, meshCount: meshes.length,
      sizeX: size.x, sizeY: size.y, sizeZ: size.z, maxDim, fileName
    })
    emit('size-calculated', { x: size.x, y: size.y, z: size.z, maxDim })
  }

  /**
   * 清理模型组中的所有对象并释放资源
   */
  function clearModel() {
    if (!modelGroup.value) return
    while (modelGroup.value.children.length > 0) {
      const child = modelGroup.value.children[0]
      if (child.geometry) child.geometry.dispose()
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose())
        else child.material.dispose()
      }
      modelGroup.value.remove(child)
    }
  }

  return { buildModel, clearModel, calcMeshVolume, computeCameraDistance }
}
