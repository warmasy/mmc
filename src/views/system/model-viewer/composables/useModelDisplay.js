// 模型显示优化 Composable
// 负责：默认清晰边线显示、导航器中文名乱码修复、默认视角/投影、回到 intro 界面

// 默认开启清晰边线显示：
// - Show Edges 打开（O3DV 默认关闭，模型看着"糊"）
// - Edge Color 默认 50（RGB(50,50,50) 深灰）
// - Edge Threshold 用 60°：只画锐利特征棱线（默认 1° 会把所有三角面折痕
//   都画出来，曲面细分密线满屏反而看不清）
export function applyClearEdges() {
  const ws = window.o3dvWebsite
  if (!ws || !ws.settings || !ws.settings.edgeSettings) return
  const es = ws.settings.edgeSettings
  es.showEdges = true
  es.edgeThreshold = 60
  // Edge Color 默认 50（深灰），用 O3DV 的 RGBColor 类型
  const Engine = window.OV.Engine || window.OV
  if (Engine && typeof Engine.RGBColor === 'function') {
    es.edgeColor = new Engine.RGBColor(50, 50, 50)
  } else {
    es.edgeColor = { r: 50, g: 50, b: 50 }
  }
  ws.UpdateEdgeDisplay()
  if (ws.sidebar) {
    ws.sidebar.UpdateControlsStatus()
  }
}

// 修复模型节点名的乱码：
// occt-import-js wasm 解析含中文名的 STEP 文件时，会把 UTF-8 中文名按错误编码
// 解码成 U+FFFD 替换符（如「初始模型」→「��ʼģ��」），导航器 Meshes/Materials
// 树里显示乱码。这里把含替换符的乱码节点名替换为正确的模型文件名（去扩展名），
// 并同步更新导航器已渲染的树文本。
export function fixGarbledModelNames() {
  const ws = window.o3dvWebsite
  if (!ws || !ws.model) return
  const model = ws.model
  // 取当前文件名（去掉扩展名）作为正确名称
  const fileName = (ws.parameters && ws.parameters.fileNameDiv && ws.parameters.fileNameDiv.textContent) || ''
  let correctName = fileName.replace(/\.\w+$/, '').trim()
  if (!correctName) return

  const hasGarbled = (s) => /[\uFFFD]/.test(s || '')
  const fixName = (node) => {
    if (!node || typeof node.GetName !== 'function') return
    const name = node.GetName()
    if (hasGarbled(name)) {
      try { node.SetName(correctName) } catch (e) { /* ignore */ }
    }
  }
  // 根节点
  const root = model.GetRootNode ? model.GetRootNode() : null
  if (root) {
    fixName(root)
    if (typeof root.EnumerateChildren === 'function') {
      root.EnumerateChildren((node) => {
        fixName(node)
        if (typeof node.EnumerateChildren === 'function') {
          node.EnumerateChildren((child) => fixName(child))
        }
      })
    }
  }
  // 同步修复导航器树中已渲染的乱码文本（Meshes/Materials 面板）
  const navigator = document.getElementById('main_navigator')
  if (navigator) {
    navigator.querySelectorAll('.ov_tree_item_name').forEach((el) => {
      if (hasGarbled(el.textContent)) {
        el.textContent = correctName
      }
    })
  }
}

// 回到初始页（显示 intro 拖放界面；小房子按钮点击调用）
export function restartWithIntro() {
  const ws = window.o3dvWebsite
  if (!ws) return
  ws.ClearModel()
  if (typeof ws.SetUIState === 'function') {
    // 通过公开 API 回到 intro；内部方法若不可用则忽略
    try { ws.SetUIState(1) } catch (e) { /* ignore */ }
  }
}

// SolidWorks 坐标系方向：默认视角 = 等轴测，观察方向从第一象限 (X+, Y+, Z+) 偏 X 侧，
// 与 SolidWorks 的默认等轴测观感一致：
//   - 屏幕上 X 轴指向右下（较陡，约 38°）
//   - Y 轴向上（垂直）
//   - Z 轴往左偏转（接近水平，约 14°）
// O3DV 默认相机在 (-17, 23, 35)（X 负方向），三轴在屏幕上的方向与 SolidWorks 相反，
// 这里纠正。animate=true 时用 MoveCamera 平滑过渡（按钮点击）；模型加载初始定位用
// animate=false 直接到位（避免加载时跳一个多余的过渡动画）。
export function setSolidWorksDefaultView(animate = true) {
  const ws = window.o3dvWebsite
  if (!ws || !ws.viewer) return
  try {
    const Engine = window.OV.Engine || window.OV
    const Coord3D = Engine.Coord3D
    const viewer = ws.viewer
    const camera = viewer.GetCamera()
    if (!camera || !camera.eye || !camera.center) return
    // 保持当前相机到观察中心的距离，方向改为 (1.8, 1, 1)/|·|（Z 更偏水平左）
    const dx = camera.eye.x - camera.center.x
    const dy = camera.eye.y - camera.center.y
    const dz = camera.eye.z - camera.center.z
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
    if (!(dist > 0)) return
    const d = dist / Math.sqrt(1.8 * 1.8 + 1 + 1)
    const eye = new Coord3D(camera.center.x + 1.8 * d, camera.center.y + d, camera.center.z + d)
    const center = new Coord3D(camera.center.x, camera.center.y, camera.center.z)
    const up = new Coord3D(0, 1, 0)
    const newCamera = new Engine.Camera(eye, center, up, camera.fov)
    if (animate) {
      // 平滑动画过渡（与 Set Y/Z axis as up vector 相同机制）
      const steps = (viewer.settings && viewer.settings.animationSteps) || 40
      viewer.navigation.MoveCamera(newCamera, steps)
    } else {
      // 初始加载直接到位，不播放过渡动画
      viewer.SetCamera(newCamera)
    }
  } catch (e) { /* ignore */ }
}

// 模型默认用正交投影（orthographic）显示。
// O3DV 默认透视投影；优先点击工具栏"正交相机"按钮完成切换，
// 让 O3DV 自己处理相机与按钮选中状态（"透视相机"按钮已被禁用）。
export function setDefaultOrthographic() {
  const ws = window.o3dvWebsite
  if (!ws || !ws.viewer) return
  try {
    if (ws.viewer.GetProjectionMode && ws.viewer.GetProjectionMode() === 2) return
    const toolbar = document.getElementById('toolbar')
    const orthoBtn = toolbar ? Array.from(toolbar.querySelectorAll('.ov_toolbar_button'))
      .find(b => (b.getAttribute('alt') || '').trim() === '正交相机') : null
    if (orthoBtn) {
      orthoBtn.click()
    } else {
      ws.viewer.SetProjectionMode(2)
    }
  } catch (e) { /* ignore */ }
}
