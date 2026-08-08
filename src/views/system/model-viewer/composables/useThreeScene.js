import { ref, shallowRef } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Three.js 场景管理 Composable
 * 负责：场景初始化、灯光、HUD坐标轴、动画循环、resize、资源释放
 */
export function useThreeScene(containerRef, props) {
  const scene = shallowRef(null)
  const camera = shallowRef(null)
  const renderer = shallowRef(null)
  const controls = shallowRef(null)
  const modelGroup = shallowRef(null)
  const hudScene = shallowRef(null)
  const hudCamera = shallowRef(null)
  const rafId = ref(null)

  // 背景装饰元素引用（方便主题切换时操作）
  const bgObjects = {
    stars: null,
    gridHelper: null,
    nebula: null
  }

  // 灯光引用，方便后续调整
  const lights = {
    ambient: null,
    key: null,
    fill: null,
    rim: null,
    bottom: null
  }

  // 复用临时对象，避免每帧创建
  const _tempDir = new THREE.Vector3()

  // 坐标系配置（模块级常量，避免重复创建）
  const COORD_SYSTEMS = {
    'y-up': { label: 'Y-up', up: new THREE.Vector3(0, 1, 0), rotation: new THREE.Euler(0, 0, 0) },
    'z-up': { label: 'Z-up', up: new THREE.Vector3(0, 0, 1), rotation: new THREE.Euler(Math.PI / 2, 0, 0) },
    'x-up': { label: 'X-up', up: new THREE.Vector3(1, 0, 0), rotation: new THREE.Euler(0, 0, -Math.PI / 2) }
  }

  function getThemeBgColor(isDark = true) {
    if (isDark) {
      // 宇宙深蓝背景，比纯黑浅一些，带蓝紫色调
      return new THREE.Color(0x141b2d)
    }
    // 亮色主题：柔和浅灰白背景
    return new THREE.Color(0xf5f7fa)
  }

  function getThemeColor() {
    const el = containerRef.value
    if (!el) return 0x409EFF
    const style = getComputedStyle(el)
    const primary = style.getPropertyValue('--el-color-primary').trim()
    if (primary) {
      try {
        const c = new THREE.Color(primary)
        return c.getHex()
      } catch (e) { return 0x409EFF }
    }
    return 0x409EFF
  }

  /**
   * 更新主题（亮色/暗色）
   * @param {boolean} isDark
   */
  function updateTheme(isDark) {
    if (!scene.value) return

    try {
      // 1. 切换背景色
      scene.value.background = getThemeBgColor(isDark)

      // 2. 切换星空粒子可见性（暗色才显示）
      if (bgObjects.stars) {
        bgObjects.stars.visible = isDark
      }

      // 3. 切换星云光晕可见性（暗色才显示）
      if (bgObjects.nebula) {
        bgObjects.nebula.visible = isDark
      }



      // 4. 网格始终隐藏
      if (bgObjects.gridHelper) {
        bgObjects.gridHelper.visible = false
      }

      // 5. 调整环境光强度
      if (lights.ambient) {
        lights.ambient.intensity = isDark ? 0.6 : 0.8
      }
    } catch (e) {
      console.warn('updateTheme error:', e)
    }
  }

  function initThree() {
    const container = containerRef.value
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    // 检测当前主题
    const isDark = document.documentElement.classList.contains('dark')

    scene.value = new THREE.Scene()
    scene.value.background = getThemeBgColor(isDark)

    // ========== 灯光系统（四灯布光：主光+补光+背光+底光）==========
    // 环境光 - 提供基础照明
    lights.ambient = new THREE.AmbientLight(0xffffff, isDark ? 0.6 : 0.8)
    scene.value.add(lights.ambient)

    // 主光（Key Light）- 右上方，产生主要阴影
    lights.key = new THREE.DirectionalLight(0xfff5e6, 2.0)
    lights.key.position.set(20, 30, 20)
    lights.key.castShadow = true
    lights.key.shadow.mapSize.width = 2048
    lights.key.shadow.mapSize.height = 2048
    lights.key.shadow.camera.near = 0.5
    lights.key.shadow.camera.far = 500
    lights.key.shadow.bias = -0.0005
    scene.value.add(lights.key)

    // 补光（Fill Light）- 左前方，柔和填充阴影
    lights.fill = new THREE.DirectionalLight(0xe6f0ff, 0.8)
    lights.fill.position.set(-15, 10, 15)
    scene.value.add(lights.fill)

    // 背光/轮廓光（Rim Light）- 后方，勾勒轮廓
    lights.rim = new THREE.DirectionalLight(0xffffff, 1.5)
    lights.rim.position.set(0, 15, -25)
    scene.value.add(lights.rim)

    // 底光（Bottom Light）- 下方微光，照亮底部阴影
    lights.bottom = new THREE.DirectionalLight(0xddeeff, 0.4)
    lights.bottom.position.set(0, -10, 5)
    scene.value.add(lights.bottom)

    // 半球光 - 模拟天空/地面反射
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5)
    scene.value.add(hemiLight)

    // ========== 透视相机（轴测图用）==========
    camera.value = new THREE.PerspectiveCamera(45, width / height, 0.1, 100000)
    camera.value.position.set(50, 50, 50)
    camera.value.up.copy(COORD_SYSTEMS[props.coordSystem].up)

    // ========== 渲染器 ==========
    renderer.value = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.value.setSize(width, height)
    renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.value.autoClear = false
    renderer.value.localClippingEnabled = true

    // 色调映射 - 让高光更自然，质感更好
    renderer.value.toneMapping = THREE.ACESFilmicToneMapping
    renderer.value.toneMappingExposure = 1.2
    renderer.value.outputColorSpace = THREE.SRGBColorSpace

    // 开启阴影
    renderer.value.shadowMap.enabled = true
    renderer.value.shadowMap.type = THREE.PCFSoftShadowMap

    container.appendChild(renderer.value.domElement)

    // ========== 控制器 ==========
    controls.value = new OrbitControls(camera.value, renderer.value.domElement)
    controls.value.enableDamping = false   // 关闭阻尼，鼠标和模型完全同步，最跟手
    controls.value.mouseButtons = {
      LEFT: null,
      MIDDLE: THREE.MOUSE.ROTATE,
      RIGHT: THREE.MOUSE.PAN
    }
    controls.value.rotateSpeed = 1.5       // 旋转灵敏度提高
    controls.value.minPolarAngle = 0.05
    controls.value.maxPolarAngle = Math.PI - 0.05

    modelGroup.value = new THREE.Group()
    scene.value.add(modelGroup.value)

    // ========== 宇宙星空背景 ==========
    // 星空粒子 - 随机分布的星星（调大更容易看清）
    const starCount = 2000
    const starGeo = new THREE.BufferGeometry()
    const starPositions = new Float32Array(starCount * 3)
    const starSizes = new Float32Array(starCount)
    for (let i = 0; i < starCount; i++) {
      const r = 800 + Math.random() * 1200
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      starPositions[i * 3 + 2] = r * Math.cos(phi)
      starSizes[i] = Math.random() * 4 + 2  // 星星更大
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1))
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 4,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true
    })
    const stars = new THREE.Points(starGeo, starMat)
    stars.name = 'Stars'
    stars.visible = isDark
    bgObjects.stars = stars
    scene.value.add(stars)



    // 宇宙网格 - 极淡的蓝紫色坐标网格（亮色主题下改为浅灰）
    const gridColor1 = isDark ? 0x2a3a5c : 0xc0c4cc
    const gridColor2 = isDark ? 0x1a2538 : 0xe4e7ed
    const gridHelper = new THREE.GridHelper(3000, 60, gridColor1, gridColor2)
    gridHelper.position.y = -600
    gridHelper.name = 'GridHelper'
    gridHelper.visible = false  // 默认不显示网格
    bgObjects.gridHelper = gridHelper
    scene.value.add(gridHelper)

    // 淡淡的星云光晕（远处的大光球）
    const nebulaGeo = new THREE.SphereGeometry(600, 32, 32)
    const nebulaMat = new THREE.MeshBasicMaterial({
      color: 0x3a5a8a,
      transparent: true,
      opacity: 0.03,
      side: THREE.BackSide
    })
    const nebula = new THREE.Mesh(nebulaGeo, nebulaMat)
    nebula.position.set(0, 200, -800)
    nebula.name = 'Nebula'
    nebula.visible = isDark
    bgObjects.nebula = nebula
    scene.value.add(nebula)

    // ========== HUD 坐标轴指示器 ==========
    hudScene.value = new THREE.Scene()
    buildHudAxes()

    hudCamera.value = new THREE.OrthographicCamera(-3.5, 3.5, 3.5, -3.5, 0.1, 10)
    hudCamera.value.position.set(2, 2, 2)
    hudCamera.value.lookAt(0, 0, 0)

    animate()
  }

  function buildHudAxes() {
    const axisLen = 1.8
    const shaftR = 0.06
    const coneR = 0.14
    const coneH = 0.35

    const axes = [
      { color: 0xff3333, shaftRot: [0, 0, -Math.PI / 2], shaftPos: [axisLen / 2, 0, 0], coneRot: [0, 0, -Math.PI / 2], conePos: [axisLen + coneH / 2, 0, 0], label: 'X', labelPos: [axisLen + 0.9, 0.15, 0.15] },
      { color: 0x33ff33, shaftRot: [0, 0, 0], shaftPos: [0, axisLen / 2, 0], coneRot: [0, 0, 0], conePos: [0, axisLen + coneH / 2, 0], label: 'Y', labelPos: [0.15, axisLen + 0.9, 0.15] },
      { color: 0x3366ff, shaftRot: [Math.PI / 2, 0, 0], shaftPos: [0, 0, axisLen / 2], coneRot: [Math.PI / 2, 0, 0], conePos: [0, 0, axisLen + coneH / 2], label: 'Z', labelPos: [0.15, 0.15, axisLen + 0.9] }
    ]

    axes.forEach(ax => {
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(shaftR, shaftR, axisLen, 12),
        new THREE.MeshBasicMaterial({ color: ax.color })
      )
      shaft.rotation.set(...ax.shaftRot)
      shaft.position.set(...ax.shaftPos)
      hudScene.value.add(shaft)

      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(coneR, coneH, 12),
        new THREE.MeshBasicMaterial({ color: ax.color })
      )
      cone.rotation.set(...ax.coneRot)
      cone.position.set(...ax.conePos)
      hudScene.value.add(cone)

      hudScene.value.add(createAxisLabel(ax.label, ax.color, new THREE.Vector3(...ax.labelPos)))
    })
  }

  function createAxisLabel(text, color, pos) {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 8
    ctx.font = 'bold 140px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.strokeText(text, 128, 128)
    ctx.fillStyle = color
    ctx.fillText(text, 128, 128)

    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    const mat = new THREE.SpriteMaterial({ map: texture, transparent: true })
    const sprite = new THREE.Sprite(mat)
    sprite.position.copy(pos)
    sprite.scale.set(1.2, 1.2, 1.2)
    return sprite
  }

  function animate() {
    rafId.value = requestAnimationFrame(animate)
    if (!renderer.value || !camera.value || !scene.value) return
    controls.value.update()

    const container = containerRef.value
    if (!container) return
    const w = container.clientWidth
    const h = container.clientHeight

    renderer.value.setViewport(0, 0, w, h)
    renderer.value.setScissor(0, 0, w, h)
    renderer.value.setScissorTest(false)
    renderer.value.clear()
    renderer.value.render(scene.value, camera.value)

    // HUD 坐标轴 - 左下角（跟随相机旋转）
    const hudSize = Math.min(120, w * 0.18) * window.devicePixelRatio
    const hudX = 15
    const hudY = 15
    renderer.value.setViewport(hudX, hudY, hudSize, hudSize)
    renderer.value.setScissor(hudX, hudY, hudSize, hudSize)
    renderer.value.setScissorTest(true)
    renderer.value.clearDepth()

    camera.value.getWorldDirection(_tempDir)
    hudCamera.value.position.copy(_tempDir).negate().multiplyScalar(3)
    hudCamera.value.lookAt(0, 0, 0)
    hudCamera.value.up.copy(camera.value.up)

    renderer.value.render(hudScene.value, hudCamera.value)
    renderer.value.setScissorTest(false)
  }

  function handleResize() {
    if (!camera.value || !renderer.value || !containerRef.value) return
    const w = containerRef.value.clientWidth
    const h = containerRef.value.clientHeight
    camera.value.aspect = w / h
    camera.value.updateProjectionMatrix()
renderer.value.setSize(w, h)
  }

  function disposeThree() {
    if (rafId.value) {
      cancelAnimationFrame(rafId.value)
      rafId.value = null
    }

    const disposeObject = (obj) => {
      if (!obj) return
      if (obj.geometry) { obj.geometry.dispose(); obj.geometry = null }
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => { if (m.dispose) m.dispose() })
        } else if (obj.material.dispose) {
          obj.material.dispose()
        }
        obj.material = null
      }
      if (obj.map && obj.map.dispose) { obj.map.dispose(); obj.map = null }
    }

    // 清理宇宙背景元素
    const bgNames = ['Stars', 'GridHelper', 'Nebula']
    bgNames.forEach(name => {
      const obj = scene.value?.getObjectByName(name)
      if (obj) {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) obj.material.dispose()
        scene.value.remove(obj)
      }
    })

    scene.value?.traverse(disposeObject)
    hudScene.value?.traverse(disposeObject)

    if (renderer.value) {
      renderer.value.dispose()
      if (renderer.value.domElement?.parentNode) {
        renderer.value.domElement.parentNode.removeChild(renderer.value.domElement)
      }
    }

    scene.value = null
    camera.value = null
    renderer.value = null
    controls.value = null
    modelGroup.value = null
    hudScene.value = null
    hudCamera.value = null
  }

  return {
    scene, camera, renderer, controls, modelGroup, hudScene, hudCamera,
    COORD_SYSTEMS, _tempDir,
    getThemeColor, getThemeBgColor,
    initThree, disposeThree, handleResize,
    updateTheme
  }
}
