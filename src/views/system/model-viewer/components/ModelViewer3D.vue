<template>
  <div
    ref="containerRef"
    class="model-viewer-3d"
    :class="{ 'is-dragover': isDragover }"
    @dragover.prevent="handleDragover"
    @dragleave="handleDragleave"
    @drop.prevent="handleDrop"
  >
    <div v-if="isLoading" class="loading-overlay">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
      <span>正在解析模型...</span>
    </div>

    <!-- 顶部工具栏：视图切换 / 剖切 / 模型颜色（统一按钮样式与间距） -->
    <div class="view-toolbar">
      <el-button size="small" :type="currentView === 'front' ? 'primary' : 'default'" title="前视" @click="wrappedSetStandardView('front')">前视图</el-button>
      <el-button size="small" :type="currentView === 'back' ? 'primary' : 'default'" title="后视" @click="wrappedSetStandardView('back')">后视图</el-button>
      <el-button size="small" :type="currentView === 'top' ? 'primary' : 'default'" title="上视" @click="wrappedSetStandardView('top')">上视图</el-button>
      <el-button size="small" :type="currentView === 'bottom' ? 'primary' : 'default'" title="下视" @click="wrappedSetStandardView('bottom')">下视图</el-button>
      <el-button size="small" :type="currentView === 'left' ? 'primary' : 'default'" title="左视" @click="wrappedSetStandardView('left')">左视图</el-button>
      <el-button size="small" :type="currentView === 'right' ? 'primary' : 'default'" title="右视" @click="wrappedSetStandardView('right')">右视图</el-button>
      <el-button size="small" :type="currentView === 'iso' ? 'primary' : 'default'" title="等轴测" @click="wrappedSetStandardView('iso')">轴测图</el-button>
      <span class="toolbar-sep"></span>
      <el-button
        size="small"
        :type="isClipping ? 'danger' : 'default'"
        @click="toggleClipping"
      >
        {{ isClipping ? '关闭剖切' : '剖切' }}
      </el-button>
      <el-button
        size="small"
        :type="colorDialogVisible ? 'danger' : 'default'"
        title="模型颜色"
        @click="colorDialogVisible = !colorDialogVisible"
      >
        <span class="color-dot" :style="{ backgroundColor: modelColor }"></span>
        {{ colorDialogVisible ? '关闭颜色' : '颜色' }}
      </el-button>
      <span class="toolbar-sep"></span>
      <!-- 滚轮缩放方向（普通按钮样式，与颜色/剖切一致，即时响应） -->
      <el-button
        size="small"
        :type="wheelDirection === 'normal' ? 'primary' : 'default'"
        title="推滚轮缩小，拉滚轮放大"
        @click="wheelDirection = 'normal'"
      >推小拉大</el-button>
      <el-button
        size="small"
        :type="wheelDirection === 'inverse' ? 'primary' : 'default'"
        title="推滚轮放大，拉滚轮缩小"
        @click="wheelDirection = 'inverse'"
      >推大拉小</el-button>
      <span class="toolbar-sep"></span>
      <el-button size="small" type="default" title="拍照保存当前视角" @click="takePhoto">
        <el-icon><Camera /></el-icon>
        拍照
      </el-button>
    </div>

    <!-- 剖切弹窗 -->
    <div
      v-if="isClipping"
      class="clip-dialog"
      :style="{ left: dialogX + 'px', top: dialogY + 'px' }"
    >
      <div class="clip-dialog-header" @mousedown="startDrag">
        <span class="clip-title">🔪 剖切控制</span>
        <el-button size="small" text class="clip-close" @click="toggleClipping">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
      <div class="clip-dialog-body">
        <div class="clip-form-row">
          <span class="clip-form-label">剖切方向</span>
          <el-radio-group v-model="clipAxis" size="small" @change="updateClip">
            <el-radio-button label="x">X 轴</el-radio-button>
            <el-radio-button label="y">Y 轴</el-radio-button>
            <el-radio-button label="z">Z 轴</el-radio-button>
          </el-radio-group>
        </div>
        <div class="clip-form-row">
          <span class="clip-form-label">剖切位置</span>
          <div class="clip-slider-wrap">
            <el-slider
              v-model="clipPos"
              :min="clipMin"
              :max="clipMax"
              :step="0.1"
              size="small"
              @input="updateClip"
            />
            <span class="clip-pos-value">{{ clipPos.toFixed(1) }}</span>
          </div>
        </div>
        <div class="clip-form-row">
          <span class="clip-form-label">保留侧</span>
          <el-button size="small" @click="flipClip">
            <el-icon><Switch /></el-icon>
            翻转保留侧
          </el-button>
        </div>
      </div>
    </div>

    <!-- 模型颜色弹窗（可拖拽，与剖切弹窗一致，无圆角） -->
    <div
      v-if="colorDialogVisible"
      class="color-dialog"
      :style="{ left: colorDialogX + 'px', top: colorDialogY + 'px' }"
    >
      <div class="color-dialog-header" @mousedown="startColorDrag">
        <span class="color-title">🎨 模型颜色</span>
        <el-button size="small" text class="color-close" @click="colorDialogVisible = false">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
      <div class="color-dialog-body">
        <div class="color-presets">
          <span
            v-for="c in presetColors"
            :key="c"
            class="color-swatch"
            :style="{ backgroundColor: c }"
            :class="{ active: modelColor === c }"
            :title="c"
            @click="setModelColor(c)"
          ></span>
          <!-- 随机颜色按钮：紧跟色块流末尾（第 3 行色块后面） -->
          <button class="color-random" type="button" title="随机颜色" @click="randomColor">🎲随机</button>
        </div>
        <div class="color-advanced">
          <div class="color-row">
            <span class="color-row-label">R</span>
            <el-slider v-model="colorRgb.r" :min="0" :max="255" size="small" @input="onRgbChange" />
            <input class="color-num" v-model.number="colorRgb.r" type="number" min="0" max="255" @change="onRgbChange" />
          </div>
          <div class="color-row">
            <span class="color-row-label">G</span>
            <el-slider v-model="colorRgb.g" :min="0" :max="255" size="small" @input="onRgbChange" />
            <input class="color-num" v-model.number="colorRgb.g" type="number" min="0" max="255" @change="onRgbChange" />
          </div>
          <div class="color-row">
            <span class="color-row-label">B</span>
            <el-slider v-model="colorRgb.b" :min="0" :max="255" size="small" @input="onRgbChange" />
            <input class="color-num" v-model.number="colorRgb.b" type="number" min="0" max="255" @change="onRgbChange" />
          </div>
          <div class="color-row">
            <span class="color-row-label">色调</span>
            <el-slider v-model="colorHsv.h" :min="0" :max="360" size="small" @input="onHsvChange" />
            <span class="color-val">{{ Math.round(colorHsv.h) }}°</span>
          </div>
          <div class="color-row">
            <span class="color-row-label">饱和度</span>
            <el-slider v-model="colorHsv.s" :min="0" :max="100" size="small" @input="onHsvChange" />
            <span class="color-val">{{ Math.round(colorHsv.s) }}%</span>
          </div>
          <div class="color-row">
            <span class="color-row-label">亮度</span>
            <el-slider v-model="colorHsv.v" :min="0" :max="100" size="small" @input="onHsvChange" />
            <span class="color-val">{{ Math.round(colorHsv.v) }}%</span>
          </div>
          <div class="color-row">
            <span class="color-row-label">色温</span>
            <el-slider v-model="colorTemp" :min="0" :max="100" size="small" @input="onColorTempChange" />
            <span class="color-val">{{ colorTemp }}%</span>
          </div>
          <div class="color-row">
            <span class="color-row-label">灰度</span>
            <el-slider v-model="colorGray" :min="0" :max="100" size="small" @input="onColorGrayChange" />
            <span class="color-val">{{ colorGray }}%</span>
          </div>
          <div class="color-row">
            <span class="color-row-label">不透明度</span>
            <el-slider v-model="colorAlpha" :min="0" :max="100" size="small" @input="onAlphaChange" />
            <span class="color-val">{{ colorAlpha }}%</span>
          </div>
          <div class="color-bottom">
            <input class="color-hex-input" v-model="colorHex" spellcheck="false" @change="onHexChange" />
            <el-button size="small" @click="pickScreenColor" :disabled="!supportEyeDropper">屏幕取色</el-button>
          </div>
        </div>
        <div v-if="colorChanged" class="color-reset">
          <el-button size="small" text type="primary" @click="resetModelColor">恢复默认颜色</el-button>
        </div>
      </div>
    </div>

    <input ref="fileInputRef" type="file" accept=".step,.stp,.iges,.igs,.brep" style="display: none" @change="handleFileChange" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as THREE from 'three'
import { useDark } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { Loading, Close, Switch, Camera } from '@element-plus/icons-vue'
import { useThreeScene } from '../composables/useThreeScene'
import { useOcctParser } from '../composables/useOcctParser'
import { useModelBuilder } from '../composables/useModelBuilder'
import { useClipping } from '../composables/useClipping'
import { useStandardViews } from '../composables/useStandardViews'
import { useDragDialog } from '../composables/useDragDialog'

const props = defineProps({
  coordSystem: { type: String, default: 'y-up' },
  wireframe: { type: Boolean, default: false },
  density: { type: Number, default: 7800 }
})

const emit = defineEmits(['model-loaded', 'model-error', 'volume-calculated', 'size-calculated'])

const containerRef = ref(null)
const fileInputRef = ref(null)
const isDragover = ref(false)
const hasModel = ref(false)
const isDefaultModel = ref(false)
const coordLabel = ref('Y-up')
const isSettingView = ref(false) // 标记是否正在程序设置视图
// 拍照信息
const currentFileName = ref('')
const modelStats = ref(null)
// 容器尺寸监听（页脚显隐/侧边栏折叠时画布自适应）
let resizeObserver = null

// ==================== Composables ====================
const {
  scene, camera, renderer, controls, modelGroup,
  COORD_SYSTEMS, getThemeColor,
  initThree, disposeThree, handleResize,
  updateTheme
} = useThreeScene(containerRef, props)

const { isLoading, loadOcct, parseFile: parseOcctFile, loadDefaultModel: loadDefaultOcctModel } = useOcctParser()

const { buildModel, clearModel } = useModelBuilder(scene, modelGroup, camera, controls, props, getThemeColor, emit)

const {
  isClipping, clipAxis, clipPos, clipMin, clipMax, clipFlip,
  updateClip, toggleClipping, flipClip, cleanup: cleanupClipping, reinitForModel
} = useClipping(scene, modelGroup)

const { currentView, resetView, setStandardView, applyCoordSystem } = useStandardViews(camera, controls, modelGroup)

const { dialogX, dialogY, startDrag } = useDragDialog(containerRef)
const { dialogX: colorDialogX, dialogY: colorDialogY, startDrag: startColorDrag } = useDragDialog(containerRef, { width: 320, height: 400 })

// ==================== 生命周期 ====================
// 主题监听
const isDark = useDark()
watch(isDark, (dark) => {
  updateTheme(dark)
}, { immediate: false })

onMounted(() => {
  window.addEventListener('resize', handleResize)
  // 容器尺寸变化（页脚显隐、侧边栏折叠等）也会改变画布可用高度，
  // window.resize 不触发，用 ResizeObserver 兜底保证画布始终填满容器
  if (typeof ResizeObserver !== 'undefined' && containerRef.value) {
    resizeObserver = new ResizeObserver(() => handleResize())
    resizeObserver.observe(containerRef.value)
  }
  initThree()
  // 初始化时应用当前主题
  updateTheme(isDark.value)
  // 监听用户手动旋转/缩放，取消标准视图高亮
  if (controls.value) {
    controls.value.addEventListener('change', () => {
      if (!isSettingView.value && currentView.value) {
        currentView.value = null
      }
    })
  }
  // 自定义交互：中键轨道球旋转相机（360° 无死角）/ 右键平移 / 滚轮缩放
  setupModelDragRotate()
  loadOcct().then(() => loadDefaultModel())
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  teardownModelDragRotate()
  cleanupClipping()
  disposeThree()
})

// ==================== 自定义模型交互控制器 ====================
// OrbitControls 已完全禁用（enabled=false），这里自定义全部鼠标交互：
//   - 中键拖拽：轨道球旋转相机 —— 绕"视点中心"做增量旋转，跟手、360° 无死角
//   - 右键拖拽：平移视点（相机 + target 一起移动）
//   - 滚轮：缩放（相机沿视线靠近/远离 target）
// 使用 mousedown 在容器上 + mousemove/mouseup 在 window 上的经典模式，
// 避免 pointer capture 与 OrbitControls 事件干扰。
let dragRotateCleanup = null
function setupModelDragRotate() {
  // 监听挂在容器上（而非 canvas），确保整个查看区域都能响应鼠标操作
  const dom = containerRef.value
  if (!dom) return

  let activeButton = -1   // 1=中键旋转，2=右键平移
  let lastX = 0
  let lastY = 0

  // 使用基础 mousedown/mousemove/mouseup 事件（最可靠，无 pointer capture 干扰）
  const onMouseDown = (e) => {
    // 中键（button 1）旋转，右键（button 2）平移；左键不处理
    if (e.button !== 1 && e.button !== 2) return
    e.preventDefault()
    activeButton = e.button
    lastX = e.clientX
    lastY = e.clientY
  }

  const onMouseMove = (e) => {
    if (activeButton === -1) return
    const dx = e.clientX - lastX
    const dy = e.clientY - lastY
    lastX = e.clientX
    lastY = e.clientY
    if (dx === 0 && dy === 0) return

    const cam = camera.value
    if (!cam) return

    if (activeButton === 1) {
      // ===== 中键：轨道球旋转相机（重新设计） =====
      // 绕"视点中心"（controls.target）做增量旋转：
      //   - 水平拖拽 → 绕相机上轴旋转（拖右 → 模型右转，跟手）
      //   - 垂直拖拽 → 绕相机右轴旋转（拖上 → 看到模型顶面，跟手）
      // 相机 up 轴跟随旋转：上下翻转 360° 连续、不卡极点、不产生歪斜。
      const target = controls.value?.target
      if (!target) return
      cam.updateMatrixWorld()

      const rotSpeed = 0.009   // 弧度/像素（跟手速度，越大转得越快）
      const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0).normalize()
      const up = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 1).normalize()

      const quatY = new THREE.Quaternion().setFromAxisAngle(up, -dx * rotSpeed)
      const quatX = new THREE.Quaternion().setFromAxisAngle(right, -dy * rotSpeed)

      // 相机位置绕 target 旋转
      const offset = cam.position.clone().sub(target)
      offset.applyQuaternion(quatY)
      offset.applyQuaternion(quatX)
      cam.position.copy(target).add(offset)

      // up 轴跟随旋转（保持 360° 翻转不卡死、无歪斜）
      cam.up.applyQuaternion(quatY)
      cam.up.applyQuaternion(quatX)
      cam.up.normalize()

      cam.lookAt(target)
    } else if (activeButton === 2) {
      // ===== 右键：平移相机 =====
      const panSpeed = 0.002
      const dist = cam.position.distanceTo(controls.value?.target || new THREE.Vector3())
      const factor = panSpeed * dist
      const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0).normalize()
      const up = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 1).normalize()
      const offset = new THREE.Vector3()
        .addScaledVector(right, -dx * factor)
        .addScaledVector(up, dy * factor)
      cam.position.add(offset)
      if (controls.value?.target) controls.value.target.add(offset)
    }

    // 触发 change 取消标准视图高亮
    controls.value?.dispatchEvent({ type: 'change' })
  }

  const onMouseUp = (e) => {
    if (e.button === activeButton) activeButton = -1
  }

  // 滚轮缩放（沿视线方向靠近/远离 target）
  // wheelDirection: 'normal' = 推滚轮缩小、拉滚轮放大（默认）；'inverse' = 反向
  const onWheel = (e) => {
    e.preventDefault()
    const cam = camera.value
    if (!cam) return
    const target = controls.value?.target || new THREE.Vector3()
    const dir = cam.position.clone().sub(target)
    const dist = dir.length()
    // 兼容触控板/鼠标：deltaMode 1 时 deltaY 为"行"，换算为像素
    const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
    const sign = wheelDirection.value === 'normal' ? -1 : 1
    const newDist = Math.max(0.5, Math.min(dist * Math.exp(sign * dy * 0.0012), 50000))
    dir.normalize().multiplyScalar(newDist)
    cam.position.copy(target).add(dir)
    controls.value?.dispatchEvent({ type: 'change' })
  }

  // 阻止右键菜单
  const onContextMenu = (e) => { e.preventDefault() }

  dom.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
  dom.addEventListener('wheel', onWheel, { passive: false })
  dom.addEventListener('contextmenu', onContextMenu)

  dragRotateCleanup = () => {
    dom.removeEventListener('mousedown', onMouseDown)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
    dom.removeEventListener('wheel', onWheel)
    dom.removeEventListener('contextmenu', onContextMenu)
    dragRotateCleanup = null
  }
}

function teardownModelDragRotate() {
  if (dragRotateCleanup) dragRotateCleanup()
}

// ==================== Watchers ====================
watch(() => props.coordSystem, (val) => {
  coordLabel.value = COORD_SYSTEMS[val]?.label || 'Y-up'
  applyCoordSystem(val, COORD_SYSTEMS)
})

watch(() => props.wireframe, (val) => {
  if (!modelGroup.value) return
  modelGroup.value.children.forEach(child => {
    const isEdge = child.name && (child.name.endsWith('_visibleEdges') || child.name.endsWith('_hiddenEdges') || child.name.endsWith('_outline'))
    if (child.isMesh && child.material && !isEdge) {
      // 线框模式：mesh 半透明；实体模式：使用颜色面板设置的不透明度
      child.material.transparent = val ? true : colorAlpha.value < 100
      child.material.opacity = val ? 0.15 : colorAlpha.value / 100
      child.material.depthWrite = !val
    }
    if (child.name && child.name.endsWith('_visibleEdges')) {
      // 可见边始终显示（不透明深色，CAD 带边着色风格）
      child.visible = true
    }
    if (child.name && child.name.endsWith('_hiddenEdges')) {
      child.visible = val
    }
  })
})

// ==================== 模型颜色 ====================
// 预设色板：第 1 行浅色系（浅灰 → 浅彩色，无深灰黑）；
// 第 2 行纯色系；第 3 行柔和色系。
const presetColors = [
  '#fcfcfc', '#e8e8e8', '#d4d4d4', '#c0c0c0', '#acacac',
  '#ffd9d9', '#ffe4cc', '#fff2cc', '#e8f2cc', '#d9f2e6',
  '#ff0000', '#ff6600', '#ffcc00', '#a8cc00', '#00cc00', '#00cc99', '#00b3cc', '#0066ff', '#3f00ff', '#6600cc',
  '#cc00cc', '#ff0099', '#ff3366', '#ff9999', '#ffcc99', '#ffff99', '#ccff99', '#99ffcc', '#99ccff', '#cc99ff'
]
const modelColor = ref('#fcfcfc')
const colorChanged = ref(false)
const colorDialogVisible = ref(false)

// 高级颜色面板状态（RGB / HSV / 色温 / 灰度 / 不透明度 / HEX）
const colorRgb = ref({ r: 252, g: 252, b: 252 })
const colorHsv = ref({ h: 0, s: 0, v: 99 })
const colorTemp = ref(50)   // 色温（0 冷 - 50 中性 - 100 暖）
const colorGray = ref(0)    // 灰度（0 原色 - 100 全灰）
const colorAlpha = ref(100)
const colorHex = ref('#fcfcfc')
const supportEyeDropper = typeof window !== 'undefined' && 'EyeDropper' in window
// 色温/灰度调节的基准色（RGB 或预设改变时重置）
let baseRgb = { r: 252, g: 252, b: 252 }

// 颜色转换工具
function hexToRgb(hex) {
  const h = String(hex || '').replace('#', '')
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  const n = parseInt(full, 16)
  if (Number.isNaN(n)) return { r: 0, g: 0, b: 0 }
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}
function rgbToHex(r, g, b) {
  const to2 = (v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')
  return `#${to2(r)}${to2(g)}${to2(b)}`
}
function rgbToHsv(r, g, b) {
  const rr = r / 255, gg = g / 255, bb = b / 255
  const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === rr) h = ((gg - bb) / d) % 6
    else if (max === gg) h = (bb - rr) / d + 2
    else h = (rr - gg) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  const s = max === 0 ? 0 : (d / max) * 100
  const v = max * 100
  return { h, s, v }
}
function hsvToRgb(h, s, v) {
  const ss = s / 100, vv = v / 100
  const c = vv * ss
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = vv - c
  let r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x }
  else if (h < 120) { r = x; g = c }
  else if (h < 180) { g = c; b = x }
  else if (h < 240) { g = x; b = c }
  else if (h < 300) { r = x; b = c }
  else { r = c; b = x }
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) }
}

// 从 HEX 同步 RGB/HSV（并重置色温/灰度基准）
function syncColorFromHex(hex) {
  const { r, g, b } = hexToRgb(hex)
  colorRgb.value = { r, g, b }
  colorHsv.value = rgbToHsv(r, g, b)
  baseRgb = { r, g, b }
  colorTemp.value = 50
  colorGray.value = 0
}

// RGB 变化 → 更新 HSV/HEX 并应用
function onRgbChange() {
  const { r, g, b } = colorRgb.value
  colorHsv.value = rgbToHsv(r, g, b)
  colorHex.value = rgbToHex(r, g, b)
  baseRgb = { r, g, b }
  colorTemp.value = 50
  colorGray.value = 0
  applyModelColor(colorHex.value)
}

// HSV 变化 → 更新 RGB/HEX 并应用
function onHsvChange() {
  const { r, g, b } = hsvToRgb(colorHsv.value.h, colorHsv.value.s, colorHsv.value.v)
  colorRgb.value = { r, g, b }
  colorHex.value = rgbToHex(r, g, b)
  baseRgb = { r, g, b }
  colorTemp.value = 50
  colorGray.value = 0
  applyModelColor(colorHex.value)
}

// 在基准色上应用色温 + 灰度，返回调整后的 RGB
function computeAdjustedColor() {
  let { r, g, b } = baseRgb
  // 色温：暖（>50）加红减蓝，冷（<50）减红加蓝
  const t = (colorTemp.value - 50) / 50
  r += t * 40
  b -= t * 40
  // 灰度：向亮度值混合（去饱和）
  if (colorGray.value > 0) {
    const gray = 0.299 * r + 0.587 * g + 0.114 * b
    const amt = colorGray.value / 100
    r = r + (gray - r) * amt
    g = g + (gray - g) * amt
    b = b + (gray - b) * amt
  }
  return {
    r: Math.round(Math.max(0, Math.min(255, r))),
    g: Math.round(Math.max(0, Math.min(255, g))),
    b: Math.round(Math.max(0, Math.min(255, b)))
  }
}

// 色温变化 → 重算并应用
function onColorTempChange() {
  const { r, g, b } = computeAdjustedColor()
  colorRgb.value = { r, g, b }
  colorHex.value = rgbToHex(r, g, b)
  applyModelColor(colorHex.value)
}

// 灰度变化 → 重算并应用
function onColorGrayChange() {
  const { r, g, b } = computeAdjustedColor()
  colorRgb.value = { r, g, b }
  colorHex.value = rgbToHex(r, g, b)
  applyModelColor(colorHex.value)
}

// 随机颜色
function randomColor() {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  const hex = rgbToHex(r, g, b)
  colorHex.value = hex
  syncColorFromHex(hex)
  applyModelColor(hex)
}

// HEX 输入变化
function onHexChange() {
  const hex = String(colorHex.value || '').trim()
  const valid = /^#?[0-9a-fA-F]{6}$/.test(hex)
  if (!valid) {
    colorHex.value = rgbToHex(colorRgb.value.r, colorRgb.value.g, colorRgb.value.b)
    return
  }
  const full = hex.startsWith('#') ? hex.toLowerCase() : '#' + hex.toLowerCase()
  colorHex.value = full
  syncColorFromHex(full)
  applyModelColor(full)
}

// 应用不透明度到所有实体网格
function applyModelAlpha() {
  if (!modelGroup.value) return
  const alpha = colorAlpha.value / 100
  modelGroup.value.children.forEach(child => {
    if (child.isMesh && child.material && !(child.name && child.name.endsWith('_outline'))) {
      if (!props.wireframe) {
        child.material.transparent = alpha < 1
        child.material.opacity = alpha
      }
    }
  })
}

// 不透明度变化 → 应用材质透明度（也算自定义，显示恢复默认）
function onAlphaChange() {
  applyModelAlpha()
  colorChanged.value = true
}

// 屏幕取色（EyeDropper API）
async function pickScreenColor() {
  if (!supportEyeDropper) return
  try {
    const eye = new EyeDropper()
    const result = await eye.open()
    const hex = result.sRGBHex.toLowerCase()
    colorHex.value = hex
    syncColorFromHex(hex)
    applyModelColor(hex)
  } catch (e) {
    // 用户取消取色，忽略
  }
}
// 滚轮缩放方向：'normal' = 推滚轮缩小、拉滚轮放大（默认）；'inverse' = 反向
const wheelDirection = ref('normal')

// 预设色块点击
function setModelColor(c) {
  modelColor.value = c
  colorHex.value = c
  syncColorFromHex(c)
  applyModelColor(c)
}

// 应用颜色到所有实体网格（边线/包围盒辅助线不受影响）
function applyModelColor(c) {
  if (!modelGroup.value) return
  const color = new THREE.Color(c)
  modelGroup.value.children.forEach(child => {
    const isEdge = child.name && (child.name.endsWith('_visibleEdges') || child.name.endsWith('_hiddenEdges') || child.name.endsWith('_outline'))
    if (child.isMesh && child.material && !isEdge) {
      child.material.color.copy(color)
    }
  })
  colorChanged.value = c !== '#fcfcfc'
}

// 恢复默认颜色与不透明度（与 useModelBuilder 的默认银白一致）
function resetModelColor() {
  modelColor.value = '#fcfcfc'
  colorAlpha.value = 100
  colorHex.value = '#fcfcfc'
  syncColorFromHex('#fcfcfc')
  applyModelColor('#fcfcfc')
  applyModelAlpha()
  colorChanged.value = false
}

// ==================== 拍照 ====================
function formatDateTime(d) {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

// 拍照：截取当前视角画面，左上角标注模型信息，保存为 PNG 下载
function takePhoto() {
  const r = renderer?.value
  const sc = scene?.value
  const cam = camera?.value
  if (!r || !sc || !cam) {
    ElMessage.warning('渲染器未就绪')
    return
  }
  if (!hasModel.value) {
    ElMessage.warning('请先加载模型')
    return
  }
  // 手动渲染一帧到画布，确保截图是最新画面
  r.setViewport(0, 0, r.domElement.width, r.domElement.height)
  r.setScissorTest(false)
  r.render(sc, cam)

  const srcCanvas = r.domElement
  const w = srcCanvas.width
  const h = srcCanvas.height
  const out = document.createElement('canvas')
  out.width = w
  out.height = h
  const ctx = out.getContext('2d')
  // 白色底（画布本身透明）
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.drawImage(srcCanvas, 0, 0)

  // 左上角信息水印（暗色主题用红色，保证清晰可见）
  const isDarkTheme = document.documentElement.classList.contains('dark')
  const pad = Math.round(w * 0.025)
  const fontSize = Math.round(Math.max(13, w * 0.014))
  ctx.font = `600 ${fontSize}px "Microsoft YaHei", "PingFang SC", sans-serif`
  ctx.fillStyle = isDarkTheme ? 'rgba(255, 77, 77, 0.95)' : 'rgba(30, 34, 40, 0.88)'
  const stats = modelStats.value || {}
  const volumeMm3 = stats.volumeMm3 ?? 0
  const volumeCm3 = volumeMm3 / 1000                    // mm³ → cm³
  const densityKgm3 = stats.density ?? props.density    // kg/m³
  const densityGcm3 = densityKgm3 / 1000                // kg/m³ → g/cm³
  const massKg = stats.massKg ?? (volumeMm3 / 1e9) * props.density
  const massG = massKg * 1000                           // kg → g
  const fmt = (v, d = 2) => v.toLocaleString('zh-CN', { maximumFractionDigits: d })
  const siteUrl = window.location.origin + window.location.pathname
  const lines = [
    `文件名：${currentFileName.value || '未命名'}`,
    `拍照时间：${formatDateTime(new Date())}`,
    `模型体积：${fmt(volumeCm3)} cm³`,
    `密度：${fmt(densityGcm3)} g/cm³`,
    `质量：${fmt(massG, 3)} g`,
    `网址：${siteUrl}`
  ]
  lines.forEach((t, i) => {
    ctx.fillText(t, pad, pad + fontSize * (i + 1.2))
  })

  // 下载 PNG
  out.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const base = (currentFileName.value || 'model').replace(/\.[^.]+$/, '')
    a.href = url
    a.download = `模型拍照_${base}_${Date.now()}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    ElMessage.success('拍照成功，图片已保存')
  }, 'image/png')
}

// ==================== 文件处理 ====================
function triggerFileSelect() { fileInputRef.value?.click() }

function handleFileChange(e) {
  const file = e.target.files?.[0]
  if (file) parseFile(file)
  e.target.value = ''
}

function handleDragover() { isDragover.value = true }
function handleDragleave() { isDragover.value = false }

function handleDrop(e) {
  isDragover.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) parseFile(file)
}

async function parseFile(file) {
  await parseOcctFile(file, {
    onSuccess: (result, fileName) => {
      const stats = buildModel(result, fileName)
      // 用户已自定义颜色/不透明度时，新模型保持
      if (colorChanged.value) {
        applyModelColor(modelColor.value)
        applyModelAlpha()
      }
      if (modelGroup.value.children.length === 0) {
        hasModel.value = false
        emit('model-error', new Error('没有有效的网格数据'))
        return
      }
      reinitForModel()
      applyCoordSystem(props.coordSystem, COORD_SYSTEMS)
      hasModel.value = true
      isDefaultModel.value = false
      currentFileName.value = fileName
      modelStats.value = stats || null
      ElMessage.success(`「${fileName}」加载成功`)
      emit('model-loaded', { fileName, result, isDefault: false })
    },
    onError: (err) => {
      hasModel.value = false
      emit('model-error', err)
    }
  })
}

// ==================== 默认模型 ====================
async function loadDefaultModel() {
  await loadDefaultOcctModel({
    onSuccess: (result, fileName) => {
      const stats = buildModel(result, fileName)
      // 用户已自定义颜色/不透明度时，新模型保持
      if (colorChanged.value) {
        applyModelColor(modelColor.value)
        applyModelAlpha()
      }
      if (modelGroup.value.children.length === 0) {
        hasModel.value = false
        return
      }
      reinitForModel()
      applyCoordSystem(props.coordSystem, COORD_SYSTEMS)
      hasModel.value = true
      isDefaultModel.value = true
      currentFileName.value = fileName
      modelStats.value = stats || null
      emit('model-loaded', { fileName, result, isDefault: true })
    },
    onError: (err) => {
      console.warn('初始模型加载出错:', err)
    }
  })
}

// ==================== 恢复默认模型 ====================
async function restoreDefaultModel() {
  clearModel()
  hasModel.value = false
  isDefaultModel.value = false
  cleanupClipping()
  await loadDefaultModel()
}

// 包装视图切换函数，设置标志位防止误清除高亮
function wrappedSetStandardView(viewName) {
  isSettingView.value = true
  setStandardView(viewName)
  requestAnimationFrame(() => { isSettingView.value = false })
}

function wrappedResetView() {
  isSettingView.value = true
  resetView()
  requestAnimationFrame(() => { isSettingView.value = false })
}

defineExpose({
  resetView: wrappedResetView, triggerFileSelect, restoreDefaultModel, setStandardView: wrappedSetStandardView
})
</script>

<style scoped>
.model-viewer-3d {
  width: 100%; height: 100%; position: relative; overflow: hidden;
  border-radius: 4px; background-color: var(--el-bg-color-page);
  border: 1px dashed var(--el-border-color); transition: border-color 0.3s;
}
.model-viewer-3d.is-dragover {
  border-color: var(--el-color-primary); background-color: var(--el-fill-color-light);
}
.model-viewer-3d :deep(canvas) { display: block; width: 100%; height: 100%; }

/* 顶部工具栏：悬浮于画布之上，所有按钮等距（统一 6px） */
.view-toolbar {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  z-index: 5;
}
.view-toolbar :deep(.el-button + .el-button) {
  margin-left: 0; /* 覆盖 Element Plus 的按钮相邻外边距，改用 flex gap 统一间距 */
}
/* 去掉按钮 type 切换的颜色过渡动画：点击立即响应（方向按钮等，与剖切/颜色按钮手感一致） */
.view-toolbar :deep(.el-button) {
  transition: none !important;
}
/* 视图组与功能组之间的分隔竖线 */
.toolbar-sep {
  width: 1px;
  height: 16px;
  background: var(--el-border-color);
  margin: 0 3px;
  flex-shrink: 0;
}
.loading-overlay {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 3px;
  background: rgba(0,0,0,0.5); z-index: 10; color: #fff; font-size: 14px;
}

/* 剖切控制弹窗（无圆角） */
.clip-dialog {
  position: absolute;
  top: 40px;
  right: 10px;
  width: 220px;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  z-index: 20;
  overflow: hidden;
}
.clip-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 4px;
  background: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color-lighter);
  cursor: move;
  user-select: none;
}
.clip-title { font-size: 13px; font-weight: 600; color: var(--el-text-color-primary); }
.clip-close { padding: 2px; }
.clip-dialog-body { padding: 3px; display: flex; flex-direction: column; gap: 2px; }
.clip-form-row { display: flex; flex-direction: column; gap: 2px; }
.clip-form-label { font-size: 12px; color: var(--el-text-color-regular); }
.clip-slider-wrap { display: flex; align-items: center; gap: 2px; }
.clip-slider-wrap .el-slider { flex: 1; }
.clip-pos-value { font-size: 12px; color: var(--el-text-color-primary); font-weight: 600; min-width: 36px; text-align: right; }

/* 弹窗内 Element 控件统一直角（不想要任何圆角） */
.clip-dialog :deep(.el-button),
.clip-dialog :deep(.el-radio-button__inner),
.clip-dialog :deep(.el-slider__runway),
.clip-dialog :deep(.el-slider__bar),
.color-dialog :deep(.el-button),
.color-dialog :deep(.el-color-picker__trigger),
.color-dialog :deep(.el-color-picker__trigger > span),
.color-dialog :deep(.el-color-picker__color) {
  border-radius: 0;
}

/* 颜色按钮上的当前色小圆点 */
.color-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  margin-right: 5px;
  vertical-align: middle;
  border: 1px solid rgba(0, 0, 0, 0.25);
}

/* 模型颜色弹窗（与剖切弹窗同风格，无圆角，可拖拽） */
.color-dialog {
  position: absolute;
  top: 40px;
  right: 10px;
  width: 320px;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  z-index: 20;
  overflow: hidden;
}
.color-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 4px;
  background: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color-lighter);
  cursor: move;
  user-select: none;
}
.color-title { font-size: 13px; font-weight: 600; color: var(--el-text-color-primary); }
.color-close { padding: 2px; }
.color-dialog-body {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.color-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.color-swatch {
  width: 20px;
  height: 20px;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.15);
  transition: transform 0.15s;
}
.color-swatch:hover {
  transform: scale(1.15);
}
.color-swatch.active {
  box-shadow: 0 0 0 2px var(--el-bg-color), 0 0 0 4px var(--el-color-primary);
}
/* 随机颜色按钮：与色块同高，宽度与两列色块对齐（46px = 20+6+20，对应第 10/11 列位置） */
.color-random {
  width: 46px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  cursor: pointer;
  border: 1px solid var(--el-border-color);
  border-radius: 0;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
  padding: 0;
  transition: transform 0.15s;
}
.color-random:hover {
  transform: scale(1.06);
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}
.color-custom {
  display: flex;
  align-items: center;
  gap: 8px;
}
.color-custom-label {
  font-size: 12px;
  color: var(--el-text-color-regular);
}
.color-reset {
  text-align: right;
}

/* 高级颜色面板（RGB / 色调 / 饱和度 / 亮度 / 不透明度 / HEX / 屏幕取色） */
.color-advanced {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.color-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.color-row .el-slider {
  flex: 1;
}
.color-row-label {
  width: 34px;
  flex-shrink: 0;
  font-size: 12px;
  color: var(--el-text-color-regular);
}
.color-num {
  width: 46px;
  flex-shrink: 0;
  border: 1px solid var(--el-border-color);
  border-radius: 0;
  background: var(--el-fill-color-blank);
  color: var(--el-text-color-primary);
  font-size: 12px;
  text-align: center;
  padding: 2px 4px;
}
.color-val {
  width: 40px;
  flex-shrink: 0;
  text-align: right;
  font-size: 12px;
  color: var(--el-text-color-primary);
}
.color-bottom {
  display: flex;
  align-items: center;
  gap: 6px;
}
.color-hex-input {
  flex: 1;
  border: 1px solid var(--el-border-color);
  border-radius: 0;
  background: var(--el-fill-color-blank);
  color: var(--el-text-color-primary);
  font-size: 12px;
  padding: 3px 6px;
}
</style>
