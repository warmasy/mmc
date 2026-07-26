<template>
  <div
    ref="containerRef"
    class="model-viewer-3d"
    :class="{ 'is-dragover': isDragover }"
    @dragover.prevent="handleDragover"
    @dragleave="handleDragleave"
    @drop.prevent="handleDrop"
  >
    <div v-if="!hasModel" class="empty-state">
      <el-icon :size="64" class="empty-icon"><component :is="UploadFilled" /></el-icon>
      <p class="empty-title">拖拽 STEP/STP 文件到此处</p>
      <p class="empty-hint">支持 .step / .stp / .iges / .igs / .brep</p>
    </div>

    <div v-if="isLoading" class="loading-overlay">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
      <span>正在解析模型...</span>
    </div>

    <!-- 顶部标准视图工具栏 -->
    <div class="view-toolbar">
      <el-button-group>
        <el-button size="small" title="前视" @click="wrappedSetStandardView('front')">前视图</el-button>
        <el-button size="small" title="后视" @click="wrappedSetStandardView('back')">后视图</el-button>
        <el-button size="small" title="上视" @click="wrappedSetStandardView('top')">上视图</el-button>
        <el-button size="small" title="下视" @click="wrappedSetStandardView('bottom')">下视图</el-button>
        <el-button size="small" title="左视" @click="wrappedSetStandardView('left')">左视图</el-button>
        <el-button size="small" title="右视" @click="wrappedSetStandardView('right')">右视图</el-button>
        <el-button size="small" :type="currentView === 'iso' ? 'primary' : 'default'" title="等轴测" @click="wrappedSetStandardView('iso')">轴测图</el-button>
      </el-button-group>
      <el-divider direction="vertical" style="margin:0 8px" />
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
import { ElMessage } from 'element-plus'
import { UploadFilled, Loading, Close, Switch } from '@element-plus/icons-vue'
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
  initThree, disposeThree, handleResize
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
onMounted(() => {
  window.addEventListener('resize', handleResize)
  initThree()
  // 监听用户手动旋转/缩放，取消标准视图高亮
  if (controls.value) {
    controls.value.addEventListener('change', () => {
      if (!isSettingView.value && currentView.value) {
        currentView.value = null
      }
    })
  }
  loadOcct().then(() => loadDefaultModel())
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  cleanupClipping()
  disposeThree()
})

// ==================== Watchers ====================
watch(() => props.coordSystem, (val) => {
  coordLabel.value = COORD_SYSTEMS[val]?.label || 'Y-up'
  applyCoordSystem(val, COORD_SYSTEMS)
})

watch(() => props.wireframe, (val) => {
  if (!modelGroup.value) return
  modelGroup.value.children.forEach(child => {
    if (child.isMesh && child.material) child.material.wireframe = val
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
  border-color: var(--el-color-primary); background-color: var(--el-color-primary-light-9);
}
.model-viewer-3d :deep(canvas) { display: block; width: 100%; height: 100%; }
.empty-state {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; pointer-events: none; z-index: 1;
}
.empty-icon { color: var(--el-text-color-secondary); opacity: 0.4; margin-bottom: 16px; }
.empty-title { font-size: 16px; color: var(--el-text-color-regular); margin-bottom: 8px; }
.empty-hint { font-size: 12px; color: var(--el-text-color-placeholder); margin-bottom: 4px; }
.loading-overlay {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 12px;
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
  padding: 8px 12px;
  background: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color-lighter);
  cursor: move;
  user-select: none;
}
.clip-title { font-size: 13px; font-weight: 600; }
.clip-close { padding: 2px; }
.clip-dialog-body { padding: 12px; display: flex; flex-direction: column; gap: 10px; }
.clip-form-row { display: flex; flex-direction: column; gap: 4px; }
.clip-form-label { font-size: 12px; color: var(--el-text-color-secondary); }
.clip-slider-wrap { display: flex; align-items: center; gap: 8px; }
.clip-slider-wrap .el-slider { flex: 1; }
.clip-pos-value { font-size: 12px; color: var(--el-color-primary); font-weight: 600; min-width: 36px; text-align: right; }
</style>
