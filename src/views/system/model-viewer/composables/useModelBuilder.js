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

    // 主题感知：暗色主题下边线用亮灰色，亮色主题下用深灰色，保证轮廓清晰可见
    const isDarkTheme = document.documentElement.classList.contains('dark')
    const visibleEdgeColor = isDarkTheme ? 0xc2cbd6 : 0x2c333d
    const hiddenEdgeColor = isDarkTheme ? 0x5c6672 : 0x9aa1a8

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

      // 颜色处理：优先使用模型自带颜色，否则使用默认金属灰（略深，保证亮/暗背景下都清晰）
      let color = 0xa8b0b8
      if (meshData.color && Array.isArray(meshData.color) && meshData.color.length >= 3) {
        color = new THREE.Color(meshData.color[0], meshData.color[1], meshData.color[2])
      }

      // ========== 材质：纯漫反射（无金属/清漆高光，无环境反射） ==========
      // 用户要求：不要反光、不要"内部亮物"效果、顶底无色差。
      // metalness=0 / roughness=1 / clearcoat=0 → 完全漫反射，只响应漫反射光照。
      const material = new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0,
        roughness: 1,
        clearcoat: 0,
        clearcoatRoughness: 1,
        reflectivity: 0,
        side: THREE.DoubleSide,
        flatShading: false
      })

      const mesh = new THREE.Mesh(geometry, material)
      mesh.name = meshData.name || 'Mesh'
      mesh.castShadow = true
      mesh.receiveShadow = true
      modelGroup.value.add(mesh)

      // ========== 轮廓/工程图线框：可见边（实线）+ 隐藏边（虚线）==========
      // 阈值 10°：比默认 15° 生成更多棱线，曲面（圆柱/圆角）轮廓更"实"
      const edgesGeo = new THREE.EdgesGeometry(geometry, 10)

      // 可见轮廓线：实体模式显示淡色轮廓（增强边缘清晰度），线框模式加深
      const visibleEdgesMat = new THREE.LineBasicMaterial({
        color: visibleEdgeColor,
        depthTest: true,
        depthWrite: false,
        transparent: true,
        opacity: 0.6
      })
      const visibleEdges = new THREE.LineSegments(edgesGeo, visibleEdgesMat)
      visibleEdges.name = (meshData.name || 'Mesh') + '_visibleEdges'
      visibleEdges.visible = true  // 实体模式默认显示淡色轮廓线
      modelGroup.value.add(visibleEdges)

      // 隐藏轮廓线：虚线，只显示被遮挡的边（仅线框模式显示）
      const hiddenEdgesMat = new THREE.LineDashedMaterial({
        color: hiddenEdgeColor,
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
      hiddenEdges.visible = false  // 仅线框模式显示
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
