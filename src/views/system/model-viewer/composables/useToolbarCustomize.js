// 工具栏定制 Composable
// 负责：禁用指定按钮（斜杠标志 + 悬停提示 + 点击拦截）、
//       主页按钮（小房子）、标准视图按钮（前/后/左/右/俯/仰）、
//       文件名移动（title 行删除 → snapshot 按钮后）、tooltip 管理

// ==================== tooltip 通用管理 ====================

let currentTooltip = null

// 显示提示（复用 .ov_tooltip 类，样式与 O3DV 原版提示一致）。
// 用 mouseenter/mouseleave 管理：只在进入/离开元素时触发一次，
// 不会因鼠标在元素内部子元素间移动而反复创建/移除（避免闪烁）。
export function showTooltip(btn, text) {
  hideTooltip()
  const tip = document.createElement('div')
  tip.className = 'ov_tooltip'
  tip.textContent = text
  document.body.appendChild(tip)
  // 定位：仿 O3DV CalculateOffset（按钮下方居中，边缘自动收拢）
  const btnRect = btn.getBoundingClientRect()
  const tipWidth = tip.offsetWidth
  const margin = 10
  let left = btnRect.left + btnRect.width / 2 - tipWidth / 2
  if (left + tipWidth > window.innerWidth - margin) {
    left = window.innerWidth - tipWidth - margin
  }
  if (left < margin) {
    left = margin
  }
  left = Math.max(left, 0)
  tip.style.left = left + 'px'
  tip.style.top = (btnRect.top + btnRect.height + margin) + 'px'
  currentTooltip = tip
}

export function hideTooltip() {
  if (currentTooltip) {
    currentTooltip.remove()
    currentTooltip = null
  }
}

// ==================== 禁用按钮 ====================

// 禁用的工具栏功能（按按钮的 alt 标题匹配，界面已中文化，用中文匹配）：
// - 从 URL 打开：从 URL 打开模型
// - 固定向上向量：固定 Y 轴朝上（radio 组的第一个，保留自由旋转）
// - 分享：分享
// - 深色模式 / 浅色模式：由系统主题控制（改用系统亮暗模式）
// - 透视相机：固定使用正交投影（保留 正交相机 可选）
const DISABLED_TOOLBAR_BUTTONS = ['从 URL 打开', '固定向上向量', '分享', '深色模式', '浅色模式', '透视相机']
const DISABLED_TOOLTIP_TEXT = '该功能已禁用'

// 禁用指定工具栏按钮：加禁用标志、悬停提示"已禁用"、点击无响应
// （鼠标指针保持原来的手指，禁用提示样式与 O3DV 原版 tooltip 一致）
export function applyDisabledButtons() {
  const toolbar = document.getElementById('toolbar')
  if (!toolbar) return
  const buttons = Array.from(toolbar.querySelectorAll('.ov_toolbar_button'))
  for (const btn of buttons) {
    const alt = (btn.getAttribute('alt') || '').trim()
    if (!DISABLED_TOOLBAR_BUTTONS.includes(alt)) continue

    // 1. 加禁用标志类（CSS 画红色斜杠，不改变鼠标指针）
    btn.classList.add('ov_toolbar_button_disabled')

    // 2. 点击无响应：阻止 O3DV 绑定的 click 处理
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      e.preventDefault()
    }, true) // 捕获阶段拦截，先于 O3DV 的冒泡监听执行

    // 3. 悬停提示"该功能已禁用"：自己管理 tooltip（mouseenter/mouseleave），
    //    不依赖 O3DV 的 mouseover/mouseout，避免按钮内部移动时闪烁。
    //    同时移除 O3DV 自己的 tooltip（显示原始标题"Share"等），只保留禁用提示。
    btn.addEventListener('mouseenter', () => {
      showTooltip(btn, DISABLED_TOOLTIP_TEXT)
    })
    btn.addEventListener('mouseleave', () => {
      hideTooltip()
    })
    // 在捕获阶段拦截 mouseover/mouseout，阻止 O3DV 的 InstallTooltip 创建/移除逻辑
    // （stopImmediatePropagation：阻止同一元素上 O3DV 后续注册的监听执行）
    btn.addEventListener('mouseover', (e) => {
      e.stopImmediatePropagation()
    }, true)
    btn.addEventListener('mouseout', (e) => {
      e.stopImmediatePropagation()
    }, true)
    // 兜底：移除可能已存在的 O3DV 原版 tooltip（避免与禁用提示并存）
    btn.addEventListener('mouseenter', () => {
      document.querySelectorAll('body > .ov_tooltip').forEach((t) => {
        if (t !== currentTooltip) t.remove()
      })
    })
  }
}

// ==================== 主页按钮 ====================

let homeButtonEl = null

// 在"从 URL 打开"按钮后添加"主页"按钮（小房子图标）：
// - 样式与其他工具栏按钮一致（ov_toolbar_button + ov_svg_icon，图标跟随主题色）
// - 点击后回到 intro 界面（将 3D 模型拖放到此处。 / 查看示例文件：）
export function addHomeButton(restartWithIntro) {
  const toolbar = document.getElementById('toolbar')
  if (!toolbar) return
  // 防止重复添加
  if (homeButtonEl && homeButtonEl.isConnected) return

  const openUrlBtn = Array.from(toolbar.querySelectorAll('.ov_toolbar_button'))
    .find(b => (b.getAttribute('alt') || '').trim() === '从 URL 打开')
  if (!openUrlBtn) return

  // 创建按钮：结构与 O3DV 按钮一致（div.ov_toolbar_button > div.ov_svg_icon > svg）
  const btn = document.createElement('div')
  btn.className = 'ov_toolbar_button'
  btn.setAttribute('alt', '首页')
  btn.setAttribute('title', '首页')

  const iconDiv = document.createElement('div')
  iconDiv.className = 'ov_svg_icon'
  // 小房子 SVG（描边风格，无填充，与其他图标字体的线条风格一致；
  // currentColor 跟随 --ov_icon_color，主题切换自动变色；线宽 1.3 更纤细）
  iconDiv.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
         stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
         aria-hidden="true" style="display:block;">
      <path d="M3 10.5L12 3l9 7.5"/>
      <path d="M5 9.5V21h14V9.5"/>
      <path d="M9.5 21v-6h5v6"/>
    </svg>
  `
  btn.appendChild(iconDiv)

  // 插入到 Open from url 按钮之后
  openUrlBtn.insertAdjacentElement('afterend', btn)

  // 点击回到 intro 界面
  btn.addEventListener('click', () => {
    if (typeof restartWithIntro === 'function') restartWithIntro()
  })
  // 悬停提示（复用 O3DV 原版 tooltip 样式）
  btn.addEventListener('mouseenter', () => {
    showTooltip(btn, '首页')
  })
  btn.addEventListener('mouseleave', () => {
    hideTooltip()
  })

  homeButtonEl = btn
}

// ==================== 标准视图按钮 ====================

// 标准视图按钮：前/后/左/右/俯/仰视图，插入到 "设置 Z 轴为向上向量" 之后。
// 图标为圆角方框 + 居中汉字（前/后/左/右/俯/仰），描边风格与其他图标一致。
const VIEW_BUTTONS = [
  { label: '前', title: '前视图', dir: [0, 0, 1] },
  { label: '后', title: '后视图', dir: [0, 0, -1] },
  { label: '左', title: '左视图', dir: [-1, 0, 0] },
  { label: '右', title: '右视图', dir: [1, 0, 0] },
  { label: '俯', title: '俯视图', dir: [0, 1, 0] },
  { label: '仰', title: '仰视图', dir: [0, -1, 0] }
]

// 切换标准视图：eye 放到模型包围球中心 + 指定方向 * 适配距离，center 为模型中心。
// 用 navigation.MoveCamera 做平滑动画过渡（与 Set Y/Z axis as up vector 一致）。
export function setStandardView(dir) {
  const ws = window.o3dvWebsite
  if (!ws || !ws.viewer) return
  try {
    const Engine = window.OV.Engine || window.OV
    const Coord3D = Engine.Coord3D
    const viewer = ws.viewer
    // 模型包围球（中心 + 半径）
    const sphere = viewer.GetBoundingSphere(() => true)
    if (!sphere) return
    const center = new Coord3D(sphere.center.x, sphere.center.y, sphere.center.z)
    const radius = sphere.radius
    if (radius <= 0) return

    // 相机距离：与 GetFitToSphereCamera 相同（fov 半角正弦适配）
    const camera = viewer.GetCamera()
    const fov = camera.fov / 2.0
    const canvas = viewer.GetCanvas ? viewer.GetCanvas() : null
    let halfFov = fov
    if (canvas && canvas.width < canvas.height) {
      halfFov = fov * canvas.width / canvas.height
    }
    const distance = radius / Math.sin(halfFov * Math.PI / 180)

    // eye 位置 = center + dir * distance
    const eye = new Coord3D(
      center.x + dir[0] * distance,
      center.y + dir[1] * distance,
      center.z + dir[2] * distance
    )
    // up 向量：默认 Y 轴；俯/仰视图 up 用 Z 轴（避免与视线平行）
    let up
    if (Math.abs(dir[1]) > 0.9) {
      up = new Coord3D(0, 0, 1)
    } else {
      up = new Coord3D(0, 1, 0)
    }
    const newCamera = new Engine.Camera(eye, center, up, camera.fov)
    // 平滑动画过渡（与 Set Y/Z axis as up vector 相同机制）
    const steps = (viewer.settings && viewer.settings.animationSteps) || 40
    viewer.navigation.MoveCamera(newCamera, steps)
  } catch (e) { /* 相机/包围球未就绪时忽略 */ }
}

let viewButtonsAdded = false

export function addViewButtons(restoreDefaultView) {
  const toolbar = document.getElementById('toolbar')
  if (!toolbar) return
  if (viewButtonsAdded) return

  const refBtn = Array.from(toolbar.querySelectorAll('.ov_toolbar_button'))
    .find(b => (b.getAttribute('alt') || '').trim() === '设置 Z 轴为向上向量')
  if (!refBtn) return

  let lastBtn = refBtn

  // 在视图按钮组最前面（前视图之前）添加"轴"按钮：点击恢复模型和坐标系的默认显示。
  // 图标与前后左右俯仰一致：圆角方框 + 居中汉字"轴"。
  const axisBtn = document.createElement('div')
  axisBtn.className = 'ov_toolbar_button'
  axisBtn.setAttribute('alt', '默认视图')
  axisBtn.setAttribute('title', '默认视图')

  const axisIconDiv = document.createElement('div')
  axisIconDiv.className = 'ov_svg_icon'
  const axisSpan = document.createElement('span')
  axisSpan.className = 'ov_view_icon'
  axisSpan.textContent = '轴'
  axisIconDiv.appendChild(axisSpan)
  axisBtn.appendChild(axisIconDiv)

  lastBtn.insertAdjacentElement('afterend', axisBtn)
  lastBtn = axisBtn

  // 点击恢复默认显示（正交投影 + SolidWorks 初始等轴测视角）
  axisBtn.addEventListener('click', () => {
    if (typeof restoreDefaultView === 'function') restoreDefaultView()
  })
  // 悬停提示
  axisBtn.addEventListener('mouseenter', () => {
    showTooltip(axisBtn, '默认视图')
  })
  axisBtn.addEventListener('mouseleave', () => {
    hideTooltip()
  })

  for (const vb of VIEW_BUTTONS) {
    const btn = document.createElement('div')
    btn.className = 'ov_toolbar_button'
    btn.setAttribute('alt', vb.title)
    btn.setAttribute('title', vb.title)

    // 图标：圆角方框 + 汉字（用 span 文字，CSS 画边框）
    const iconDiv = document.createElement('div')
    iconDiv.className = 'ov_svg_icon'
    const span = document.createElement('span')
    span.className = 'ov_view_icon'
    span.textContent = vb.label
    iconDiv.appendChild(span)
    btn.appendChild(iconDiv)

    // 插入到上一个按钮之后
    lastBtn.insertAdjacentElement('afterend', btn)
    lastBtn = btn

    // 点击切换视图
    btn.addEventListener('click', () => {
      setStandardView(vb.dir)
    })

    // 悬停提示
    btn.addEventListener('mouseenter', () => {
      showTooltip(btn, vb.title)
    })
    btn.addEventListener('mouseleave', () => {
      hideTooltip()
    })
  }
  viewButtonsAdded = true
}

// ==================== 文件名移动 ====================

let fileNameMoved = false

// 删除 header 的 title 行（title_right + 文件名），把文件名移到"创建快照"按钮后面，
// 用竖号 | 与前面的按钮分隔。O3DV 仍会往 #main_file_name 写入文件名，只需移动元素位置。
export function moveFileNameToSnapshot() {
  const header = document.getElementById('header')
  if (!header) return
  if (fileNameMoved) return

  // 1. 删除 title 行（title_right、main_file_name）
  const titleEl = header.querySelector('.title')
  const fileNameEl = document.getElementById('main_file_name')
  if (!titleEl || !fileNameEl) return
  const titleRight = titleEl.querySelector('.title_right')
  if (titleRight) titleRight.remove()
  // 移除文件名元素（稍后插入到 snapshot 后）
  fileNameEl.remove()

  // 2. 把文件名元素插入到"创建快照"按钮之后
  const toolbar = document.getElementById('toolbar')
  if (!toolbar) return
  const snapBtn = Array.from(toolbar.querySelectorAll('.ov_toolbar_button'))
    .find(b => (b.getAttribute('alt') || '').trim() === '创建快照')
  if (!snapBtn) return
  snapBtn.insertAdjacentElement('afterend', fileNameEl)
  fileNameEl.classList.add('ov_file_name_after_snapshot')

  // 3. title 行若已空则移除
  if (titleEl.children.length === 0) {
    titleEl.remove()
  }
  // 4. title 删除改变了布局高度，触发 O3DV layouter 重新计算，
  //    否则 main 区域高度仍按旧 header 计算，底部内容被卡片裁掉
  const ws = window.o3dvWebsite
  if (ws && ws.layouter && typeof ws.layouter.Resize === 'function') {
    setTimeout(() => {
      try { ws.layouter.Resize() } catch (e) { /* ignore */ }
    }, 50)
  }
  fileNameMoved = true
}
