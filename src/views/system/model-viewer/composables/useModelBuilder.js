import * as THREE from 'three'
import { ElMessage } from 'element-plus'

/**
 * 模型构建 Composable
 * 负责：从 OCCT 解析结果构建 Three.js Mesh、计算体积/尺寸、清理模型
 */
export function useModelBuilder(scene, modelGroup, camera, controls, props, getThemeColor, emit) {

  /**
   * 把 EdgesGeometry（每 2 个顶点一条线段）扩成四边形条带网格，得到任意宽度的"粗边线"。
   * 关键：条带沿"顶点法线方向"凸出模型表面（深度严格小于表面）→
   * 深度测试必然通过，不会有共面 z-fighting 导致部分边线消失。
   */
  function buildThickEdges(edgesGeo, geo, width) {
    // 法线查找表：位置 → 法线（EdgesGeometry 顶点位置与原几何一致）
    const normalMap = new Map()
    if (geo.attributes.normal) {
      const gpos = geo.attributes.position
      const gno = geo.attributes.normal
      for (let i = 0; i < gpos.count; i++) {
        const key = `${gpos.getX(i).toFixed(5)},${gpos.getY(i).toFixed(5)},${gpos.getZ(i).toFixed(5)}`
        if (!normalMap.has(key)) {
          normalMap.set(key, new THREE.Vector3(gno.getX(i), gno.getY(i), gno.getZ(i)).normalize())
        }
      }
    }

    const pos = edgesGeo.attributes.position
    const count = pos.count
    const quads = Math.floor(count / 2)
    const positions = new Float32Array(quads * 4 * 3)
    const indices = []
    const p1 = new THREE.Vector3()
    const p2 = new THREE.Vector3()
    const dir = new THREE.Vector3()
    const n = new THREE.Vector3()
    const up = new THREE.Vector3(0, 1, 0)
    const alt = new THREE.Vector3(1, 0, 0)
    const keyOf = (v) => `${v.x.toFixed(5)},${v.y.toFixed(5)},${v.z.toFixed(5)}`
    for (let i = 0; i < quads; i++) {
      p1.fromBufferAttribute(pos, i * 2)
      p2.fromBufferAttribute(pos, i * 2 + 1)
      // 偏移方向：两端顶点法线的平均（凸出模型表面）；法线缺失时兜底用边垂直方向
      const n1 = normalMap.get(keyOf(p1))
      const n2 = normalMap.get(keyOf(p2))
      if (n1 && n2) {
        n.copy(n1).add(n2).normalize()
      } else {
        dir.subVectors(p2, p1)
        n.crossVectors(dir, Math.abs(dir.y) < 0.999 ? up : alt)
        if (n.lengthSq() < 1e-12) n.set(0, 1, 0)
        n.normalize()
      }
      n.multiplyScalar(width / 2)
      const b = i * 12
      positions[b] = p1.x + n.x; positions[b + 1] = p1.y + n.y; positions[b + 2] = p1.z + n.z
      positions[b + 3] = p1.x - n.x; positions[b + 4] = p1.y - n.y; positions[b + 5] = p1.z - n.z
      positions[b + 6] = p2.x + n.x; positions[b + 7] = p2.y + n.y; positions[b + 8] = p2.z + n.z
      positions[b + 9] = p2.x - n.x; positions[b + 10] = p2.y - n.y; positions[b + 11] = p2.z - n.z
      const vi = i * 4
      indices.push(vi, vi + 2, vi + 1, vi + 1, vi + 2, vi + 3)
    }
    const geo2 = new THREE.BufferGeometry()
    geo2.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo2.setIndex(indices)
    geo2.computeVertexNormals()
    return geo2
  }

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

    // 主题感知：暗色主题下边线用亮灰色，亮色主题下用深黑色（白模型衬托下更清晰）
    const isDarkTheme = document.documentElement.classList.contains('dark')
    const visibleEdgeColor = isDarkTheme ? 0xcdd5e0 : 0x14181e
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

      // 颜色处理：优先使用模型自带颜色，否则使用默认银白（#fcfcfc）
      let color = 0xfcfcfc
      if (meshData.color && Array.isArray(meshData.color) && meshData.color.length >= 3) {
        color = new THREE.Color(meshData.color[0], meshData.color[1], meshData.color[2])
      }

      // ========== 材质：哑光金属（CAD 带边着色质感） ==========
      // roughness 0.45 → 柔和漫反射为主、轻微光泽（类似 SolidWorks 表面）；
      // clearcoat 0（无清漆镜面反射，避免刺眼反光）；envMapIntensity 低 → 环境光柔和。
      const material = new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0.3,
        roughness: 0.4,
        clearcoat: 0,
        clearcoatRoughness: 1,
        reflectivity: 1,
        envMapIntensity: 0.7,
        side: THREE.DoubleSide,
        flatShading: false
      })

      const mesh = new THREE.Mesh(geometry, material)
      mesh.name = meshData.name || 'Mesh'
      mesh.castShadow = true
      mesh.receiveShadow = true
      modelGroup.value.add(mesh)

      // ========== 轮廓/工程图线框：可见边（实线）+ 隐藏边（虚线）==========
      // 阈值 8°：比 10° 生成更多棱线，曲面轮廓更"实"、更清晰
      const edgesGeo = new THREE.EdgesGeometry(geometry, 8)

      // 可见轮廓线：带状粗边线（WebGL 线宽限制 1px，LineSegments 太细不明显，
      // 把每条线段扩成四边形条带 → 任意宽度、清晰可见的 CAD 式边线）
      geometry.computeBoundingBox()
      const meshDiag = geometry.boundingBox.getSize(new THREE.Vector3()).length()
      const edgeWidth = Math.max(meshDiag * 0.003, 0.001)
      const visibleEdgesMat = new THREE.MeshBasicMaterial({
        color: visibleEdgeColor,
        depthTest: true,
        depthWrite: false,
        side: THREE.DoubleSide
        // 边线已沿法线凸出表面（不共面），默认 LESS 深度测试即可，无需 polygonOffset
      })
      const visibleEdges = new THREE.Mesh(buildThickEdges(edgesGeo, geometry, edgeWidth), visibleEdgesMat)
      visibleEdges.name = (meshData.name || 'Mesh') + '_visibleEdges'
      visibleEdges.visible = true  // 实体模式默认显示轮廓线
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

    // 注意：不在此处定位相机——初始视图统一由 useStandardViews 的 resetView()
    // （标准轴测图）决定，保证初始视角与"轴测图"按钮取景完全一致、模型完整显示。

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
    // 返回统计信息（供拍照标注等使用）
    return {
      fileName,
      volumeMm3: totalVolume, volumeM3: totalVolume / 1e9,
      massKg: (totalVolume / 1e9) * props.density, density: props.density,
      sizeX: size.x, sizeY: size.y, sizeZ: size.z, maxDim
    }
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
