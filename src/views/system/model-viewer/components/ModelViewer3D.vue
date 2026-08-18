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

    <!-- 顶部标准视图工具栏 -->
    <div class="view-toolbar">
      <el-button-group>
        <el-button size="small" :type="currentView === 'front' ? 'primary' : 'default'" title="前视" @click="wrappedSetStandardView('front')">前视图</el-button>
        <el-button size="small" :type="currentView === 'back' ? 'primary' : 'default'" title="后视" @click="wrappedSetStandardView('back')">后视图</el-button>
        <el-button size="small" :type="currentView === 'top' ? 'primary' : 'default'" title="上视" @click="wrappedSetStandardView('top')">上视图</el-button>
        <el-button size="small" :type="currentView === 'bottom' ? 'primary' : 'default'" title="下视" @click="wrappedSetStandardView('bottom')">下视图</el-button>
        <el-button size="small" :type="currentView === 'left' ? 'primary' : 'default'" title="左视" @click="wrappedSetStandardView('left')">左视图</el-button>
        <el-button size="small" :type="currentView === 'right' ? 'primary' : 'default'" title="右视" @click="wrappedSetStandardView('right')">右视图</el-button>
        <el-button size="small" :type="currentView === 'iso' ? 'primary' : 'default'" title="等轴测" @click="wrappedSetStandardView('iso')">轴测图</el-button>
      </el-button-group>
      <el-divider direction="vertical" style="margin:0 2px" />
      <el-button
        size="small"
        :type="isClipping ? 'danger' : 'default'"
        @click="toggleClipping"
      >
        {{ isClipping ? '关闭剖切' : '剖切' }}
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

    <input ref="fileInputRef" type="file" accept=".step,.stp,.iges,.igs,.brep" style="display: none" @change="handleFileChange" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as THREE from 'three'
import { useDark } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { Loading, Close, Switch } from '@element-plus/icons-vue'
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

// ==================== 生命周期 ====================
// 主题监听
const isDark = useDark()
watch(isDark, (dark) => {
  updateTheme(dark)
}, { immediate: false })

onMounted(() => {
  window.addEventListener('resize', handleResize)
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

      const rotSpeed = 0.006   // 弧度/像素
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
  const onWheel = (e) => {
    e.preventDefault()
    const cam = camera.value
    if (!cam) return
    const target = controls.value?.target || new THREE.Vector3()
    const dir = cam.position.clone().sub(target)
    const dist = dir.length()
    // 兼容触控板/鼠标：deltaMode 1 时 deltaY 为"行"，换算为像素
    const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
    const newDist = Math.max(0.5, Math.min(dist * Math.exp(dy * 0.0012), 50000))
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
    if (child.isMesh && child.material) {
      // 工程图模式：mesh 半透明，显示可见边（实线）和隐藏边（虚线）
      child.material.transparent = val
      child.material.opacity = val ? 0.15 : 1.0
      child.material.depthWrite = !val
    }
    if (child.name && child.name.endsWith('_visibleEdges')) {
      // 可见边始终显示：实体模式淡色轮廓 / 线框模式加深
      child.visible = true
      child.material.opacity = val ? 0.95 : 0.6
    }
    if (child.name && child.name.endsWith('_hiddenEdges')) {
      child.visible = val
    }
  })
})

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
      buildModel(result, fileName)
      if (modelGroup.value.children.length === 0) {
        hasModel.value = false
        emit('model-error', new Error('没有有效的网格数据'))
        return
      }
      reinitForModel()
      applyCoordSystem(props.coordSystem, COORD_SYSTEMS)
      hasModel.value = true
      isDefaultModel.value = false
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
      buildModel(result, fileName)
      if (modelGroup.value.children.length === 0) {
        hasModel.value = false
        return
      }
      reinitForModel()
      applyCoordSystem(props.coordSystem, COORD_SYSTEMS)
      hasModel.value = true
      isDefaultModel.value = true
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
.loading-overlay {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 3px;
  background: rgba(0,0,0,0.5); z-index: 10; color: #fff; font-size: 14px;
}

/* 剖切控制弹窗 */
.clip-dialog {
  position: absolute;
  top: 40px;
  right: 10px;
  width: 220px;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
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
</style>
