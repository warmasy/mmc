// 左侧导航器"计算"面板 Composable
// 在 Files / Materials / Meshes 树下面新增一个"计算"功能面板：
//   - 显示模型体积（cm³）、密度（g/cm³，可修改）、质量（g = 密度 × 体积）
//   - 密度修改后质量实时重算
// 体积用 O3DV 引擎的 CalculateVolume(model) 计算，并按模型单位换算到 cm³。

let calcPanelReady = false
let densityInput = null
let volumeEl = null
let massEl = null
let volumeCm3 = 0

// 计算器图标（单色线条，currentColor 跟随主题色，与 O3DV 菜单按钮图标同风格）
const CALC_ICON_SVG = `
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
       stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
       aria-hidden="true" style="display:block;">
    <rect x="5" y="3" width="14" height="18" rx="2"/>
    <line x1="8.5" y1="7" x2="15.5" y2="7"/>
    <line x1="8" y1="11" x2="8" y2="11.4"/>
    <line x1="12" y1="11" x2="12" y2="11.4"/>
    <line x1="16" y1="11" x2="16" y2="11.4"/>
    <line x1="8" y1="15" x2="8" y2="15.4"/>
    <line x1="12" y1="15" x2="12" y2="15.4"/>
    <line x1="16" y1="15" x2="16" y2="15.4"/>
    <line x1="8" y1="19" x2="8" y2="19.4"/>
    <line x1="12" y1="19" x2="12" y2="19.4"/>
    <line x1="16" y1="19" x2="16" y2="19.4"/>
  </svg>
`

// 数字显示格式：保留合理小数位，大数/小数不溢出
function fmt(v) {
  if (!isFinite(v)) return '-'
  if (v === 0) return '0'
  const abs = Math.abs(v)
  if (abs >= 100000) return v.toExponential(3)
  if (abs >= 100) return v.toFixed(1)
  if (abs >= 1) return v.toFixed(3)
  return v.toExponential(2)
}

// 计算模型体积并换算到 cm³（O3DV 默认按毫米导入）
function computeVolumeCm3() {
  const ws = window.o3dvWebsite
  if (!ws || !ws.model) return 0
  try {
    const Engine = window.OV && window.OV.Engine
    if (!Engine || typeof Engine.CalculateVolume !== 'function') return 0
    let volume = Math.abs(Engine.CalculateVolume(ws.model))
    // 模型单位 → cm³ 换算系数（Unit 枚举：1=mm 2=cm 3=m 4=in 5=ft）
    const Unit = Engine.Unit
    let unit = 1
    try { unit = ws.model.GetUnit() } catch (e) { unit = 1 }
    switch (unit) {
      case Unit.Centimeter: break // cm³ 已是目标单位
      case Unit.Meter: volume *= 1e6; break // m³ → cm³
      case Unit.Inch: volume *= 16.387064; break // in³ → cm³
      case Unit.Foot: volume *= 28316.846592; break // ft³ → cm³
      default: volume /= 1000; break // mm / Unknown：mm³ → cm³
    }
    return volume
  } catch (e) {
    return 0
  }
}

// 刷新体积并重算质量
export function updateCalcVolume() {
  volumeCm3 = computeVolumeCm3()
  if (volumeEl) volumeEl.textContent = fmt(volumeCm3)
  updateMass()
}

// 根据密度重算质量（质量 g = 密度 g/cm³ × 体积 cm³）
function updateMass() {
  if (!densityInput || !massEl) return
  const density = parseFloat(densityInput.value)
  const mass = isFinite(density) ? density * volumeCm3 : 0
  massEl.textContent = fmt(mass)
}

// 创建"计算"面板（菜单按钮 + 内容面板），并接管左侧面板切换逻辑
export function initCalcPanel() {
  const nav = document.getElementById('main_navigator')
  if (!nav || calcPanelReady) return
  const menu = nav.querySelector('.ov_panel_set_menu')
  const content = nav.querySelector('.ov_panel_set_content')
  if (!menu || !content) return

  // 1. 菜单按钮：加在 Meshes 按钮之后
  const btn = document.createElement('div')
  btn.className = 'ov_svg_icon ov_panel_set_menu_button'
  btn.setAttribute('alt', '计算')
  btn.setAttribute('title', '计算')
  btn.innerHTML = CALC_ICON_SVG
  menu.appendChild(btn)

  // 2. 内容面板：加在 Meshes 面板之后（默认隐藏）
  const panel = document.createElement('div')
  panel.style.display = 'none'
  panel.innerHTML = `
    <div class="ov_navigator_tree_title" title="计算">计算</div>
    <div class="ov_calc_panel">
      <div class="ov_calc_row">
        <span class="ov_calc_label">密度</span>
        <input type="number" id="ov_calc_density" value="7.85" step="0.01" min="0" />
        <span class="ov_calc_unit">g/cm³</span>
      </div>
      <div class="ov_calc_row">
        <span class="ov_calc_label">体积</span>
        <span class="ov_calc_value" id="ov_calc_volume">-</span>
        <span class="ov_calc_unit">cm³</span>
      </div>
      <div class="ov_calc_row">
        <span class="ov_calc_label">质量</span>
        <span class="ov_calc_value" id="ov_calc_mass">-</span>
        <span class="ov_calc_unit">g</span>
      </div>
    </div>
  `
  content.appendChild(panel)

  // 3. 接管左侧面板切换：点击菜单按钮 → 对应内容面板显示
  const menuBtns = Array.from(menu.querySelectorAll('.ov_panel_set_menu_button'))
  const panels = Array.from(content.querySelectorAll(':scope > div'))
  menuBtns.forEach((mb, i) => {
    mb.addEventListener('click', () => {
      menuBtns.forEach((b, j) => b.classList.toggle('selected', j === i))
      panels.forEach((p, j) => { p.style.display = j === i ? 'block' : 'none' })
    })
  })

  // 4. 密度修改 → 质量实时重算
  densityInput = panel.querySelector('#ov_calc_density')
  volumeEl = panel.querySelector('#ov_calc_volume')
  massEl = panel.querySelector('#ov_calc_mass')
  if (densityInput) {
    densityInput.addEventListener('input', updateMass)
    densityInput.addEventListener('change', updateMass)
  }

  calcPanelReady = true
  updateCalcVolume()
}
